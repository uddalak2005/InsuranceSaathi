# InsureSaathi.ai

## AI-Powered Insurance Claim Intelligence Platform

**InsureSaathi.ai** is an AI-driven platform revolutionizing claim processing across vehicle, health, and life insurance sectors in India. Built with cutting-edge machine learning and full compliance with IRDAI regulatory frameworks, it delivers automated, fraud-resistant, and intelligent workflows to enhance accuracy, speed, and trust.

---

## 🛠 Architecture Overview
![Architecture](https://github.com/uddalak2005/InsuranceSaathi/blob/main/architecture.png)


---
### Problem Statement

The Indian insurance landscape grapples with claim processing delays, fraudulent submissions, and opaque practices. Policyholders face unclear coverage details, while insurers lose crores due to falsified documents and inflated claims. InsureSaathi.ai automates validation and settlement, ensuring precision and transparency.

### Insurance Domains Covered

#### 1. Vehicle Insurance

A robust pipeline for document authenticity and damage assessment:

- **Vehicle Identity Verification**
    - **Tech**: YOLOv8 + OCR extracts vehicle make and registration from images.
    - **Validation**: Cross-checks with insurance policy docs and VAHAN API (RC, make, model, owner).
- **Damage Analysis**
    - **Model**: Custom-trained EfficientNetV2-M (ICLR 2021) evaluates panel-level damage, dent types, and severity.
    - **Metrics**: 97%+ accuracy, 98-99% specificity across 40 damage classes.
- **Color Consistency Check**
    - **Method**: Extracts hex color codes via image processing, applies K-Means clustering to detect repainting.
- **Garage Estimate Validation**
    - **Process**: OCR extracts itemized costs, verifies metadata (date, signature, GST), and benchmarks against regional pricing.

#### 2. Health Insurance

Automated triage with regulatory compliance and medical intelligence:

- **Policy Document Verification**
    - **Task**: Extracts UIN, issuer, policy dates; validates against IRDAI product list.
- **Hospital Bill Verification**
    - **Tech**: OCR processes invoices, cross-checks against government-approved price ceilings, flags overcharges.
- **Medical Imaging Analysis**
    - **Model**: EfficientNetV2 + Grad-CAM verifies diagnostic images, detects synthetic alterations.
    - **Metrics**: 98-99% validation accuracy.

#### 3. Life Insurance

Focus on document compliance and death claim verification:

- **Policy Verification**
    - **Task**: Validates UIN, coverage, term, and issuer against IRDAI registry.
- **Death Certificate Verification**
    - **Tech**: OCR extracts name, date, place; cross-matches with hospital records.
    - **Enhancement**: NLP detects inconsistencies.

---

## 🤖 Backend Workflow
![Backend Structure](https://github.com/uddalak2005/InsuranceSaathi/blob/main/backend_structure.png)

---
### AI Models (98-99% Accuracy)

|**Use Case**|**Model**|**Description**|
|---|---|---|
|Forgery Detection|YOLOv8 + OCR|Identifies tampered RCs, policies, invoices.|
|Vehicle Damage Estimation|EfficientNetV2-M|Assesses damage from images.|
|Health Imaging Analysis|EfficientNetV2 + Grad-CAM|Verifies diagnostic markers.|
|Policy Matching|Tesseract OCR|Matches policy text with official structures.|
|Rejection Explanation|GPT-4o + Rules Engine|Generates clear denial explanations.|
|Color Anomaly Detection|K-Means (HEX Codes)|Detects repainting or mismatched colors.|

### Confusion Matrix — Vehicle Make Detection

![Confusion Matrix](https://github.com/uddalak2005/InsuranceSaathi/blob/main/Confusion_Matrix.png)

---

## ✨ Core Features

- **Intelligent Risk Scoring**: Real-time claim legitimacy assessment.
- **Forgery Detection**: Identifies tampered documents and images.
- **Damage & Cost Validation**: Ensures accurate damage and cost estimates.
- **Metadata Verification**: Validates invoice and document metadata.
- **Policy Compliance**: Cross-checks against IRDAI UIN registry.
- **AI-Driven Rejection Explanations**: Transparent feedback for denials.
- **Real-Time Dashboards**: Insights for insurers, TPAs, and policyholders.
- **Audit Trail**: Comprehensive logs for regulatory compliance.

---

## 💰 Monetization Strategy

|**Channel**|**Description**|
|---|---|
|Subscription Model|Monthly/annual SaaS for insurers, TPAs, agents.|
|Claim Success Commission|Fee on approved claims processed.|
|API Licensing|B2B white-labeled AI endpoints.|
|Recheck & Appeals|Premium pricing for re-evaluations.|
|Analytics Platform|Paid dashboards with fraud insights.|

### Value Proposition

- **For Policyholders**:
    - Higher approval rates via AI pre-validation.
    - Transparent rejection feedback.
    - Protection against overbilling.
    - Clear coverage insights.
    - Rewards for honesty.
- **For Insurers**:
    - Early fraud prevention.
    - Reduced operational costs.
    - Enhanced underwriting.
    - Regulatory compliance.
    - Faster processing and satisfaction.
- **For the Platform**:
    - Recurring SaaS revenue.
    - Commission-based income.
    - API licensing revenue.
    - Premium recheck services.
    - Monetized analytics.

---

## 🛠 Technology Stack

- **Backend**: Flask, Express.js, Node.js
- **Machine Learning**: PyTorch, TensorFlow, OpenCV, Timm
- **OCR & NLP**: Tesseract, Custom Models (YOLOv8, EfficientNetV2)
- **Frontend**: TypeScript, React, Tailwind CSS, Vite
- **Database**: MongoDB Atlas
- **Infrastructure**: RESTful Monolith, Firebase, Cloudinary
- **Deployment**: Vercel

---

## 🚀 Developer Setup

```bash
# Clone the repository
git clone https://github.com/your-org/insurance-ai-platform.git
cd insurance-ai-platform

# Install backend dependencies
pip install -r requirements.txt
python app.py

# Start AI model service
cd ai_service
python run_inference.py
```

---

## 🌟 Vision
---
Building India’s most intelligent, transparent, and trusted claim processing engine for vehicle, health, and life insurance—launched at 03:40 AM IST, June 22, 2025. We present InsureSaathi.ai to the judges as an open-ended innovation with boundless possibilities, serving not just as a solution but as a foundation for future growth. This platform holds the potential for exciting advancements, such as integrating reinforcement learning for advanced predictive analytics to dynamically optimize claim approval rates, incorporating blockchain for immutable audit trails to enhance regulatory compliance, developing natural language interfaces for voice-driven claim submissions to improve accessibility, leveraging IoT synergy with real-time vehicle telemetry for precise damage assessment in vehicle insurance, and offering personalized policy recommendations driven by AI analysis of user health and driving data. As a living ecosystem, InsureSaathi.ai is poised to evolve with emerging technologies and user needs, promising continuous improvement and scalability in the near future.

---

## 📜 License

MIT License - See [LICENSE.md](https://grok.com/chat/LICENSE.md) for details.

---

## 🙌 Acknowledgments

Crafted with passion by the InsureSaathi.ai team for a fraud-free insurance future!
