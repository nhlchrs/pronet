# Authentication Quick Reference

## 🚀 Quick Start

### Access Authentication Pages
- **Login**: Navigate to `/login`
- **Register**: Navigate to `/register`
- **Dashboard**: Navigate to `/dashboard` (protected)

### Using Authentication in Components

```jsx
import { useAuth } from "../context/AuthContext";

export default function MyComponent() {
  const { user, token, loading, error, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome {user?.fname}!</div>;
}
```

## 📝 Form Validation Rules

### Registration
- **First Name**: Required, min 1 character
- **Last Name**: Required, min 1 character
- **Email**: Required, valid format (name@domain.com)
- **Phone**: Required, any format
- **Password**: Required, minimum 6 characters
- **Confirm Password**: Must match password
- **Terms**: Must be checked

### Login
- **Email**: Required, valid format
- **Password**: Required

### OTP Verification
- **OTP**: Required, exactly 6 digits

## 🎨 Tailwind Classes Reference

### Form Input
```jsx
className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:bg-white transition-all duration-300"
```

### Button
```jsx
className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
```

### Error Alert
```jsx
className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
```

### Container
```jsx
className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden"
```

## 🔑 API Methods

### Registration
```javascript
const response = await register(firstName, lastName, email, phone, password);
// Returns: { success, message }
// Then switch to OTP step
```

### Verify OTP
```javascript
const response = await verifyOTP(email, otp);
// Returns: { token, user, success }
// Token auto-saved to localStorage
```

### Login
```javascript
const response = await login(email, password);
// Returns: { token, user, success }
// Auto-redirect to dashboard
```

### Logout
```javascript
logout();
// Clears token and user data
// Redirect to login manually
```

### Resend OTP
```javascript
const { authAPI } = require("../services/api");
await authAPI.resendOTP(email);
// Sends new OTP to email
```

## 🗂️ File Structure

```
src/
├── Page/
│   ├── Login/
│   │   └── index.jsx (230+ lines, Tailwind)
│   ├── Register/
│   │   └── index.jsx (380+ lines, Tailwind)
│   └── Dashboard/
│       └── index.jsx (50+ lines, Bootstrap)
├── Components/
│   └── ProtectedRoute/
│       └── index.jsx (20 lines)
├── context/
│   └── AuthContext.jsx (160 lines)
├── services/
│   └── api.js (authAPI object)
└── Router.jsx (updated with auth routes)
```

## 🌐 Routes

```javascript
// Public routes
/login          // Login page
/register       // Registration page
/forgot-password // Forgot password (link present, page not created)

// Protected routes
/dashboard      // Dashboard (requires auth)
```

## 📊 State Management

### AuthContext provides:
```javascript
{
  user: { id, fname, lname, email, phone, role },
  token: "JWT_TOKEN_STRING",
  loading: boolean,
  error: "Error message or null",
  isAuthenticated: boolean,
  register: Function,
  login: Function,
  verifyOTP: Function,
  resendOTP: Function,
  logout: Function,
  setError: Function
}
```

## 🧪 Testing URLs

### Local Development
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Login: http://localhost:5173/login
- Register: http://localhost:5173/register
- Dashboard: http://localhost:5173/dashboard

## ⚙️ Environment Variables

Frontend (.env):
```
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## 🔐 Token Storage

```javascript
// Token stored as:
localStorage.getItem('token')    // JWT string

// User data stored as:
localStorage.getItem('user')     // JSON string

// Clear on logout:
localStorage.removeItem('token')
localStorage.removeItem('user')
```

## 📱 Responsive Breakpoints

- **Mobile**: < 480px (stack layout, hidden labels)
- **Tablet**: 768px (medium layout, visible labels)
- **Desktop**: 1024px+ (full layout with all features)

## 🎯 Common Tasks

### Protect a Route
```jsx
<Route 
  path="my-page" 
  element={<ProtectedRoute><MyPage /></ProtectedRoute>} 
/>
```

### Check if User is Authenticated
```jsx
const { isAuthenticated } = useAuth();
if (!isAuthenticated) return <Redirect to="/login" />;
```

### Get Current User Data
```jsx
const { user } = useAuth();
console.log(user.fname, user.email);
```

### Handle Login Errors
```jsx
try {
  await login(email, password);
  navigate("/dashboard");
} catch (error) {
  setLocalError(error.message);
}
```

### Show Loading State
```jsx
{loading ? "Loading..." : "Click to Submit"}
```

## 🐛 Debugging Tips

1. **Check localStorage**: Open DevTools → Application → Local Storage
2. **Check Network**: Open DevTools → Network tab → Filter XHR
3. **Check Console**: Look for JavaScript errors
4. **Check Token**: `localStorage.getItem('token')` should be non-empty after login
5. **Check User Data**: `localStorage.getItem('user')` should be valid JSON

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| "Email is required" | Form validation working, enter email |
| CORS error | Check backend CORS configuration |
| Token not saving | Verify localStorage is enabled |
| No redirect after login | Check navigate() is called |
| OTP not received | Check backend email service |
| 401 Unauthorized | Token may be expired, login again |
| "Invalid password" | Check credentials are correct |

## 📞 Support

For issues:
1. Check AUTHENTICATION_GUIDE.md for detailed documentation
2. Check AUTHENTICATION_TESTING.md for testing scenarios
3. Review the relevant page component code
4. Check AuthContext for auth methods
5. Check API service for endpoint definitions

---

**Last Updated**: December 25, 2025
**Status**: ✅ Complete with Tailwind CSS
**Version**: 1.0
