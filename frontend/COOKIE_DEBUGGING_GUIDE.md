# Cookie Authentication Debugging Guide

## Issue Description
The insurer authentication flow has a cookie persistence issue where:
1. `insurer-auth` sends signup details to backend and receives cookies
2. `insurer-signup` (KYC) should use those cookies but gets 401 Unauthorized

## Root Causes & Solutions

### 1. Cookie Domain/Path Issues
**Problem**: Cookies might be set with incorrect domain/path restrictions
**Solution**: Ensure backend sets cookies with proper domain and path

**Backend Fix (Node.js/Express example)**:
```javascript
// Set cookie with proper domain and path
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  domain: '192.168.72.13', // Your backend domain
  path: '/',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});
```

### 2. CORS Configuration
**Problem**: Backend might not be configured to accept credentials
**Solution**: Update CORS configuration

**Backend Fix**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 3. Frontend Cookie Handling
**Problem**: Cookies might not be properly stored/retrieved
**Solution**: Use consistent axios configuration

**Current Fix Applied**:
- Created centralized axios instance with `withCredentials: true`
- Added request/response interceptors for debugging
- Added cookie utility functions

### 4. Session Management
**Problem**: Backend might be using session-based auth instead of token-based
**Solution**: Ensure consistent authentication method

## Debugging Steps

### 1. Check Browser Developer Tools
1. Open DevTools → Application/Storage → Cookies
2. Look for cookies set by your backend domain
3. Check if cookies have proper domain/path settings

### 2. Monitor Network Requests
1. Open DevTools → Network tab
2. Make the signup request
3. Check if cookies are sent in subsequent requests
4. Look for CORS errors

### 3. Use Console Logging
The updated code now includes comprehensive logging:
- Cookie state before/after requests
- Request/response headers
- Error details

## Testing the Fix

1. **Clear all cookies** for your domain
2. **Open browser console** to see debug logs
3. **Complete the signup flow**:
   - Fill insurer-auth form → Submit
   - Check console for cookie logs
   - Navigate to insurer-signup
   - Fill KYC form → Submit
   - Check console for cookie logs

## Expected Console Output

**Successful Flow**:
```
InsurerAuth component mounted
All cookies: {}
Raw cookie string: 
Cookies before signup request:
All cookies: {}
Raw cookie string: 
Request cookies: 
Request URL: /auth/insurer/signUp
Response cookies: authToken=abc123; path=/
Response headers: {set-cookie: ["authToken=abc123; HttpOnly; Path=/"]}
Signup response status: 200
Signup response cookies: authToken=abc123; path=/
Cookies after signup response:
All cookies: {authToken: "abc123"}
Raw cookie string: authToken=abc123; path=/
Signup successful, navigating to insurer-signup

InsurerSignup component mounted
All cookies: {authToken: "abc123"}
Raw cookie string: authToken=abc123; path=/
Cookies before KYC submission:
All cookies: {authToken: "abc123"}
Raw cookie string: authToken=abc123; path=/
Request cookies: authToken=abc123; path=/
Request URL: /onboarding/insurer
KYC response status: 200
```

## Additional Backend Checks

1. **Verify cookie setting** in signup endpoint
2. **Check authentication middleware** in KYC endpoint
3. **Ensure consistent domain** across all endpoints
4. **Test with Postman** to isolate frontend/backend issues

## Fallback Solutions

If cookies still don't work:

1. **Use localStorage/sessionStorage** for token storage
2. **Implement token in Authorization header**
3. **Use URL parameters** for session tokens (less secure)

## Security Considerations

- Use `httpOnly` cookies for sensitive tokens
- Set `secure: true` in production
- Use `sameSite: 'strict'` or `'lax'` appropriately
- Implement proper token expiration
- Use HTTPS in production 