# Frontend API Integration Checklist

## Setup Checklist
- [ ] Install dependencies: `npm install socket.io-client`
- [ ] Create `.env` file with API_URL and SOCKET_URL
- [ ] Verify backend is running on port 5000
- [ ] Start frontend: `npm run dev`
- [ ] Check console for "Socket connected" message

---

## Integration Verification

### Authentication System
- [ ] Can access `useAuth` hook in components
- [ ] Token is stored in localStorage after login
- [ ] Token is sent with every API request
- [ ] User data persists on page refresh
- [ ] Logout clears token and user data
- [ ] Error messages display on failed login
- [ ] Loading states show during API calls

### Real-time Updates
- [ ] Socket.io connects on app load
- [ ] Connection logged in console
- [ ] Notifications subscribed after login
- [ ] Real-time notifications display
- [ ] Online/offline status updates
- [ ] Team updates broadcast in real-time
- [ ] No console errors for socket

### Contact Form
- [ ] Form visible on /contact page
- [ ] All fields accept input (name, email, phone, subject, message)
- [ ] Form submits to backend
- [ ] Success message displays after submission
- [ ] Error message displays on failure
- [ ] Loading spinner shows during submission
- [ ] Form clears after successful submission

### Newsletter Form
- [ ] Newsletter form visible in footer
- [ ] Email validation works
- [ ] Form submits to backend
- [ ] Success notification appears
- [ ] Error notification appears
- [ ] Loading state visible
- [ ] Form clears after successful submission

---

## Component Creation Checklist

### When Creating Auth Pages

**Login Page:**
- [ ] Import `useAuth` hook
- [ ] Create form with email and password
- [ ] Handle form submission with `login()` method
- [ ] Display loading state
- [ ] Display error messages
- [ ] Redirect to dashboard on success
- [ ] Link to register page
- [ ] Add remember me option (optional)

**Register Page:**
- [ ] Import `useAuth` hook
- [ ] Create form with all required fields
- [ ] Handle form submission with `register()` method
- [ ] Display loading state
- [ ] Display error messages
- [ ] Redirect to OTP page on success
- [ ] Add password strength indicator (optional)
- [ ] Add terms & conditions checkbox

**OTP Verification Page:**
- [ ] Import `useAuth` hook
- [ ] Create form with OTP input (6 digits)
- [ ] Handle verification with `verifyOTP()` method
- [ ] Display loading state
- [ ] Display error messages
- [ ] Add resend OTP button with countdown (optional)
- [ ] Redirect to dashboard on success

### When Creating Protected Pages

**Dashboard:**
- [ ] Wrap in `ProtectedRoute` component
- [ ] Import `useAuth` hook
- [ ] Import `useSocket` hook
- [ ] Display user information from auth context
- [ ] Subscribe to notifications on mount
- [ ] Display real-time notifications
- [ ] Add logout button
- [ ] Handle socket disconnection

**Profile Page:**
- [ ] Use `userAPI.getProfile()` to fetch data
- [ ] Display user information
- [ ] Add form to update profile using `userAPI.updateProfile()`
- [ ] Add password change form
- [ ] Show loading states
- [ ] Display success/error messages

**Meetings Page:**
- [ ] Fetch meetings with `meetingAPI.getAllMeetings()`
- [ ] Display meetings list
- [ ] Add button to schedule new meeting
- [ ] Use `meetingAPI.scheduleMeeting()` to create
- [ ] Show meeting details modal (optional)
- [ ] Add edit/delete options
- [ ] Show real-time updates via socket

**Analytics Page:**
- [ ] Use `analyticsAPI.getPlatformMetrics()` to fetch data
- [ ] Display metrics in charts/cards
- [ ] Use `analyticsAPI.getUserAnalytics()` for user data
- [ ] Subscribe to real-time analytics updates
- [ ] Display loading states
- [ ] Add date range filter (optional)

### When Creating Payment Pages

**Payment Page:**
- [ ] Create form with amount input
- [ ] Use `paymentAPI.initiatePayment()` to create payment
- [ ] Redirect to payment gateway/modal
- [ ] Handle payment callback
- [ ] Use `paymentAPI.verifyPayment()` to verify
- [ ] Display payment status
- [ ] Show order confirmation

**Payment History Page:**
- [ ] Use `paymentAPI.getPaymentHistory()` to fetch
- [ ] Display transactions in table
- [ ] Add filters (date, amount, status)
- [ ] Show loading states
- [ ] Add pagination using `usePagination` hook
- [ ] Click row to show details

---

## API Endpoint Checklist

### Authentication Endpoints
- [ ] POST /api/register - User registration
- [ ] POST /api/login - User login
- [ ] POST /api/verify - OTP verification
- [ ] POST /api/resendOtp - Resend OTP
- [ ] GET /api/allusers - Get all users
- [ ] POST /api/getUserbyId - Get user by ID

### User Endpoints
- [ ] GET /api/user/profile - Get profile
- [ ] PUT /api/user/profile - Update profile
- [ ] POST /api/user/change-password - Change password

### Session Endpoints
- [ ] POST /api/session/create - Create session
- [ ] GET /api/session/{id} - Get session
- [ ] PUT /api/session/{id} - Update session
- [ ] DELETE /api/session/{id} - Delete session

### Meeting Endpoints
- [ ] POST /api/meeting/create - Create meeting
- [ ] GET /api/meeting/list - Get all meetings
- [ ] GET /api/meeting/{id} - Get meeting
- [ ] PUT /api/meeting/{id} - Update meeting
- [ ] DELETE /api/meeting/{id} - Delete meeting
- [ ] POST /api/meeting/schedule - Schedule meeting

### Announcement Endpoints
- [ ] POST /api/announcement/create - Create announcement
- [ ] GET /api/announcement/list - Get announcements
- [ ] GET /api/announcement/{id} - Get announcement
- [ ] PUT /api/announcement/{id} - Update announcement
- [ ] DELETE /api/announcement/{id} - Delete announcement

### File Endpoints
- [ ] POST /api/upload/file - Upload file
- [ ] GET /api/upload/list - Get files
- [ ] DELETE /api/upload/delete/{id} - Delete file

### Payment Endpoints
- [ ] POST /api/payments/initiate - Initiate payment
- [ ] GET /api/payments/history - Get payment history
- [ ] POST /api/payments/verify/{id} - Verify payment
- [ ] GET /api/payments/status/{id} - Get payment status

### Team Endpoints
- [ ] GET /api/team/list - Get teams
- [ ] POST /api/team/create - Create team
- [ ] GET /api/team/{id} - Get team
- [ ] PUT /api/team/{id} - Update team
- [ ] DELETE /api/team/{id} - Delete team
- [ ] POST /api/team/{id}/add-member - Add member
- [ ] DELETE /api/team/{id}/remove-member/{memberId} - Remove member

### Analytics Endpoints
- [ ] GET /api/admin/analytics/metrics - Get metrics
- [ ] GET /api/admin/analytics/user/{id} - Get user analytics
- [ ] GET /api/admin/analytics/revenue - Get revenue
- [ ] GET /api/admin/analytics/team/{id} - Get team analytics

### Contact & Newsletter Endpoints
- [ ] POST /api/contact/submit - Submit contact form
- [ ] POST /api/newsletter/subscribe - Subscribe newsletter
- [ ] POST /api/newsletter/unsubscribe - Unsubscribe newsletter

---

## Testing Checklist

### Manual Testing
- [ ] Test user registration flow
- [ ] Test OTP verification
- [ ] Test user login
- [ ] Test logout functionality
- [ ] Test token persistence
- [ ] Test real-time notifications
- [ ] Test contact form submission
- [ ] Test newsletter subscription
- [ ] Test all API endpoints in Postman
- [ ] Test socket connection/disconnection

### Error Handling
- [ ] Test invalid email login
- [ ] Test wrong password
- [ ] Test expired OTP
- [ ] Test network error handling
- [ ] Test 401 unauthorized errors
- [ ] Test 500 server errors
- [ ] Test validation error messages
- [ ] Test form validation

### Browser Testing
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in mobile browsers
- [ ] Test console for errors
- [ ] Test localStorage
- [ ] Test sessionStorage
- [ ] Check responsive design

### Performance
- [ ] API calls complete within reasonable time
- [ ] No memory leaks in components
- [ ] Socket connection stable
- [ ] No unnecessary re-renders
- [ ] Images load properly
- [ ] Bundle size acceptable
- [ ] Lighthouse score > 80

---

## Deployment Checklist

Before deploying to production:

### Code Quality
- [ ] No console errors/warnings
- [ ] No eslint errors
- [ ] All tests passing
- [ ] Code formatted properly
- [ ] Comments on complex logic
- [ ] No hardcoded values
- [ ] Environment variables set

### Security
- [ ] Remove debug logging
- [ ] Token stored securely
- [ ] CORS configured properly
- [ ] API calls use HTTPS
- [ ] Sensitive data not exposed
- [ ] Password requirements enforced
- [ ] XSS protection in place

### Configuration
- [ ] Update API_URL for production
- [ ] Update SOCKET_URL for production
- [ ] Set correct environment variables
- [ ] Verify backend URL accessible
- [ ] Database migrations done
- [ ] CDN configured (if using)

### Testing
- [ ] End-to-end testing done
- [ ] User acceptance testing
- [ ] Cross-browser testing
- [ ] Mobile responsiveness verified
- [ ] Load testing completed
- [ ] Security audit done

### Monitoring
- [ ] Error logging configured
- [ ] Analytics tracking added
- [ ] Performance monitoring set up
- [ ] Uptime monitoring enabled
- [ ] Backup system in place
- [ ] Rollback plan ready

---

## Troubleshooting Checklist

If features not working:

### API Issues
- [ ] Backend is running on port 5000
- [ ] VITE_API_URL is correct in .env
- [ ] Token is sent in Authorization header
- [ ] CORS is enabled on backend
- [ ] Check backend logs for errors
- [ ] Verify endpoint paths are correct
- [ ] Check request payload format

### Socket.io Issues
- [ ] Backend socket server is running
- [ ] VITE_SOCKET_URL is correct in .env
- [ ] Socket connected message in console
- [ ] Check browser DevTools Network tab
- [ ] Verify socket events in backend logs
- [ ] Check firewall/proxy settings
- [ ] Ensure token is valid

### Authentication Issues
- [ ] Check localStorage for token
- [ ] Verify token format (Bearer token)
- [ ] Check token expiration
- [ ] Verify JWT_SECRET on backend
- [ ] Check browser cookies
- [ ] Clear cache and localStorage
- [ ] Verify user data structure

### Form Issues
- [ ] Check form field names match backend
- [ ] Verify form submission method (POST)
- [ ] Check form validation rules
- [ ] Verify form data format (JSON)
- [ ] Check Content-Type header
- [ ] Verify error messages display
- [ ] Check API endpoint paths

---

## Files Modified/Created

Created:
- ✅ `src/services/api.js` - API client
- ✅ `src/context/AuthContext.jsx` - Auth context
- ✅ `src/context/SocketContext.jsx` - Socket context
- ✅ `src/hooks/useCustomHooks.js` - Custom hooks
- ✅ `API_INTEGRATION_GUIDE.md` - Full documentation
- ✅ `INTEGRATION_SUMMARY.md` - Quick summary
- ✅ `CODE_EXAMPLES.md` - Code examples
- ✅ `INTEGRATION_CHECKLIST.md` - This file

Updated:
- ✅ `src/App.jsx` - Added providers
- ✅ `src/Components/Form/ContactForm.jsx` - API integration
- ✅ `src/Components/Form/NewsletterForm.jsx` - API integration
- ✅ `package.json` - Added socket.io-client

---

## Quick Links

- API Documentation: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
- Code Examples: [CODE_EXAMPLES.md](./CODE_EXAMPLES.md)
- Integration Summary: [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)
- Backend Repo: [pronext-backend](../pronext-backend)

---

## Support

For issues or questions:
1. Check API_INTEGRATION_GUIDE.md
2. Review CODE_EXAMPLES.md for similar implementations
3. Check backend API documentation
4. Check browser console for errors
5. Verify environment variables are set
6. Test endpoints in Postman first

Last Updated: December 24, 2025
