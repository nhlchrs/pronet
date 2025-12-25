# Authentication System Implementation Guide

## Overview

This document covers the complete authentication system implementation for the ProNet Frontend application. The system uses JWT-based authentication with OTP verification, multi-step registration, and protected routes.

## Architecture

### Components

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)
Central authentication state management using React Context API.

**Key Features:**
- JWT token-based authentication
- User session management
- OTP verification flow
- Automatic token refresh on page load
- Error state management

**Methods:**
- `register(firstName, lastName, email, phone, password)` - User registration
- `verifyOTP(email, otp)` - OTP verification
- `resendOTP(email)` - Resend OTP to email
- `login(email, password)` - User login
- `logout()` - User logout
- `setError(error)` - Set error message

**State:**
- `user` - Current user object
- `token` - JWT token
- `loading` - Loading state
- `error` - Error message
- `isAuthenticated` - Authentication status

#### 2. **useAuth Hook**
Custom hook for accessing authentication context in components.

```javascript
const { user, token, loading, error, isAuthenticated, login, register, logout } = useAuth();
```

#### 3. **ProtectedRoute Component** (`src/Components/ProtectedRoute/index.jsx`)
Higher-order component for protecting routes.

**Features:**
- Checks authentication status
- Shows loading spinner while checking
- Redirects to login if not authenticated
- Allows access to protected pages if authenticated

**Usage:**
```jsx
<Route 
  path="dashboard" 
  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
/>
```

### Authentication Pages

#### 1. **Login Page** (`src/Page/Login/index.jsx`)

**Features:**
- Email/password form
- Remember me checkbox
- Forgot password link
- Social login buttons (UI placeholder)
- Error handling and validation
- Loading states

**User Flow:**
1. Enter email and password
2. Submit form
3. Backend validates credentials
4. JWT token received and stored
5. Redirect to dashboard

**Validation:**
- Email is required and valid format
- Password is required
- Error messages displayed for invalid input

**State Management:**
```javascript
const [formData, setFormData] = useState({
  email: "",
  password: "",
});
const [localError, setLocalError] = useState("");
const [showPassword, setShowPassword] = useState(false);
```

#### 2. **Register Page** (`src/Page/Register/index.jsx`)

**Features:**
- Two-step registration process
- Step 1: User data collection
- Step 2: OTP verification
- Form validation with detailed error messages
- Show/hide password toggle
- Social signup options

**Step 1 - Registration Form:**
- First Name (required)
- Last Name (required)
- Email (required, valid format)
- Phone Number (required)
- Password (required, min 6 characters)
- Confirm Password (required, must match)
- Terms & Conditions checkbox

**Step 2 - OTP Verification:**
- 6-digit OTP input
- Resend OTP button
- Back to registration link
- Auto-focus on OTP field

**Validation:**
```javascript
- First name: required
- Last name: required
- Email: required, valid email format
- Phone: required
- Password: required, min 6 characters
- Confirm Password: required, must match password
- OTP: required, exactly 6 digits
```

**User Flow:**
1. Fill registration form
2. Submit form (validation triggers)
3. Backend sends OTP to email
4. Switch to OTP verification step
5. Enter 6-digit OTP
6. Backend verifies OTP
7. Token received and stored
8. Redirect to dashboard or auto-login

#### 3. **Dashboard Page** (`src/Page/Dashboard/index.jsx`)

**Features:**
- Protected page (requires authentication)
- Displays user profile information
- Logout button
- User greeting

**Protected Content:**
- User name (fname + lname)
- Email address
- Phone number
- Role information

## API Integration

### API Endpoints Used

#### Authentication Endpoints
```javascript
// src/services/api.js - authAPI object

authAPI.register({
  fname: string,
  lname: string,
  email: string,
  phone: string,
  password: string
})
// Returns: { success: boolean, message: string }

authAPI.verifyOTP(email: string, otp: string)
// Returns: { token: string, user: object, success: boolean }

authAPI.resendOTP(email: string)
// Returns: { success: boolean, message: string }

authAPI.login(email: string, password: string)
// Returns: { token: string, user: object, success: boolean }

authAPI.logout()
// Returns: { success: boolean, message: string }
```

### Token Management

**Storage:**
```javascript
// Token stored in localStorage
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));
```

**Injection:**
```javascript
// Token automatically injected in API requests
const apiCall = async (method, url, data) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  // ... request logic
};
```

**Refresh:**
```javascript
// Auto-refresh on page load if token exists
useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  if (token && userData) {
    setToken(token);
    setUser(JSON.parse(userData));
    setIsAuthenticated(true);
  }
}, []);
```

## Error Handling

### Error Types

1. **Validation Errors**
   - Field-level validation in components
   - User-friendly error messages
   - Clear error display using Bootstrap alerts

2. **API Errors**
   - Backend error messages displayed
   - Network error handling
   - Timeout handling

3. **Authentication Errors**
   - Invalid credentials
   - Expired tokens
   - Invalid OTP
   - Email not verified

### Error Display Pattern

```jsx
{(localError || error) && (
  <div className="alert alert-danger" role="alert">
    <i className="fa-solid fa-circle-exclamation"></i>
    <span>{localError || error}</span>
  </div>
)}
```

### Setting Errors

```javascript
// Local component errors
setLocalError("Invalid email format");

// Global auth context errors
setError("Login failed");
```

## Styling

### CSS File: `src/Page/Login/auth.css`

**Features:**
- Responsive design (mobile-first)
- Smooth animations
- Modern gradient background
- Clean form styling
- Button states (hover, disabled, loading)
- Dark theme compatibility ready

**Key Classes:**
- `.auth-container` - Main container
- `.auth-card` - Form card
- `.auth-form` - Form wrapper
- `.form-group` - Form field group
- `.input-group` - Input field wrapper
- `.auth-button` - Submit button
- `.alert` - Alert messages
- `.auth-decoration` - Background decorations

**Responsive Breakpoints:**
- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px+

## Routing

### Routes Configuration

**File:** `src/Router.jsx`

```jsx
{/* Authentication Routes */}
<Route path="login" element={<LoginPage />} />
<Route path="register" element={<RegisterPage />} />

{/* Protected Routes */}
<Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

### Navigation Flow

```
Home → Login/Register
   ↓
Register → Verify OTP → Dashboard
   ↓
Login → Dashboard → Logout → Login
```

## Implementation Checklist

### Phase 1: Setup ✅
- [x] Create AuthContext with authentication methods
- [x] Create useAuth custom hook
- [x] Create ProtectedRoute component
- [x] Create auth.css styling

### Phase 2: Pages ✅
- [x] Create Login page component
- [x] Create Register page component with OTP verification
- [x] Create Dashboard page component

### Phase 3: Integration ✅
- [x] Update Router.jsx with new routes
- [x] Integrate API calls in authentication pages
- [x] Implement error handling and validation

### Phase 4: Testing (Next)
- [ ] Test login flow end-to-end
- [ ] Test registration flow with OTP
- [ ] Test OTP resend functionality
- [ ] Test token persistence and refresh
- [ ] Test logout functionality
- [ ] Test protected routes
- [ ] Test error handling for invalid credentials
- [ ] Test error handling for network failures

### Phase 5: Enhancements (Optional)
- [ ] Add "Forgot Password" flow
- [ ] Add social login integration
- [ ] Add email confirmation
- [ ] Add session timeout handling
- [ ] Add "Remember Me" functionality
- [ ] Add CAPTCHA to forms
- [ ] Add password strength indicator

## Testing Guide

### Manual Testing

#### Login Flow
1. Navigate to `/login`
2. Enter test email and password
3. Click "Sign In"
4. Verify token is stored in localStorage
5. Verify redirect to `/dashboard`
6. Verify user data displayed on dashboard

#### Register Flow
1. Navigate to `/register`
2. Fill all required fields
3. Click "Create Account"
4. Verify OTP verification page appears
5. Enter OTP from email
6. Verify redirect to dashboard
7. Verify user is logged in

#### Protected Route
1. Logout
2. Try to access `/dashboard` directly
3. Verify redirect to `/login`
4. Login
5. Verify access to `/dashboard`

#### Error Handling
1. Try login with invalid email format
2. Try login with empty fields
3. Try register with mismatched passwords
4. Try OTP with wrong code
5. Verify error messages display correctly

### Automated Testing

Create test files:
- `src/Page/Login/__tests__/index.test.jsx`
- `src/Page/Register/__tests__/index.test.jsx`
- `src/context/__tests__/AuthContext.test.jsx`
- `src/Components/ProtectedRoute/__tests__/index.test.jsx`

## Common Issues & Solutions

### Issue: Token not persisting on page refresh
**Solution:** Ensure localStorage is being used correctly in AuthContext
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) setToken(token);
}, []);
```

### Issue: Protected route not working
**Solution:** Ensure ProtectedRoute component is properly checking isAuthenticated
```javascript
if (!isAuthenticated && !loading) {
  return <Navigate to="/login" replace />;
}
```

### Issue: OTP not being sent
**Solution:** Check backend Twilio/Nodemailer configuration
- Verify email/SMS credentials
- Check email templates
- Review backend logs

### Issue: CORS errors
**Solution:** Ensure backend is allowing CORS
```javascript
// Backend should have CORS configured
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Security Considerations

1. **Token Storage**
   - Tokens stored in localStorage (vulnerable to XSS)
   - Consider using httpOnly cookies in future
   - Clear token on logout

2. **Password Security**
   - Passwords sent over HTTPS only
   - Never log or store passwords
   - Validate password strength on backend

3. **OTP Security**
   - OTP expires after 5-10 minutes
   - OTP is 6 digits (1 million combinations)
   - Only allow 3-5 failed attempts
   - Rate limit OTP resend requests

4. **Session Security**
   - Implement token refresh/rotation
   - Clear sensitive data on logout
   - Implement logout on inactivity
   - Use HTTPS only in production

## API Response Format

### Successful Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  },
  "success": true
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### OTP Verification Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user"
  },
  "success": true
}
```

## File Structure

```
src/
├── Page/
│   ├── Login/
│   │   ├── index.jsx          # Login page component
│   │   └── auth.css           # Shared auth styling
│   ├── Register/
│   │   └── index.jsx          # Register page component (uses auth.css)
│   └── Dashboard/
│       └── index.jsx          # Dashboard page component (protected)
├── Components/
│   └── ProtectedRoute/
│       └── index.jsx          # Protected route wrapper
├── context/
│   └── AuthContext.jsx        # Authentication context provider
├── services/
│   └── api.js                 # API client with auth endpoints
└── Router.jsx                 # Route configuration
```

## Next Steps

1. **Test Authentication Flow**
   - Manual testing of login/register/logout
   - Test OTP verification
   - Test protected routes

2. **Fix Issues**
   - Debug any authentication errors
   - Verify API responses match expected format
   - Test with real backend

3. **Add Additional Pages**
   - Create profile management page
   - Create password reset page
   - Create account settings page

4. **Enhance Features**
   - Add forgot password flow
   - Add social login integration
   - Add two-factor authentication
   - Add session management

5. **Improve Security**
   - Implement token refresh
   - Use httpOnly cookies
   - Add CSRF protection
   - Implement rate limiting
