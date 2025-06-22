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