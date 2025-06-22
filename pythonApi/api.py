from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import io
import json
import requests
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image
import cv2
import torch
from torchvision import transforms
import timm
from sklearn.cluster import KMeans
import pytesseract
import pypdfium2
from ultralytics import YOLO
import fitz
import re
import logging
from PyPDF2 import PdfReader
import pandas as pd
import pdfplumber
import tensorflow as tf
from tensorflow.keras.models import Model, load_model
import google.generativeai as genai
import base64
from datetime import datetime
import cloudinary
import cloudinary.utils
import time
from dotenv import load_dotenv
import uuid
import retrying

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for debugging
logging.basicConfig(level=logging.INFO)

# Load environment variables
load_dotenv(".env")

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Configure Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Configure Gemini API key
GEMINI_API_KEY = "AIzaSyB5bVFt2-MMxvx2g3Zi7ZdSZQNWyTFRyp0"
try:
    genai.configure(api_key=GEMINI_API_KEY)
except Exception as e:
    logging.error(f"Failed to configure Gemini API: {str(e)}")

# Vehicle-related configurations
class_names_vehicle = ["Alfa", "Audi", "BMW", "Chevrolet", "Citroen", "Dacia", "Daewoo", "Dodge", "Ferrari", "Fiat", "Ford", "Honda", "Hyundai", "Jaguar", "Jeep", "Kia", "Lada", "Lancia", "Land", "Lexus", "Maserati", "Mazda", "Mercedes", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rover", "Saab", "Seat", "Skoda", "Subaru", "Suzuki", "Tata", "Tesla", "Toyota", "Volkswagen", "Volvo"]

transform = transforms.Compose([
    transforms.Resize((384, 384)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

COLOR_NAMES = {
    'Black': (0, 0, 0),
    'White': (255, 255, 255),
    'Red': (255, 0, 0),
    'Blue': (0, 0, 255),
    'Yellow': (255, 255, 0),
    'Gray': (128, 128, 128),
    'Maroon': (128, 0, 0),
    'Green': (0, 128, 0),
    'Navy': (0, 0, 128),
    'Orange': (255, 165, 0),
    'Brown': (139, 69, 19),
}

ALLOWED_EXTENSIONS = {'.pdf', '.jpg', '.jpeg', '.png', '.csv'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Fracture class names for X-ray analysis
class_names_fracture = [
    "Avulsion Fracture", "Comminuted Fracture", "Fracture Dislocation",
    "Greenstick Fracture", "Hairline Fracture", "Impacted Fracture",
    "Longitudinal Fracture", "Oblique Fracture", "Pathological Fracture",
    "Spiral Fracture"
]

# Load EfficientNetV2 for vehicle processing
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
try:
    model_vehicle = timm.create_model('efficientnetv2_rw_m', pretrained=False, num_classes=len(class_names_vehicle))
    model_vehicle.load_state_dict(torch.load("efficientnetv2_rw_m_best.pt", map_location=device))
    model_vehicle.to(device).eval()
except Exception as e:
    logging.warning(f"Failed to load vehicle model: {str(e)}")

# Load EfficientNetV2 for fracture analysis
try:
    model_fracture = load_model("model_efficientnetv2m.h5")
    last_conv_layer_name = "top_conv"
except Exception as e:
    logging.warning(f"Failed to load fracture model: {str(e)}")
    model_fracture = None

# Helper function for Gemini analysis with retry
# @retrying.retry(stop_max_attempt_number=3, wait_exponential_multiplier=1000, wait_exponential_max=10000)
def get_gemini_analysis(json_output, endpoint_type, vehicle_number_match, maker_match, confidence):
    try:
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')  # Updated model name
        prompt = f"""
        Analyze the following JSON output from a {endpoint_type} insurance processing endpoint.
        Note: Treat 'MARUTI' and 'SUZUKI' as the same brand for all analyses.

        Tasks:
        1. Compute an aiScore (0-100) based on the consistency of vehicle details, including:
           - Match between vehicle number in input and bill text (vehicle_number_match: {vehicle_number_match}).
           - Match between detected car maker (detected_car_maker) and bill text, considering MARUTI/SUZUKI equivalence (vehicle_maker_match: {maker_match}).
           - Match between predicted car brand and detected car maker (match_status).
           - Suspiciousness of PDF metadata (pdf_metadata.Suspicious).
           Assign weights to each factor and provide a score from 0 to 100.
        2. Compute an aiConfidence (0.0-1.0) reflecting the reliability of the analysis, considering:
           - Confidence of damage prediction (confidence: {confidence}).
           - Presence of suspicious metadata.
           - Strength of matches (vehicle_number_match, vehicle_maker_match).
        3. Provide actionable suggestions for verification, fraud detection, or next steps (up to 5 items) as a single text block, separated by newlines.

        Return a JSON object with:
        - aiScore: integer (0-100)
        - aiConfidence: float (0.0-1.0)
        - aiSuggestions: string (suggestions separated by newlines)

        Ensure the response is valid JSON without any code block markers (e.g., ```json or ```). Example:
        {{"aiScore": 80, "aiConfidence": 0.9, "aiSuggestions": "Verify vehicle details.\nCheck bill authenticity."}}

        JSON Input: {json.dumps(json_output, indent=2)}
        """
        response = gemini_model.generate_content([prompt])
        logging.info(f"Gemini raw response: {response.text[:500]}...")
        if not response.text.strip():
            raise ValueError("Empty response from Gemini")

        # Strip code block markers if present
        response_text = response.text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:].strip()  # Remove ```json
            if response_text.endswith('```'):
                response_text = response_text[:-3].strip()  # Remove ```

        try:
            response_json = json.loads(response_text)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to parse Gemini response as JSON: {response_text}")
            raise ValueError(f"Invalid JSON response: {str(e)}")
        
        return {
            "aiScore": min(max(response_json.get("aiScore", 0), 0), 100),
            "aiConfidence": min(max(response_json.get("aiConfidence", 0.0), 0.0), 1.0),
            "aiSuggestions": response_json.get("aiSuggestions", "Error generating suggestions").split('\n')
        }
    except Exception as e:
        logging.error(f"Gemini analysis error: {str(e)}")
        # Fallback logic
        ai_score = 50 * vehicle_number_match + 50 * maker_match
        ai_confidence = round(0.7 * confidence + 0.3 * (ai_score / 100), 2) if confidence else 0.0
        return {
            "aiScore": ai_score,
            "aiConfidence": ai_confidence,
            "aiSuggestions": "Fallback used due to Gemini API failure.\nVerify vehicle registration manually.\nCross-check bill with official records."
        }
# Cloudinary Helper Functions
def get_signed_url(public_id, resource_type='raw', expires_in=300):
    try:
        expires_at = int(time.time()) + expires_in
        url, _ = cloudinary.utils.cloudinary_url(
            public_id,
            resource_type=resource_type,
            type="authenticated",
            sign_url=True,
            expires_at=expires_at
        )
        return url
    except Exception as e:
        logging.error(f"Failed to generate signed URL for {public_id}: {str(e)}")
        raise ValueError(f"Could not generate signed URL: {str(e)}")

def download_file(public_id, save_path, resource_type='raw'):
    try:
        url = get_signed_url(public_id, resource_type=resource_type)
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            logging.info(f"Downloaded {public_id} to {save_path}")
        else:
            raise ValueError(f"Download failed for {public_id}: HTTP {response.status_code}")
    except Exception as e:
        logging.error(f"Failed to download {public_id}: {str(e)}")
        raise ValueError(f"Could not download file: {str(e)}")

# Other helper functions
def allowed_file(filename):
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

def closest_color_name(rgb):
    r, g, b = rgb
    return min(COLOR_NAMES, key=lambda name: np.linalg.norm(np.array(COLOR_NAMES[name]) - np.array([r, g, b])))

def extract_vehicle_details(vehicle_number):
    soap_body = f"""<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                   xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <CheckIndia xmlns="http://regcheck.org.uk">
          <RegistrationNumber>{vehicle_number}</RegistrationNumber>
          <username>nutsofbengal</username>
        </CheckIndia>
      </soap:Body>
    </soap:Envelope>"""

    headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction": "http://regcheck.org.uk/CheckIndia"
    }

    try:
        response = requests.post("https://www.carregistrationapi.in/api/reg.asmx", data=soap_body, headers=headers)
        root = ET.fromstring(response.content)
        ns = {'soap': 'http://schemas.xmlsoap.org/soap/envelope/', 'ns': 'http://regcheck.org.uk'}
        vehicle_json_text = root.find('.//ns:CheckIndiaResult/ns:vehicleJson', ns)
        if vehicle_json_text is not None:
            data = json.loads(vehicle_json_text.text.strip())
            return data.get("CarMake", {}).get("CurrentTextValue", "Unknown").strip().upper()
    except Exception as e:
        return f"Error: {str(e)}"
    return "Unknown"

def convert_pdf_to_images(pdf_path):
    try:
        pdf = pypdfium2.PdfDocument(pdf_path)
        try:
            images = [page.render(scale=2).to_pil() for page in pdf]
            return images
        finally:
            pdf.close()
    except Exception as e:
        raise ValueError(f"Failed to convert PDF to images: {str(e)}")

def extract_text_from_file(file_path):
    try:
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            images = convert_pdf_to_images(file_path)
            text = "\n".join([pytesseract.image_to_string(img) for img in images])
        elif ext in [".jpg", ".jpeg", ".png"]:
            img = cv2.imread(file_path)
            if img is None:
                raise ValueError("Failed to load image")
            text = pytesseract.image_to_string(img)
        else:
            raise ValueError("Unsupported file format: must be PDF or image.")
        return text
    except Exception as e:
        raise ValueError(f"Text extraction failed: {str(e)}")

def extract_fields(text):
    fields = {}
    text = text.lower()
    text = re.sub(r'\n+', '\n', text)
    text = re.sub(r'\s{2,}', ' ', text)

    def find_field(pattern):
        match = re.search(pattern, text)
        return match.group(1).strip().title() if match else "Not Found"

    fields['name'] = find_field(r'name\s*[:\-]?\s*([a-z\s]+?)(?=\n|sex|father|place)')
    fields['father_name'] = find_field(
        r"(?:name\s+of\s+)?(?:father|father/husband|father or husband)\s*[:\-]?\s*([a-z\s]+?)(?=\n|sex|name|place)"
    )
    fields['sex'] = find_field(r"sex\s*[:\-]?\s*(male|female|other)")
    fields['place_of_death'] = find_field(r'place\s+of\s+death\s*[:\-]?\s*([a-z,\s]+?)(?=\n|name|sex|father)')
    return fields

def check_pdf_metadata(pdf_path):
    suspicious = False
    report = {}
    try:
        doc = fitz.open(pdf_path)
        try:
            meta = doc.metadata
            producer = meta.get("producer", "").lower()
            creator = meta.get("creator", "").lower()
            creation_date = meta.get("creationDate", "")
            mod_date = meta.get("modDate", "")

            if any(x in producer for x in ["scanner", "camscanner", "ilovepdf", "photoshop", "unknown"]):
                suspicious = True
                report['issue'] = f"Suspicious PDF producer: {producer}"
            elif not creation_date or not mod_date:
                suspicious = True
                report['issue'] = "Missing creation/modification dates"
            elif not any([producer, creator]):
                suspicious = True
                report['issue'] = "Missing metadata (producer/creator)"
            else:
                report['issue'] = "No obvious metadata issue"

            report.update({
                "Producer": producer,
                "Creator": creator,
                "CreationDate": creation_date,
                "ModDate": mod_date,
                "Suspicious": suspicious
            })
        finally:
            doc.close()
    except Exception as e:
        report = {
            "issue": f"Metadata extraction failed: {str(e)}",
            "Suspicious": False,
            "Producer": "",
            "Creator": "",
            "CreationDate": "",
            "ModDate": ""
        }
    return report

def compare_documents(file1_path, file2_path):
    try:
        text1 = extract_text_from_file(file1_path)
        text2 = extract_text_from_file(file2_path)
    except ValueError as e:
        raise e

    fields1 = extract_fields(text1)
    fields2 = extract_fields(text2)

    result = {}
    for key in ['name', 'sex', 'father_name', 'place_of_death']:
        val1 = fields1.get(key, "Not Found").replace('\n', ' ')
        val2 = fields2.get(key, "Not Found").replace('\n', ' ')
        result[key] = {
            'document_1': val1,
            'document_2': val2,
            'match': val1 == val2
        }
    return result

def check_policy_metadata(pdf_path):
    suspicious_keywords = {
        "modified": 0.3,
        "foxit": 0.4,
        "nitro": 0.3,
        "camscanner": 0.5,
        "ilovepdf": 0.4,
        "pdf editor": 0.4
    }
    try:
        reader = PdfReader(pdf_path)
        metadata = reader.metadata or {}
        metadata_strings = {k: str(v) for k, v in metadata.items()}
        flagged = False
        suspicious_items = {}
        risk_score = 0.0

        for key, val in metadata_strings.items():
            val_lower = val.lower()
            for keyword, weight in suspicious_keywords.items():
                if keyword in val_lower:
                    flagged = True
                    suspicious_items[key] = val
                    risk_score += weight

        risk_score = min(risk_score, 1.0)
        confidence_score = 1.0 - risk_score if flagged else round(0.95 + 0.05 * len(metadata_strings) / 10, 2)
        confidence_score = round(min(confidence_score, 1.0), 2)

        return {
            "document_status": "flagged" if flagged else "not flagged",
            "confidence_score": confidence_score,
            "suspicious_metadata": suspicious_items if flagged else {},
            "all_metadata": metadata_strings
        }
    except Exception as e:
        return {
            "document_status": "error",
            "confidence_score": 0.0,
            "suspicious_metadata": {},
            "all_metadata": {},
            "error": str(e)
        }

def verify_policy_document(policy_path, product_csv_path):
    try:
        pdf = pypdfium2.PdfDocument(policy_path)
        try:
            page = pdf[0]
            bitmap = page.render(scale=2.0)
            image = bitmap.to_pil()
            text = pytesseract.image_to_string(image)
        finally:
            pdf.close()

        uin_match = re.search(r"(?:UIN|Unique Identification No)[\s:]*([A-Z0-9/./-]+)", text, re.IGNORECASE)
        uin = uin_match.group(1).strip() if uin_match else None

        result = {
            "uin": uin,
            "uin_found": bool(uin),
            "product_name": None,
            "product_name_found": False,
            "product_match": False,
            "text_preview": text[:500]
        }

        if uin:
            df = pd.read_csv(product_csv_path)
            matched_row = df[df['UIN'].str.strip() == uin.strip()]
            if not matched_row.empty:
                product_name = matched_row.iloc[0]['Product Name']
                result["product_name"] = product_name
                result["product_match"] = True
                result["product_name_found"] = product_name.lower() in text.lower()

        return result
    except Exception as e:
        return {
            "uin": None,
            "uin_found": False,
            "product_name": None,
            "product_name_found": False,
            "product_match": False,
            "text_preview": "",
            "error": str(e)
        }

def verify_medical_bill(bill_path, nlem_csv_path):
    try:
        bill_data = []
        with pdfplumber.open(bill_path) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    for row in table[1:]:
                        if len(row) >= 5:
                            bill_data.append({
                                'Medicines': row[1] or '',
                                'Dosage form and strength': row[2] or '',
                                'Unit/Pack size': row[3] or '',
                                'Total Price (Rs.)': row[4] or ''
                            })

        bill_df = pd.DataFrame(bill_data)
        bill_df['Medicines'] = bill_df['Medicines'].str.strip()
        bill_df['Dosage form and strength'] = bill_df['Dosage form and strength'].str.replace(r'\$', '', regex=True).str.strip()
        bill_df['Unit/Pack size'] = bill_df['Unit/Pack size'].str.strip()
        bill_df['Total Price (Rs.)'] = pd.to_numeric(bill_df['Total Price (Rs.)'], errors='coerce')

        nlem_df = pd.read_csv(nlem_csv_path, usecols=['Medicines', 'Dosage form and strength', 'Unit/Pack size', 'Ceiling Price (Rs.)'])
        nlem_df['Medicines'] = nlem_df['Medicines'].str.strip()
        nlem_df['Dosage form and strength'] = nlem_df['Dosage form and strength'].str.strip()
        nlem_df['Unit/Pack size'] = nlem_df['Unit/Pack size'].str.strip()
        nlem_df['Ceiling Price (Rs.)'] = pd.to_numeric(nlem_df['Ceiling Price (Rs.)'], errors='coerce')

        results = []
        for _, bill_row in bill_df.iterrows():
            medicine = bill_row['Medicines']
            dosage = bill_row['Dosage form and strength']
            unit_pack = bill_row['Unit/Pack size']
            billed_price = bill_row['Total Price (Rs.)']
            pack_size_match = re.match(r'(\d+)\s*(Tablet|ml)', unit_pack, re.IGNORECASE)
            if pack_size_match:
                pack_size = float(pack_size_match.group(1))
                unit_type = pack_size_match.group(2).lower()
            else:
                pack_size = 1.0
                unit_type = unit_pack.lower()
            quantity = 1.0

            nlem_match = nlem_df[
                (nlem_df['Medicines'].str.lower() == medicine.lower()) &
                (nlem_df['Dosage form and strength'].str.contains(dosage.split()[-2], case=False, na=False)) &
                (nlem_df['Unit/Pack size'].str.contains(unit_type, case=False, na=False))
            ]

            if not nlem_match.empty:
                ceiling_price = nlem_match['Ceiling Price (Rs.)'].iloc[0]
                csv_pack_size_match = re.match(r'(\d+)\s*(Tablet|ml)', nlem_match['Unit/Pack size'].iloc[0], re.IGNORECASE)
                csv_pack_size = float(csv_pack_size_match.group(1)) if csv_pack_size_match else 1.0
                scaled_ceiling_price = ceiling_price * (pack_size / csv_pack_size)
                expected_total = scaled_ceiling_price * quantity
                overcharged_flag = billed_price > expected_total + 0.01
                overcharged_amount = billed_price - expected_total if overcharged_flag else 0.0
            else:
                ceiling_price = None
                scaled_ceiling_price = None
                expected_total = None
                overcharged_flag = False
                overcharged_amount = 0.0

            results.append({
                'Medicine': medicine,
                'Dosage Form': dosage,
                'Unit/Pack Size': unit_pack,
                'Quantity': quantity,
                'Billed Price (Rs.)': billed_price,
                'Ceiling Price (Rs./Unit)': scaled_ceiling_price,
                'Expected Total Price (Rs.)': expected_total,
                'Overcharged Flag': overcharged_flag,
                'Overcharged Amount (Rs.)': overcharged_amount
            })

        results_df = pd.DataFrame(results)
        total_overcharged = results_df['Overcharged Amount (Rs.)'].sum()

        return {
            "results": results_df.to_dict(orient='records'),
            "total_amount_overcharged": float(round(total_overcharged, 2))
        }
    except Exception as e:
        return {
            "results": [],
            "total_amount_overcharged": 0.0,
            "error": str(e)
        }

def overlay_heatmap_on_image(img, heatmap, alpha=0.5):
    try:
        heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
        heatmap = (heatmap * 255).astype(np.uint8)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_VIRIDIS)
        superimposed_img = cv2.addWeighted(img, 1 - alpha, heatmap, alpha, 0)
        return superimposed_img
    except Exception as e:
        raise ValueError(f"Failed to overlay heatmap: {str(e)}")

def image_to_base64(image):
    try:
        _, buffer = cv2.imencode('.jpg', image)
        return base64.b64encode(buffer).decode('utf-8')
    except Exception as e:
        raise ValueError(f"Failed to encode image to base64: {str(e)}")

def get_gemini_description(original_image_path, heatmap_path, overlay_path):
    try:
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
        with open(original_image_path, "rb") as img_file:
            original_b64 = base64.b64encode(img_file.read()).decode('utf-8')
        with open(heatmap_path, "rb") as img_file:
            heatmap_b64 = base64.b64encode(img_file.read()).decode('utf-8')
        with open(overlay_path, "rb") as img_file:
            overlay_b64 = base64.b64encode(img_file.read()).decode('utf-8')
        response = gemini_model.generate_content([
            "This is the original X-ray image, the heatmap generated by Grad-CAM, and the original image with the overlaid heatmap. Explain the medical findings based on this heatmap and what type of fracture is shown in the X-ray image.",
            {"mime_type": "image/jpeg", "data": original_b64},
            {"mime_type": "image/jpeg", "data": heatmap_b64},
            {"mime_type": "image/jpeg", "data": overlay_b64}
        ])
        return response.text
    except Exception as e:
        return f"Error generating Gemini description: {str(e)}"

def make_gradcam_heatmap(img_array, model, last_conv_layer_name):
    try:
        if not isinstance(img_array, np.ndarray):
            raise ValueError(f"img_array must be a NumPy array, got {type(img_array)}: {img_array}")
        expected_shape = (1, 256, 256, 3)
        if img_array.shape != expected_shape:
            raise ValueError(f"Invalid input shape: expected {expected_shape}, got {img_array.shape}")

        logging.debug(f"img_array type: {type(img_array)}, shape: {img_array.shape}, dtype: {img_array.dtype}")
        logging.debug(f"Model output structure: {model.output}")

        grad_model = Model(inputs=model.inputs, outputs=[
            model.get_layer(last_conv_layer_name).output, model.output
        ])

        with tf.GradientTape() as tape:
            outputs = grad_model(img_array)
            logging.debug(f"grad_model outputs type: {type(outputs)}, contents: {[getattr(o, 'shape', 'N/A') for o in outputs] if isinstance(outputs, list) else outputs.shape}")

            if isinstance(outputs, list):
                if len(outputs) != 2:
                    raise ValueError(f"Expected two outputs (conv_outputs, predictions), got {len(outputs)}: {outputs}")
                conv_outputs, predictions = outputs
            else:
                conv_outputs, predictions = outputs, outputs

            logging.debug(f"conv_outputs type: {type(conv_outputs)}, shape: {getattr(conv_outputs, 'shape', 'N/A')}")
            logging.debug(f"predictions type: {type(predictions)}, contents: {predictions}")

            if isinstance(predictions, list):
                logging.debug(f"predictions is a list with {len(predictions)} elements")
                for i, pred in enumerate(predictions):
                    pred_tensor = tf.convert_to_tensor(pred)
                    if len(pred_tensor.shape) == 2 and pred_tensor.shape[1] == len(class_names_fracture):
                        predictions = pred_tensor
                        logging.debug(f"Selected predictions[{i}] type: {type(predictions)}, shape: {predictions.shape}")
                        break
                else:
                    raise ValueError(f"No valid classification tensor found in predictions list: {predictions}")
            else:
                predictions = tf.convert_to_tensor(predictions)

            if len(predictions.shape) != 2:
                raise ValueError(f"Unexpected predictions shape: {predictions.shape}, expected (batch_size, num_classes)")

            class_idx = tf.argmax(predictions[0])
            loss = predictions[0, class_idx]

        grads = tape.gradient(loss, conv_outputs)
        if grads is None:
            raise ValueError("Gradients are None; check model and input compatibility")

        logging.debug(f"grads type: {type(grads)}, shape: {getattr(grads, 'shape', 'N/A')}")

        grads = grads[0]
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]

        heatmap = tf.reduce_sum(tf.multiply(conv_outputs, pooled_grads), axis=-1)
        heatmap = tf.maximum(heatmap, 0)
        heatmap_max = tf.reduce_max(heatmap)
        if heatmap_max > 0:
            heatmap /= heatmap_max
        else:
            logging.warning("Heatmap max is zero; returning zero heatmap")
            heatmap = tf.zeros_like(heatmap)

        return heatmap.numpy(), int(class_idx), float(predictions[0, class_idx])
    except Exception as e:
        logging.error(f"Grad-CAM error: {str(e)}")
        raise ValueError(f"Failed to generate Grad-CAM heatmap: {str(e)}")

def process_xray_image(image_path, output_dir):
    try:
        if not model_fracture:
            raise ValueError("Fracture model not loaded")
        
        original_image = Image.open(image_path)
        original_image = np.array(original_image)
        logging.debug(f"Original image type: {type(original_image)}, shape: {original_image.shape}")

        if original_image.ndim == 2:
            original_image = cv2.cvtColor(original_image, cv2.COLOR_GRAY2RGB)
            logging.debug("Converted grayscale to RGB")
        elif original_image.shape[-1] == 4:
            original_image = original_image[..., :3]
            logging.debug("Converted RGBA to RGB")

        original_image = cv2.resize(original_image, (256, 256))
        logging.debug(f"Resized image shape: {original_image.shape}")

        img_input = np.expand_dims(original_image, axis=0).astype(np.float32) / 255.0
        if not isinstance(img_input, np.ndarray):
            raise ValueError(f"img_input must be a NumPy array, got {type(img_input)}: {img_input}")
        logging.debug(f"Input image shape: {img_input.shape}, dtype: {img_input.dtype}")

        heatmap, class_idx, confidence = make_gradcam_heatmap(img_input, model_fracture, last_conv_layer_name)
        overlay_img = overlay_heatmap_on_image(original_image, heatmap)

        heatmap_img = cv2.applyColorMap((heatmap * 255).astype(np.uint8), cv2.COLORMAP_VIRIDIS)
        heatmap_path = os.path.join(output_dir, f"heatmap_{os.path.basename(image_path)}")
        overlay_path = os.path.join(output_dir, f"overlay_{os.path.basename(image_path)}")
        cv2.imwrite(heatmap_path, heatmap_img)
        cv2.imwrite(overlay_path, overlay_img)

        gemini_description = get_gemini_description(image_path, heatmap_path, overlay_path)

        response = {
            "status": "success",
            "input_image": {
                "path": os.path.basename(image_path),
                "size": list(original_image.shape[:2]),
                "format": "RGB"
            },
            "gradcam_analysis": {
                "last_conv_layer": last_conv_layer_name,
                "predicted_class_index": class_idx,
                "predicted_class_name": class_names_fracture[class_idx],
                "confidence": round(confidence, 4),
                "heatmap_overlay_generated": True
            },
            "gemini_description": {
                "summary": gemini_description,
                "source": "gemini-2.0-flash",
                "timestamp": datetime.utcnow().isoformat() + "Z"
            },
            "visual_outputs": {
                "original_image_base64": "data:image/jpeg;base64," + image_to_base64(original_image),
                "heatmap_base64": "data:image/jpeg;base64," + image_to_base64(heatmap_img),
                "overlay_base64": "data:image/jpeg;base64," + image_to_base64(overlay_img)
            },
            "output_files": {
                "heatmap_path": heatmap_path,
                "overlay_path": overlay_path
            }
        }
        return response
    except Exception as e:
        logging.error(f"X-ray processing error: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }
def get_gemini_suggestions(response, context_type="health insurance"):
    suggestions = []

    # Policy verification suggestions
    policy_verification = response.get("policy_verification", {})
    if not policy_verification.get("product_match", False):
        suggestions.append("The claimed product/service does not match the policy coverage. Please verify the policy details.")

    # Bill verification suggestions
    bill_verification = response.get("bill_verification", {})
    overcharged = bill_verification.get("total_amount_overcharged", 0)
    if overcharged > 0:
        suggestions.append(f"The bill appears to be overcharged by ₹{overcharged:.2f}. Review itemized billing and consult the hospital.")

    # X-ray verification suggestions
    xray_verification = response.get("xray_verification", {})
    xray_status = xray_verification.get("status")
    if xray_status == "success":
        confidence = xray_verification.get("gradcam_analysis", {}).get("confidence", 0.0)
        if confidence < 0.5:
            suggestions.append("X-ray confidence is low. Consider manual review by a radiologist.")
        else:
            suggestions.append("X-ray scan shows reasonable confidence. Clinical correlation advised.")
    elif xray_status == "not_processed":
        suggestions.append("No X-ray provided. If radiology evidence is part of the claim, please upload relevant images.")

    # AI Score evaluation
    ai_score = response.get("aiScore", 0)
    if ai_score < 40:
        suggestions.append("Low AI score indicates potential issues in the claim documents. Consider rechecking or submitting clarifications.")
    elif ai_score < 70:
        suggestions.append("Moderate AI score. The claim may need manual review.")
    else:
        suggestions.append("High AI score. The claim looks good based on automated evaluation.")

    # Add a generic fallback if no suggestions were added
    if not suggestions:
        suggestions.append("No specific issues detected. Proceed with manual review if needed.")

    return " ".join(suggestions)

def get_gemini_risk_factors(response):
    risk_factors = []

    # Check policy mismatch
    if not response.get("policy_verification", {}).get("product_match", False):
        risk_factors.append({
            "label": "Policy Product Mismatch",
            "description": "The claimed treatment/service is not listed under the covered products of the policy.",
            "severity": "high"
        })

    # Check overbilling
    overcharged = response.get("bill_verification", {}).get("total_amount_overcharged", 0)
    if overcharged > 0:
        severity = "medium" if overcharged < 1000 else "high"
        risk_factors.append({
            "label": "Overbilling Detected",
            "description": f"The final bill includes overcharged items totaling ₹{overcharged:.2f} compared to NLEM pricing.",
            "severity": severity
        })

    # Check X-ray
    xray = response.get("xray_verification", {})
    xray_status = xray.get("status")
    confidence = xray.get("gradcam_analysis", {}).get("confidence", 0.0)

    if xray_status == "not_processed":
        risk_factors.append({
            "label": "Missing X-ray Evidence",
            "description": "No X-ray was submitted, which may be required for medical validation.",
            "severity": "low"
        })
    elif confidence < 0.5:
        risk_factors.append({
            "label": "Low X-ray Confidence",
            "description": f"The uploaded X-ray has a confidence score of {confidence:.2f}. This may indicate poor quality or irrelevant imaging.",
            "severity": "low"
        })

    # Check low AI score
    ai_score = response.get("aiScore", 0)
    if ai_score < 40:
        risk_factors.append({
            "label": "Low AI Score",
            "description": f"The AI Score is only {ai_score}, which suggests multiple issues in the documents or missing validations.",
            "severity": "medium"
        })

    return risk_factors

# /process_vehicle Endpoint
# @app.route('/process_vehicle', methods=['POST'])
@app.route('/process_vehicle', methods=['POST'])
def process_vehicle():
    request_id = str(uuid.uuid4())
    app.logger.info(f"Processing request ID: {request_id} to {request.path} from {request.remote_addr}")
    response_sent = False
    try:
        data = request.get_json()
        app.logger.info(f"Received JSON for request {request_id}: {json.dumps(data, indent=2) if data else 'No JSON data'}")
        if not data:
            app.logger.error(f"No JSON data provided for request {request_id}")
            return jsonify({"error": "No JSON data provided", "request_id": request_id}), 400

        required_fields = ['vehicleIdentity', 'damageImage', 'recipt', 'regNo']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            app.logger.error(f"Missing required fields for request {request_id}: {', '.join(missing_fields)}")
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}", "request_id": request_id}), 400

        vehicle_number = data['regNo'].upper()
        output_dir = os.path.join("processed_files", request_id)
        os.makedirs(output_dir, exist_ok=True)
        logging.info(f"Saving files for request {request_id} to: {os.path.abspath(output_dir)}")

        try:
            if not data['vehicleIdentity']:
                app.logger.error(f"At least one vehicleIdentity entry required for request {request_id}")
                return jsonify({"error": "At least one vehicleIdentity entry required", "request_id": request_id}), 400
            first_image_public_id = data['vehicleIdentity'][0]['publicId']
            first_image_original_name = data['vehicleIdentity'][0]['originalName']
            first_image_path = os.path.join(output_dir, f"first_{secure_filename(first_image_original_name)}")
            download_file(first_image_public_id, first_image_path, resource_type='raw')

            if not data['damageImage']:
                app.logger.error(f"At least one damageImage entry required for request {request_id}")
                return jsonify({"error": "At least one damageImage entry required", "request_id": request_id}), 400
            damage_image_public_id = data['damageImage'][0]['publicId']
            damage_image_original_name = data['damageImage'][0]['originalName']
            damage_image_path = os.path.join(output_dir, f"damage_{secure_filename(damage_image_original_name)}")
            download_file(damage_image_public_id, damage_image_path, resource_type='raw')
            second_image_path = damage_image_path  # Use damage image as second image

            pdf_bill_public_id = data['recipt']['publicId']
            pdf_bill_original_name = data['recipt']['originalName']
            pdf_bill_path = os.path.join(output_dir, f"bill_{secure_filename(pdf_bill_original_name)}")
            download_file(pdf_bill_public_id, pdf_bill_path, resource_type='raw')

            for path in [first_image_path, second_image_path, damage_image_path, pdf_bill_path]:
                if not os.path.exists(path):
                    app.logger.error(f"Downloaded file not found for request {request_id}: {path}")
                    return jsonify({"error": f"Downloaded file not found: {path}", "request_id": request_id}), 400
                if not allowed_file(path):
                    app.logger.error(f"Invalid file type for request {request_id}: {path}")
                    return jsonify({"error": f"Invalid file type for {path}", "request_id": request_id}), 400
                if os.path.getsize(path) > MAX_FILE_SIZE:
                    app.logger.error(f"File {path} exceeds size limit (10MB) for request {request_id}")
                    return jsonify({"error": f"File {path} exceeds size limit (10MB)", "request_id": request_id}), 400

            first_img = Image.open(first_image_path).convert("RGB")
            input_tensor = transform(first_img).unsqueeze(0).to(device)
            with torch.no_grad():
                output = model_vehicle(input_tensor)
                pred_idx = torch.argmax(output, dim=1).item()
                predicted_brand = class_names_vehicle[pred_idx]

            detected_make = extract_vehicle_details(vehicle_number)
            match_status = "MATCH" if predicted_brand.upper() == ("SUZUKI" if detected_make == "MARUTI" else detected_make) else f"MISMATCH: API detected '{detected_make}' vs model predicted '{predicted_brand}'"

            second_img = Image.open(second_image_path).convert("RGB")
            np_img = np.array(second_img)
            resized = cv2.resize(np_img, (100, 100))
            pixels = resized.reshape(-1, 3)
            bright_pixels = [p for p in pixels if sum(p) > 350] or pixels
            kmeans = KMeans(n_clusters=3, random_state=42, n_init='auto')
            kmeans.fit(bright_pixels)
            brightest = max(kmeans.cluster_centers_, key=lambda x: sum(x))
            color_rgb = list(map(int, brightest))
            color_name = closest_color_name(color_rgb)

            yolo = YOLO("best.pt")
            results = yolo.predict(source=damage_image_path, imgsz=224)
            result = results[0]
            if hasattr(result, 'probs') and result.probs is not None:
                pred_class = result.names[result.probs.top1]
                confidence = float(result.probs.data[result.probs.top1].item())
            elif hasattr(result, 'boxes') and result.boxes:
                pred_class = result.names[int(result.boxes.cls[0].item())]
                confidence = float(result.boxes.conf[0].item())
            else:
                pred_class = "No predictions"
                confidence = 0.0

            pdf = pypdfium2.PdfDocument(pdf_bill_path)
            try:
                full_text = ""
                for i in range(len(pdf)):
                    page = pdf[i].render(scale=300/72)
                    img = page.to_pil()
                    full_text += pytesseract.image_to_string(img)
            finally:
                pdf.close()

            pdf_text_upper = full_text.upper()
            vehicle_number_match = vehicle_number in pdf_text_upper
            maker_match = detected_make in pdf_text_upper or ("SUZUKI" in pdf_text_upper if detected_make == "MARUTI" else "MARUTI" in pdf_text_upper)

            metadata_report = check_pdf_metadata(pdf_bill_path)

            response = {
                "detected_car_maker": detected_make,
                "predicted_car_brand": predicted_brand,
                "match_status": match_status,
                "closest_color_name_second_image": color_name,
                "predicted_class": pred_class,
                "confidence": confidence,
                "detected_main_color_rgb": color_rgb,
                "hex_color": '#{:02x}{:02x}{:02x}'.format(*color_rgb),
                "closest_color_name_damage": color_name,
                "vehicle_number": vehicle_number,
                "official_maker": detected_make,
                "uploaded_bill": pdf_bill_original_name,
                "vehicle_number_match": vehicle_number_match,
                "vehicle_maker_match": maker_match,
                "pdf_metadata": metadata_report,
                "output_folder": os.path.abspath(output_dir),
                "output_files": {
                    "first_image": first_image_path,
                    "second_image": second_image_path,
                    "damage_image": damage_image_path,
                    "pdf_bill": pdf_bill_path
                },
                "request_id": request_id
            }

            # Get AI analysis from Gemini
            gemini_analysis = get_gemini_analysis(response, "vehicle", vehicle_number_match, maker_match, confidence)
            response["aiScore"] = gemini_analysis["aiScore"]
            response["aiConfidence"] = gemini_analysis["aiConfidence"]
            response["aiSuggestions"] = gemini_analysis["aiSuggestions"]

            response_obj = jsonify(response)
            response_obj.headers['X-Request-ID'] = request_id
            response_sent = True
            app.logger.info(f"Sending response for request {request_id}: {json.dumps(response, indent=2)}")
            return response_obj

        except Exception as e:
            logging.error(f"Process vehicle error for request {request_id}: {str(e)}")
            error_response = {"error": f"Server error: {str(e)}", "output_folder": os.path.abspath(output_dir), "request_id": request_id}
            app.logger.info(f"Sending error response for request {request_id}: {json.dumps(error_response, indent=2)}")
            return jsonify(error_response), 500

    except Exception as e:
        if not response_sent:
            logging.error(f"Request parsing error for request {request_id}: {str(e)}")
            error_response = {"error": f"Server error: {str(e)}", "request_id": request_id}
            app.logger.error(f"Sending error response for request {request_id}: {json.dumps(error_response, indent=2)}")
            return jsonify(error_response), 500
        else:
            logging.error(f"Unexpected error after response sent for request {request_id}: {str(e)}")
            raise  # Should not reach here if response is already sent
# /lifeinsurance Endpoint
@app.route('/lifeinsurance', methods=['POST'])
def lifeinsurance():
    app.logger.info(f"Received request to {request.path} from {request.remote_addr}")
    try:
        data = request.get_json()
        app.logger.info(f"Received JSON: {json.dumps(data, indent=2) if data else 'No JSON data'}")
        if not data:
            app.logger.error("No JSON data provided")
            return jsonify({"error": "No JSON data provided"}), 400

        required_fields = ['file1', 'file2']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            app.logger.error(f"Missing required fields: {', '.join(missing_fields)}")
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        request_id = str(uuid.uuid4())
        output_dir = os.path.join("processed_files", request_id)
        os.makedirs(output_dir, exist_ok=True)
        logging.info(f"Saving files to: {os.path.abspath(output_dir)}")

        try:
            file1_public_id = data['file1']['publicId']
            file1_original_name = data['file1']['originalName']
            file1_path = os.path.join(output_dir, f"file1_{secure_filename(file1_original_name)}")
            download_file(file1_public_id, file1_path, resource_type='raw')

            file2_public_id = data['file2']['publicId']
            file2_original_name = data['file2']['originalName']
            file2_path = os.path.join(output_dir, f"file2_{secure_filename(file2_original_name)}")
            download_file(file2_public_id, file2_path, resource_type='raw')

            for path in [file1_path, file2_path]:
                if not os.path.exists(path):
                    app.logger.error(f"Downloaded file not found: {path}")
                    return jsonify({"error": f"Downloaded file not found: {path}"}), 400
                if not allowed_file(path):
                    app.logger.error(f"Invalid file type for {path}")
                    return jsonify({"error": f"Invalid file type for {path}"}), 400
                if os.path.getsize(path) > MAX_FILE_SIZE:
                    app.logger.error(f"File {path} exceeds size limit (10MB)")
                    return jsonify({"error": f"File {path} exceeds size limit (10MB)"}), 400

            comparison_results = compare_documents(file1_path, file2_path)

            metadata_file1 = check_pdf_metadata(file1_path) if file1_path.lower().endswith('.pdf') else {"issue": "Not a PDF", "Suspicious": False}
            metadata_file2 = check_pdf_metadata(file2_path) if file2_path.lower().endswith('.pdf') else {"issue": "Not a PDF", "Suspicious": False}

            # Calculate aiScore
            match_count = sum(1 for key in comparison_results if comparison_results[key]['match'])
            ai_score = 25 * match_count  # 25% per matching field
            if metadata_file1.get('Suspicious', False):
                ai_score -= 10
            if metadata_file2.get('Suspicious', False):
                ai_score -= 10
            ai_score = max(0, min(100, ai_score))

            # Calculate aiConfidence
            metadata_confidence1 = 1.0 if not metadata_file1.get('Suspicious', False) else 0.5
            metadata_confidence2 = 1.0 if not metadata_file2.get('Suspicious', False) else 0.5
            avg_metadata_confidence = (metadata_confidence1 + metadata_confidence2) / 2
            ai_confidence = round(0.5 * avg_metadata_confidence + 0.5 * (ai_score / 100), 2)

            response = {
                "comparison_results": comparison_results,
                "metadata_file1": metadata_file1,
                "metadata_file2": metadata_file2,
                "file1_name": file1_original_name,
                "file2_name": file2_original_name,
                "aiScore": ai_score,
                "aiConfidence": ai_confidence,
                "output_folder": os.path.abspath(output_dir),
                "output_files": {
                    "file1": file1_path,
                    "file2": file2_path
                }
            }

            # Add aiSuggestions as a string
            response["aiSuggestions"] = get_gemini_suggestions(response, "life insurance")

            app.logger.info(f"Sending response: {json.dumps(response, indent=2)}")
            response_obj = jsonify(response)
            app.logger.info(f"Response headers: {response_obj.headers}")
            return response_obj

        except Exception as e:
            logging.error(f"Life insurance error: {str(e)}")
            error_response = {"error": f"Server error: {str(e)}", "output_folder": os.path.abspath(output_dir)}
            app.logger.info(f"Sending error response: {json.dumps(error_response, indent=2)}")
            return jsonify(error_response), 500

    except Exception as e:
        logging.error(f"Request parsing error: {str(e)}")
        error_response = {"error": f"Server error: {str(e)}"}
        app.logger.error(f"Sending error response: {json.dumps(error_response, indent=2)}")
        return jsonify(error_response), 500

# /healthinsurance Endpoint
@app.route('/healthinsurance', methods=['POST'])
def healthinsurance():
    app.logger.info(f"Received request to {request.path} from {request.remote_addr}")
    try:
        data = request.get_json()
        app.logger.info(f"Received JSON: {json.dumps(data, indent=2) if data else 'No JSON data'}")
        if not data:
            app.logger.error("No JSON data provided")
            return jsonify({"error": "No JSON data provided"}), 400

        # Extract required documents
        policy_data = data.get('policyDocs')
        bill_data = data.get('finalBill')
        xray_data = data.get('medicalDocs')  # optional

        if not policy_data or not bill_data:
            app.logger.error("Missing required documents: policyDocs or finalBill")
            return jsonify({"error": "Missing required documents: policyDocs or finalBill"}), 400

        request_id = str(uuid.uuid4())
        output_dir = os.path.join("processed_files", request_id)
        os.makedirs(output_dir, exist_ok=True)
        logging.info(f"Saving files to: {os.path.abspath(output_dir)}")

        # Process policy PDF
        policy_public_id = policy_data['publicId']
        policy_original_name = policy_data['originalName']
        policy_path = os.path.join(output_dir, f"policy_{secure_filename(policy_original_name)}")
        download_file(policy_public_id, policy_path, resource_type='raw')

        # Process bill PDF
        bill_public_id = bill_data['publicId']
        bill_original_name = bill_data['originalName']
        bill_path = os.path.join(output_dir, f"bill_{secure_filename(bill_original_name)}")
        download_file(bill_public_id, bill_path, resource_type='raw')

        # Use local CSVs
        product_csv_path = "prod.csv"
        nlem_csv_path = "NLEM.csv"
        product_csv_original_name = os.path.basename(product_csv_path)
        nlem_csv_original_name = os.path.basename(nlem_csv_path)

        # Process optional X-ray
        xray_path = None
        xray_original_name = None
        if xray_data:
            xray_public_id = xray_data['publicId']
            xray_original_name = xray_data['originalName']
            xray_path = os.path.join(output_dir, f"xray_{secure_filename(xray_original_name)}")
            download_file(xray_public_id, xray_path, resource_type='raw')

        # Validate all file paths
        for path in [policy_path, bill_path, product_csv_path, nlem_csv_path] + ([xray_path] if xray_path else []):
            if not os.path.exists(path):
                app.logger.error(f"Downloaded file not found: {path}")
                return jsonify({"error": f"Downloaded file not found: {path}"}), 400
            if not allowed_file(path):
                app.logger.error(f"Invalid file type for {path}")
                return jsonify({"error": f"Invalid file type for {path}"}), 400
            if os.path.getsize(path) > MAX_FILE_SIZE:
                app.logger.error(f"File {path} exceeds size limit (10MB)")
                return jsonify({"error": f"File {path} exceeds size limit (10MB)"}), 400

        # Run verifications
        policy_metadata = check_policy_metadata(policy_path)
        policy_verification = verify_policy_document(policy_path, product_csv_path)
        bill_verification = verify_medical_bill(bill_path, nlem_csv_path)

        xray_verification = {
            "status": "not_processed",
            "message": "No X-ray image provided"
        }
        xray_confidence = 0.0
        if xray_path:
            xray_verification = process_xray_image(xray_path, output_dir)
            xray_confidence = xray_verification.get('gradcam_analysis', {}).get('confidence', 0.0)

        # AI Scoring
        ai_score = 0
        if policy_verification.get('product_match', False):
            ai_score += 40
        bill_score = 40 * max(0, 1 - bill_verification.get('total_amount_overcharged', 0) / 1000)
        ai_score += bill_score
        if xray_verification.get('status') == 'success' and xray_confidence > 0.5:
            ai_score += 20
        ai_score = round(max(0, min(100, ai_score)), 2)

        # AI Confidence
        policy_confidence = policy_metadata.get('confidence_score', 0.0)
        bill_confidence = max(0.0, 1 - bill_verification.get('total_amount_overcharged', 0) / 1000)
        if xray_path:
            ai_confidence = round(0.4 * policy_confidence + 0.4 * bill_confidence + 0.2 * xray_confidence, 2)
        else:
            ai_confidence = round(0.5 * policy_confidence + 0.5 * bill_confidence, 2)

        response = {
            "status": "success",
            "policy_metadata": policy_metadata,
            "policy_verification": policy_verification,
            "bill_verification": bill_verification,
            "xray_verification": xray_verification,
            "filenames": {
                "policy_pdf": policy_original_name,
                "bill_pdf": bill_original_name,
                "product_csv": product_csv_original_name,
                "nlem_csv": nlem_csv_original_name,
                "xray_image": xray_original_name
            },
            
            "aiScore": ai_score,
            "aiConfidence": ai_confidence,
            "output_folder": os.path.abspath(output_dir),
            "output_files": {
                "policy_pdf": policy_path,
                "bill_pdf": bill_path,
                "product_csv": product_csv_path,
                "nlem_csv": nlem_csv_path,
                "xray_image": xray_path
            }
        }

        response["aiSuggestions"] = get_gemini_suggestions(response, "health insurance")
        response["risk_factors"] = get_gemini_risk_factors(response)


        app.logger.info(f"Sending response: {json.dumps(response, indent=2)}")
        response_obj = jsonify(response)
        app.logger.info(f"Response headers: {response_obj.headers}")
        return response_obj

    except Exception as e:
        logging.error(f"Health insurance error: {str(e)}")
        error_response = {"error": f"Server error: {str(e)}"}
        app.logger.error(f"Sending error response: {json.dumps(error_response, indent=2)}")
        return jsonify(error_response), 500
    


def get_gemini_risk_factors(metadata_map):
    import random  # placeholder; integrate Gemini API if needed

    risk_factors = []

    for label, result in metadata_map.items():
        status = result.get("document_status")
        confidence = result.get("confidence_score", 1.0)
        if status == "flagged":
            suspicious_keys = ", ".join(result["suspicious_metadata"].keys())
            description = (
                f"Gemini AI flags the {label} due to metadata fields like {suspicious_keys} "
                f"which often appear in modified or tampered documents."
            )
            severity = "high" if confidence < 0.3 else "medium"
            risk_factors.append({
                "label": f"AI Risk Alert - {label}",
                "description": description,
                "severity": severity
            })

    return risk_factors

def get_gemini_risk_factorrs(metadata_map):
    # Plug your Gemini AI call here, or simulate
    # Example dummy output
    return [
        {
            "label": "Suspicious Metadata Tool Usage",
            "description": "The file metadata suggests it was edited using iLovePDF, which is often used for document manipulation.",
            "severity": "medium"
        }
    ] if "ilovepdf" in str(metadata_map).lower() else []

@app.route('/fraudDetection_health', methods=['POST'])
def fraudDetection_health():
    app.logger.info(f"Received request to {request.path} from {request.remote_addr}")
    try:
        data = request.get_json()
        app.logger.info(f"Received JSON: {json.dumps(data, indent=2) if data else 'No JSON data'}")
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Extract doc dictionaries
        policy_data = data.get('policyDocs', {})
        bill_data = data.get('finalBill', {})
        xray_data = data.get('medicalDocs', {})

        if not isinstance(policy_data, dict) or not isinstance(bill_data, dict):
            return jsonify({"error": "Invalid structure for policyDocs or finalBill"}), 400

        if 'publicId' not in policy_data or 'originalName' not in policy_data or '_id' not in policy_data:
            return jsonify({"error": "policyDocs missing required fields"}), 400
        if 'publicId' not in bill_data or 'originalName' not in bill_data or '_id' not in bill_data:
            return jsonify({"error": "finalBill missing required fields"}), 400

        request_id = str(uuid.uuid4())
        output_dir = os.path.join("fraud_checks", request_id)
        os.makedirs(output_dir, exist_ok=True)

        # Download files
        policy_path = os.path.join(output_dir, f"policy_{secure_filename(policy_data['originalName'])}")
        bill_path = os.path.join(output_dir, f"bill_{secure_filename(bill_data['originalName'])}")
        xray_path = None

        download_file(policy_data['publicId'], policy_path, resource_type='raw')
        download_file(bill_data['publicId'], bill_path, resource_type='raw')

        if xray_data and isinstance(xray_data, dict) and 'publicId' in xray_data and '_id' in xray_data:
            xray_path = os.path.join(output_dir, f"xray_{secure_filename(xray_data['originalName'])}")
            download_file(xray_data['publicId'], xray_path, resource_type='raw')

        suspicious_files = []
        risk_factors = []

        # Check metadata
        files_to_check = [
            (policy_path, "Policy Document", policy_data.get('_id')),
            (bill_path, "Final Bill", bill_data.get('_id'))
        ]
        if xray_path:
            files_to_check.append((xray_path, "X-ray Image", xray_data.get('_id')))

        for path, label, doc_id in files_to_check:
            if not os.path.exists(path):
                continue

            metadata = check_policy_metadata(path)
            confidence = metadata.get("confidence_score", 0.0)
            source = " ".join(metadata.get("all_metadata", {}).values()).lower()
            pages = metadata.get("page_count", 1)

            if confidence < 0.5:
                suspicious_files.append({
                    "_id": doc_id,
                    "reason": f"Low metadata confidence ({confidence:.2f})",
                    "label": label
                })
                risk_factors.append({
                    "label": f"Low Confidence in {label}",
                    "description": f"The {label.lower()} has a low metadata confidence score of {confidence:.2f}, suggesting tampering or illegibility.",
                    "severity": "high" if confidence < 0.3 else "medium"
                })

            if any(kw in source for kw in ['scan', 'camscanner', 'image']):
                suspicious_files.append({
                    "_id": doc_id,
                    "reason": "Scanned or image-based document detected",
                    "label": label
                })
                risk_factors.append({
                    "label": f"Scanned Document - {label}",
                    "description": f"The {label.lower()} appears to be a scanned image rather than a digitally signed or generated file.",
                    "severity": "medium"
                })

            if pages > 10:
                risk_factors.append({
                    "label": f"Unusual Page Count in {label}",
                    "description": f"The {label.lower()} has {pages} pages, which is unusual and may need manual review.",
                    "severity": "low"
                })

        if not suspicious_files:
            risk_factors.append({
                "label": "No Suspicious Metadata Detected",
                "description": "The system did not detect any metadata issues, but manual review is still advised.",
                "severity": "info"
            })

        # Gemini suggestions
        try:
            gemini_factors = get_gemini_risk_factorrs({
                "policy": check_policy_metadata(policy_path),
                "bill": check_policy_metadata(bill_path),
                "xray": check_policy_metadata(xray_path) if xray_path else None
            })
            risk_factors.extend(gemini_factors)
        except Exception as e:
            app.logger.warning(f"Gemini risk factor generation failed: {str(e)}")

        response = {
            "status": "processed",
            "risk_factors": risk_factors,
            "suspicious_files": suspicious_files,
            "all_clear": len(suspicious_files) == 0,
            "output_folder": os.path.abspath(output_dir)
        }

        app.logger.info(f"Returning response with {len(risk_factors)} risk factors")
        
        return jsonify(response), 200

    except Exception as e:
        app.logger.error(f"Fraud detection error: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/fraudDetection_vehicle', methods=['POST'])
def fraudDetection_vehicle():
    request_id = str(uuid.uuid4())
    app.logger.info(f"Fraud Detection Request ID: {request_id} at {request.path} from {request.remote_addr}")
    try:
        data = request.get_json()
        app.logger.info(f"Received JSON for request {request_id}: {json.dumps(data, indent=2) if data else 'No JSON data'}")
        if not data:
            return jsonify({"error": "No JSON data provided", "request_id": request_id}), 400

        required_fields = ['vehicleIdentity', 'damageImage', 'recipt', 'regNo']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}", "request_id": request_id}), 400

        vehicle_number = data['regNo'].upper()
        output_dir = os.path.join("fraud_checks_vehicle", request_id)
        os.makedirs(output_dir, exist_ok=True)

        def download_and_validate(file_info, prefix):
            path = os.path.join(output_dir, f"{prefix}_{secure_filename(file_info['originalName'])}")
            download_file(file_info['publicId'], path, resource_type='raw')
            if not os.path.exists(path):
                raise FileNotFoundError(f"Downloaded file not found: {path}")
            if not allowed_file(path):
                raise ValueError(f"Invalid file type for: {path}")
            if os.path.getsize(path) > MAX_FILE_SIZE:
                raise ValueError(f"File exceeds size limit (10MB): {path}")
            return path

        first_image_path = download_and_validate(data['vehicleIdentity'][0], 'vehicle')
        damage_image_path = download_and_validate(data['damageImage'][0], 'damage')
        pdf_bill_path = download_and_validate(data['recipt'], 'bill')

        suspicious_files = []
        risk_factors = []

        for path, label in [
            (first_image_path, "Vehicle Identity Image"),
            (damage_image_path, "Damage Image"),
            (pdf_bill_path, "Repair Bill")
        ]:
            metadata = check_pdf_metadata(path) if path.endswith('.pdf') else check_image_metadata(path)
            confidence = metadata.get("confidence_score", 0.0)
            source = " ".join(metadata.get("all_metadata", {}).values()).lower()
            pages = metadata.get("page_count", 1)

            if confidence < 0.5:
                suspicious_files.append({"file": os.path.basename(path), "reason": f"Low metadata confidence ({confidence:.2f})", "label": label})
                risk_factors.append({"label": f"Low Confidence in {label}", "description": f"The {label.lower()} has a low confidence score of {confidence:.2f}.", "severity": "high" if confidence < 0.3 else "medium"})

            if any(kw in source for kw in ['scan', 'camscanner', 'image', 'modified']):
                suspicious_files.append({"file": os.path.basename(path), "reason": "Scanned or modified document detected", "label": label})
                risk_factors.append({"label": f"Scanned or Modified - {label}", "description": f"The {label.lower()} appears to be scanned or edited.", "severity": "medium"})

            if pages > 10:
                risk_factors.append({"label": f"Unusual Page Count in {label}", "description": f"The {label.lower()} has {pages} pages, possibly unusual.", "severity": "low"})

        if not suspicious_files:
            risk_factors.append({"label": "No Suspicious Metadata Detected", "description": "No metadata anomalies were found, but manual verification is still recommended.", "severity": "info"})

        try:
            gemini_factors = get_gemini_risk_factors({
                "vehicle": check_image_metadata(first_image_path),
                "damage": check_image_metadata(damage_image_path),
                "bill": check_pdf_metadata(pdf_bill_path)
            })
            risk_factors.extend(gemini_factors)
        except Exception as e:
            app.logger.warning(f"Gemini analysis skipped due to error: {str(e)}")

        response = {
            "status": "processed",
            "vehicle_number": vehicle_number,
            "risk_factors": risk_factors,
            "suspicious_files": suspicious_files,
            "all_clear": len(suspicious_files) == 0,
            "output_folder": os.path.abspath(output_dir),
            "request_id": request_id
        }

        return jsonify(response), 200

    except Exception as e:
        app.logger.error(f"Vehicle fraud detection error for request {request_id}: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}", "request_id": request_id}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
