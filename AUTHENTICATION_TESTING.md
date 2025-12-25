# Authentication Testing Guide

## Quick Start Testing

### Test Environment Setup

1. **Start Backend Server**
   ```bash
   cd pronext-backend
   npm start
   # Backend should run on http://localhost:5000
   ```

2. **Start Frontend Dev Server**
   ```bash
   cd pronet
   npm run dev
   # Frontend should run on http://localhost:5173
   ```

3. **Check .env Configuration**
   - Ensure `VITE_API_URL=http://localhost:5000` in frontend `.env`
   - Verify backend API endpoints are accessible

## Manual Testing Scenarios

### Test 1: Register New User

**Steps:**
1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Password: Test@123
   - Confirm Password: Test@123
3. Check the "I agree to Terms & Conditions" checkbox
4. Click "Create Account"

**Expected Results:**
- ✅ Form validates input
- ✅ Loading spinner shows during submission
- ✅ No errors for valid input
- ✅ Switches to OTP verification step
- ✅ Shows email address being verified

**Potential Issues:**
- ❌ Form shows validation error for missing field → Check required field validation
- ❌ API error appears → Check backend is running
- ❌ Doesn't switch to OTP step → Check registration API response
- ❌ OTP not sent → Check email configuration on backend

### Test 2: OTP Verification

**Prerequisites:** Completed Test 1

**Steps:**
1. Check email (real or backend logs) for OTP code
2. Copy the 6-digit OTP
3. Paste into OTP verification form
4. Click "Verify Code"

**Expected Results:**
- ✅ OTP input only accepts digits
- ✅ OTP accepts exactly 6 digits
- ✅ Loading spinner shows during verification
- ✅ On success, redirects to `/dashboard`
- ✅ User remains logged in after refresh

**Potential Issues:**
- ❌ "Invalid OTP" error → Check OTP is correct and not expired
- ❌ Verification fails but redirect happens → Check token is being stored
- ❌ User data not showing on dashboard → Check localStorage has user data

### Test 3: Resend OTP

**Prerequisites:** On OTP verification step

**Steps:**
1. Click "Resend OTP"
2. Wait for confirmation message
3. Check email for new OTP
4. Use new OTP to verify

**Expected Results:**
- ✅ Button shows loading state
- ✅ Confirmation alert appears
- ✅ New OTP is sent to email
- ✅ New OTP is valid for verification
- ✅ Old OTP no longer works (optional, backend dependent)

**Potential Issues:**
- ❌ Resend fails → Check backend OTP service
- ❌ Email not received → Check backend email configuration
- ❌ Error message not showing → Check error display logic

### Test 4: Login Existing User

**Prerequisites:** User already registered (Test 1-2 completed)

**Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter email: john@example.com
3. Enter password: Test@123
4. Click "Sign In"

**Expected Results:**
- ✅ Form validates email format
- ✅ Form validates password is not empty
- ✅ Loading spinner shows during login
- ✅ On success, redirects to `/dashboard`
- ✅ User data displays on dashboard
- ✅ Token stored in localStorage

**Potential Issues:**
- ❌ "Invalid email or password" → Verify credentials are correct
- ❌ Validation error for valid email → Check email regex in component
- ❌ No redirect after login → Check navigation logic
- ❌ User data missing → Check API response includes user object

### Test 5: Show/Hide Password Toggle

**Steps:**
1. Navigate to `/login`
2. Click on password field
3. Type a password
4. Click the eye icon
5. Verify password is visible
6. Click eye icon again
7. Verify password is hidden

**Expected Results:**
- ✅ Password hidden by default (type="password")
- ✅ Eye icon changes when toggled
- ✅ Password text visible when eye is open
- ✅ Works on both Login and Register pages

### Test 6: Remember Me Functionality

**Steps:**
1. Navigate to `/login`
2. Enter credentials
3. Check "Remember me"
4. Click "Sign In"
5. Close browser/tab
6. Reopen and navigate to `/login`

**Expected Results:**
- ✅ Email field may be pre-filled (optional)
- ✅ User is still logged in
- ✅ Token is in localStorage
- ✅ Auto-redirect to dashboard if already logged in

### Test 7: Form Validation Errors

**Test Case A: Empty Fields**
1. Navigate to `/login`
2. Leave all fields empty
3. Click "Sign In"

**Expected:** Error message for required field

**Test Case B: Invalid Email**
1. Enter email: notanemail
2. Click "Sign In"

**Expected:** Error message for invalid email format

**Test Case C: Password Mismatch (Register)**
1. Navigate to `/register`
2. Fill all fields
3. Password: Test@123
4. Confirm Password: Test@456
5. Click "Create Account"

**Expected:** Error message "Passwords do not match"

**Test Case D: Short Password (Register)**
1. Enter password: 123
2. Click "Create Account"

**Expected:** Error message "Password must be at least 6 characters"

### Test 8: Protected Route Access

**Steps:**
1. Logout if logged in
2. Navigate directly to `http://localhost:5173/dashboard`

**Expected Results:**
- ✅ Redirected to `/login`
- ✅ Shows loading spinner briefly
- ✅ Cannot access dashboard without login

**Steps to verify protection works:**
1. Login successfully
2. Navigate to `/dashboard`
3. Verify dashboard displays
4. Click logout
5. Verify redirected to `/login`

### Test 9: Logout Functionality

**Steps:**
1. Login successfully
2. Navigate to `/dashboard`
3. Click "Logout" button

**Expected Results:**
- ✅ Token removed from localStorage
- ✅ User data cleared from localStorage
- ✅ Redirected to `/login`
- ✅ Authentication state is reset

### Test 10: Token Persistence on Refresh

**Steps:**
1. Login successfully
2. Verify in localStorage: `localStorage.getItem('token')` exists
3. Refresh page (F5 or Ctrl+R)
4. Verify still logged in
5. Verify dashboard displays
6. Verify token unchanged

**Expected Results:**
- ✅ Page doesn't redirect to login
- ✅ User data still available
- ✅ Token persists across refresh
- ✅ No flickering during load

## Browser DevTools Testing

### Check Token in localStorage

1. Open DevTools (F12)
2. Go to "Application" or "Storage" tab
3. Click "Local Storage"
4. Expand localhost:5173
5. Look for key: "token"

**Expected:**
- ✅ Token present after login
- ✅ Token is valid JWT format
- ✅ Token removed after logout

### Check API Requests

1. Open DevTools
2. Go to "Network" tab
3. Filter to XHR (XMLHttpRequest)
4. Perform login
5. Click on login request
6. Go to "Request" tab

**Expected:**
- ✅ POST to `/api/auth/login`
- ✅ Request body has email and password
- ✅ Response has token and user object
- ✅ Status code 200

### Check Console for Errors

1. Open DevTools Console tab
2. Perform authentication flows
3. Look for any JavaScript errors

**Expected:**
- ✅ No red errors in console
- ✅ useAuth hook working
- ✅ Context provider properly wrapped

## Error Scenario Testing

### Scenario 1: Invalid Credentials

**Steps:**
1. Go to `/login`
2. Enter: email@example.com
3. Enter: WrongPassword
4. Click "Sign In"

**Expected:**
- ✅ Error message displays
- ✅ Error message is clear and helpful
- ✅ Form remains on page
- ✅ No redirect on error

### Scenario 2: Network Error (Backend Down)

**Steps:**
1. Stop backend server
2. Go to `/login`
3. Try to login

**Expected:**
- ✅ Error message about connection failure
- ✅ Helpful message to user
- ✅ No crash or blank page

### Scenario 3: Expired Token

**Steps:**
1. Login successfully
2. Manually remove token from localStorage
3. Try to access `/dashboard`

**Expected:**
- ✅ Redirected to `/login`
- ✅ Clear message to re-authenticate

## Edge Cases

### Edge Case 1: Rapid Form Submissions

**Steps:**
1. Go to `/login`
2. Fill form
3. Click submit multiple times rapidly

**Expected:**
- ✅ Only one API call made
- ✅ Button disabled during submission
- ✅ No duplicate requests

### Edge Case 2: Special Characters in Input

**Steps:**
1. Register with email: test+alias@example.com
2. Use password: P@$$w0rd!

**Expected:**
- ✅ Fields accept special characters
- ✅ Validation still works
- ✅ API request succeeds

### Edge Case 3: Very Long Inputs

**Steps:**
1. Paste very long string in email field
2. Paste very long password

**Expected:**
- ✅ Fields limit input appropriately
- ✅ No UI breakage
- ✅ Validation catches issues

## Automated Test Templates

### Jest Test Example

```javascript
// src/Page/Login/__tests__/index.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../../context/AuthContext';
import LoginPage from '../index';

describe('LoginPage', () => {
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>{component}</AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders login form', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
  });

  test('shows error for empty email', async () => {
    renderWithProviders(<LoginPage />);
    const submitBtn = screen.getByText('Sign In');
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });
});
```

## Testing Checklist

**Before Deployment:**
- [ ] Login with valid credentials works
- [ ] Register flow with OTP verification works
- [ ] OTP resend works
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout clears session
- [ ] Token persists on page refresh
- [ ] Error messages display correctly
- [ ] Form validation works
- [ ] Loading states show during API calls
- [ ] No console errors
- [ ] Responsive design works on mobile
- [ ] Password toggle works
- [ ] Browser back button doesn't expose sensitive pages

## Performance Testing

### Load Time
- Frontend load time: < 3 seconds
- Login API response: < 1 second
- OTP verification API response: < 1 second

### Browser Support
- Chrome/Edge: Latest version
- Firefox: Latest version
- Safari: Latest version
- Mobile browsers: iOS Safari, Chrome Mobile

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| CORS error | Check backend CORS configuration |
| Token not saving | Verify localStorage is enabled |
| Email validation too strict | Check regex pattern in component |
| OTP not sending | Check email service config on backend |
| 401 errors after login | Verify token format matches API expectations |
| Redirect loop | Check ProtectedRoute logic |

## Test Data

**Test User 1:**
- Email: test@example.com
- Password: Test@1234
- OTP: Will be sent to email

**Test User 2:**
- Email: user@example.com
- Password: SecurePass123
- OTP: Will be sent to email

## Sign-Off Checklist

- [ ] All manual tests completed
- [ ] No critical bugs found
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Security checks passed
- [ ] Ready for QA testing
- [ ] Documentation complete
- [ ] Team notified and trained
