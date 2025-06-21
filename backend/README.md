# InsuredSaathi Backend API Documentation

This document provides a detailed overview of all API endpoints, their request/response formats, and required headers for the InsuredSaathi backend. Use this as a reference for frontend integration.

---

## Authentication

### POST `/auth/login`
**Description:** User login with email/password or social login.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": { /* user object */ }
}
```

---

### POST `/auth/register`
**Description:** Register a new user.

**Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string",
  "name": "string"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": { /* user object */ }
}
```

---

## File Uploads

### POST `/upload`
**Description:** Upload files (images, PDFs, etc.).

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: File(s) to upload

**Response:**
```json
{
  "uploads": [
    {
      "_id": "string",
      "publicId": "string",
      "fileType": "string",
      "originalName": "string",
      "fieldName": "string"
    }
  ]
}
```

---

## Onboarding

### POST `/onboarding`
**Description:** Submit onboarding details.

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  /* onboarding fields */
}
```

**Response:**
```json
{
  "message": "Onboarding successful",
  "data": { /* onboarding data */ }
}
```

---

## Claim Check

### POST `/check/vehicleInsurance`
**Description:** Check vehicle insurance claim eligibility and upload related documents.

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `claimForm`: File
- `vehicleIdentity`: File(s)
- `damageImage`: File(s)
- `recipt`: File

**Response:**
```json
{
  "aiScore": 0.92,
  "aiConfidence": 0.85,
  "aiSuggestions": ["string", ...],
  "claim": { /* claim data */ }
}
```

---

### POST `/check/lifeInsurance`
**Description:** Check life insurance claim eligibility and upload related documents.

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `claimForm`: File
- `policyDocument`: File
- `deathCert`: File
- `hospitalDocument`: File
- `fir`: File
- `passBook`: File

**Response:**
```json
{
  "aiScore": 0.95,
  "aiConfidence": 0.90,
  "aiSuggestions": ["string", ...],
  "claim": { /* claim data */ }
}
```

---

### GET `/check/score/:id`
**Description:** Get AI score and suggestions for a claim by ID.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "aiScore": 0.92,
  "aiConfidence": 0.85,
  "aiSuggestions": ["string", ...]
}
```

---

### GET `/check/all`
**Description:** Get all claim check data (admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
[
  { /* claim check data */ },
  ...
]
```

---

### GET `/check/:id`
**Description:** Get claim check data by ID.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  /* claim check data */
}
```

---

## Claims

### POST `/claim`
**Description:** Submit a new claim.

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  /* claim fields */
}
```

**Response:**
```json
{
  "message": "Claim submitted successfully",
  "claim": { /* claim data */ }
}
```

---

### GET `/claim/:id`
**Description:** Get claim details by ID.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  /* claim data */
}
```

---

## Common Headers
- `Authorization: Bearer <jwt_token>` (required for all protected routes)
- `Content-Type: application/json` or `multipart/form-data` as appropriate

---

## Error Response Format
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

---

## Notes
- All dates are in ISO 8601 format.
- All IDs are MongoDB ObjectIds unless otherwise specified.
- For file uploads, use the correct field names as specified in the form data.
- Some endpoints may require admin privileges.

---

For further details, refer to the controller and route files or contact the backend team.
