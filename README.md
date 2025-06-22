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

# InsuranceSaathi Backend API

A comprehensive Node.js/Express.js backend API for the InsuranceSaathi platform, providing insurance claim processing, AI-powered risk assessment, and document management services.

## 🏗️ Project Structure

```
backend/
├── app.js                          # Express app configuration
├── server.js                       # Server entry point
├── package.json                    # Dependencies and scripts
├── vercel.json                     # Vercel deployment configuration
├── README.md                       # This file
├── controllers/                    # Request handlers
│   ├── auth.controller.js         # Authentication logic
│   ├── checkCoverage.controller.js # Coverage verification
│   ├── claim.controller.js        # Claim processing
│   ├── insurer.claimDocs.controller.js    # Insurer document handling
│   ├── insurer.claimFetch.controller.js   # Insurer claim fetching
│   ├── insurer.decision.controller.js     # Insurer claim decisions
│   ├── insurer.riskEngine.controller.js   # Insurer risk analysis
│   ├── onboarding.controller.js   # User onboarding
│   └── upload.controller.js       # File upload handling
├── middleware/                     # Custom middleware
│   ├── upload.middleware.js       # File upload handling
│   └── verifyAuth.middleware.js   # JWT authentication
├── models/                        # MongoDB schemas
│   ├── user.model.js             # User data model
│   ├── claim.model.js            # Claim data model
│   ├── insurer.model.js          # Insurer data model
│   ├── upload.model.js           # File upload model
│   ├── checkPolicyCoverage.model.js
│   ├── healthInsurance.model.js
│   ├── lifeInsurance.model.js
│   └── vehicleInsurance.model.js
├── routes/                        # API route definitions
│   ├── auth.routes.js            # Authentication routes
│   ├── claim.routes.js           # Claim processing routes
│   ├── claimCheck.routes.js      # Coverage check routes
│   ├── insurer.routes.js         # Insurer-specific routes
│   ├── onboarding.routes.js      # Onboarding routes
│   └── upload.routes.js          # File upload routes
├── services/                      # Business logic services
│   ├── cloudinary.service.js     # Cloudinary integration
│   └── getAIInsights.service.js  # AI insights service
├── utils/                         # Utility functions
│   └── handleFileUpload.js       # File upload utilities
└── uploads/                       # Temporary file storage
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for file storage)
- Firebase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd InsuranceSaathi/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### Policy Holder Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/policyHolder/signUp` | Register new policy holder | No |
| POST | `/auth/policyHolder/login` | Policy holder login | No |
| GET | `/auth/logout` | User logout | Yes |

#### Insurer Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/insurer/signUp` | Register new insurer | No |
| POST | `/auth/insurer/login` | Insurer login | No |

### Onboarding Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PATCH | `/onboarding/policyHolder` | Complete policy holder profile | Yes |
| PATCH | `/onboarding/insurer` | Complete insurer profile with documents | Yes |

### File Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload single file | Yes |

### Claim Coverage Check Endpoints

#### Vehicle Insurance Coverage Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/check/vehicleInsurance` | Check vehicle insurance coverage | Yes |
| GET | `/check/getAIScore/:id` | Get AI score for claim | Yes |
| GET | `/check/allClaimChecks` | Get all claim checks | Yes |
| GET | `/check/getClaim/:id` | Get specific claim check | Yes |

**Required Files for Vehicle Insurance:**
- `claimForm` (1 file)
- `vehicleIdentity` (up to 5 files)
- `damageImage` (up to 5 files)
- `recipt` (1 file)

#### Life Insurance Coverage Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/check/lifeInsurance` | Check life insurance coverage | Yes |

**Required Files for Life Insurance:**
- `insuranceClaimForm` (1 file)
- `policyDocument` (1 file)
- `deathCert` (1 file)
- `hospitalDocument` (1 file)
- `fir` (1 file)
- `passBook` (1 file)

#### Health Insurance Coverage Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/check/healthInsurance` | Check health insurance coverage | Yes |

**Required Files for Health Insurance:**
- `policyDocs` (1 file)
- `finalBill` (1 file)
- `medicalDocs` (1 file)

### Claim Processing Endpoints

#### Vehicle Insurance Claims
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/claim/vehicleInsurance` | Submit vehicle insurance claim | Yes |
| PUT | `/claim/vehicleInsurance/edit/:id` | Edit vehicle insurance claim | Yes |

#### Life Insurance Claims
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/claim/lifeInsurance` | Submit life insurance claim | Yes |
| PUT | `/claim/lifeInsurance/edit/:id` | Edit life insurance claim | Yes |

#### Health Insurance Claims
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/claim/healthInsurance` | Submit health insurance claim | Yes |
| PUT | `/claim/healthInsurance/edit/:id` | Edit health insurance claim | Yes |

#### General Claim Operations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/claim/submit/:id` | Submit claim for processing | Yes |
| GET | `/claim/getAIScore/:id` | Get AI score for claim | Yes |
| GET | `/claim/getAllClaims` | Get all user claims | Yes |
| GET | `/claim/getClaim/:id` | Get specific claim details | Yes |

### Insurer Dashboard Endpoints

#### Claim Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/insurer/getClaims` | Fetch claims based on IRDAI | Yes |
| GET | `/insurer/getClaim/:id` | Fetch specific claim data | Yes |

#### Risk Assessment
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/insurer/getFraudReport/:id` | Get AI fraud detection report | Yes |

#### Document Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/insurer/getClaimDocs/:id` | Get claim documents | Yes |
| GET | `/insurer/previewDoc/:id` | Preview document | Yes |
| GET | `/insurer/downloadDoc/:id` | Download document | Yes |

#### Decision Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/insurer/review/:id` | Set claim for review | Yes |
| POST | `/insurer/approve/:id` | Approve claim | Yes |
| POST | `/insurer/reject/:id` | Reject claim | Yes |

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## 📁 File Upload

The API supports multipart/form-data for file uploads. Files are stored in Cloudinary and references are saved in MongoDB.

### Supported File Types
- Images (JPG, PNG, GIF)
- Documents (PDF, DOC, DOCX)
- Maximum file size: 10MB per file

## 🛠️ Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **CORS**: Express CORS middleware
- **Environment**: dotenv

## 📦 Dependencies

### Core Dependencies
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `multer`: File upload handling
- `cloudinary`: Cloud file storage
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

### Additional Dependencies
- `axios`: HTTP client
- `cookie`: Cookie parsing
- `firebase`: Firebase integration
- `firebase-admin`: Firebase admin SDK

## 🔧 Configuration

### CORS Configuration
The API is configured to accept requests from specific origins:
- `http://192.168.128.13:5173`
- `http://192.168.26.13:5173`
- `http://192.168.72.12:5173`
- `http://192.168.128.13:5174`

### Request Limits
- JSON payload limit: 50MB
- URL-encoded payload limit: 50MB

## 🚀 Deployment

### Vercel Deployment
The project includes `vercel.json` for easy deployment to Vercel:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## 📝 Error Handling

All API responses follow a consistent error format:

```json
{
  "error": "Error message description"
}
```

## 🔍 API Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## 📊 Data Models

### User Model
- Basic user information
- Authentication details
- Role-based access control

### Claim Models
- **Vehicle Insurance**: Vehicle-specific claim data
- **Life Insurance**: Life insurance claim information
- **Health Insurance**: Health insurance claim details

### Insurer Model
- Insurer company information
- IRDAI registration details
- Business credentials

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- File upload validation
- CORS protection
- Request size limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For technical support or questions, please contact the backend development team or create an issue in the repository.

---

**Note**: This API is designed to work with the InsuranceSaathi frontend application. Ensure proper CORS configuration and authentication setup for production deployment. 