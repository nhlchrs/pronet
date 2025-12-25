# Frontend API Integration Guide

## Overview
Complete API integration between ProNet Frontend and ProNext Backend with authentication, real-time features, and form handling.

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
npm install socket.io-client
```

### 2. Environment Setup
Create a `.env` file in the root of the frontend project:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Update for production:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
```

### 3. Start Development Server
```bash
npm run dev
```

---

## Integration Features

### ✅ Authentication System

**Components Updated:**
- App.jsx - Added AuthProvider wrapper

**Available Methods:**
```javascript
import { useAuth } from './context/AuthContext';

const { 
  user,
  token,
  isAuthenticated,
  loading,
  error,
  register,
  login,
  verifyOTP,
  resendOTP,
  logout,
  getUserMetrics,
  getDashboardVisualizations
} = useAuth();
```

**Usage Example:**
```jsx
import { useAuth } from './context/AuthContext';

function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      // Redirect on success
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    // Form JSX
  );
}
```

---

### ✅ Real-time Features (Socket.io)

**Components Updated:**
- App.jsx - Added SocketProvider wrapper

**Available Methods:**
```javascript
import { useSocket } from './context/SocketContext';

const {
  socket,
  isConnected,
  notifications,
  subscribeNotifications,
  unsubscribeNotifications,
  subscribeTeam,
  unsubscribeTeam,
  subscribeAnalytics,
  subscribePayoutUpdates,
  subscribeMeeting,
  clearNotifications
} = useSocket();
```

**Usage Example:**
```jsx
import { useSocket } from './context/SocketContext';

function Dashboard() {
  const { isConnected, notifications, subscribeNotifications } = useSocket();

  useEffect(() => {
    if (isConnected) {
      subscribeNotifications();
    }
  }, [isConnected]);

  return (
    <div>
      <h2>Notifications: {notifications.length}</h2>
      {notifications.map(n => <div key={n.id}>{n.message}</div>)}
    </div>
  );
}
```

---

### ✅ Contact Form Integration

**Location:** `src/Components/Form/ContactForm.jsx`

**Features:**
- Automatic API call submission
- Loading states
- Error handling
- Success/error messages

**Form Fields:**
- Name (required)
- Email (required)
- Phone (optional)
- Subject (required)
- Message (required)

**Backend Endpoint:**
```
POST /api/contact/submit
Body: {
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
}
```

---

### ✅ Newsletter Subscription

**Location:** `src/Components/Form/NewsletterForm.jsx`

**Features:**
- Email validation
- Automatic API submission
- Loading states
- Success/error messages

**Backend Endpoint:**
```
POST /api/newsletter/subscribe
Body: {
  email: string
}
```

---

### ✅ API Services

**Location:** `src/services/api.js`

**Available Endpoint Groups:**

#### Authentication
```javascript
import { authAPI } from './services/api';

await authAPI.register(userData);
await authAPI.login(email, password);
await authAPI.verifyOTP(email, otp);
await authAPI.resendOTP(email);
await authAPI.getAllUsers();
await authAPI.getUserById(userId);
await authAPI.getUserMetrics();
await authAPI.getDashboardVisualizations();
```

#### Sessions
```javascript
import { sessionAPI } from './services/api';

await sessionAPI.createSession(sessionData);
await sessionAPI.getSession(sessionId);
await sessionAPI.updateSession(sessionId, data);
await sessionAPI.deleteSession(sessionId);
```

#### Users
```javascript
import { userAPI } from './services/api';

await userAPI.getProfile();
await userAPI.updateProfile(userData);
await userAPI.changePassword(passwordData);
```

#### Meetings
```javascript
import { meetingAPI } from './services/api';

await meetingAPI.createMeeting(meetingData);
await meetingAPI.getMeeting(meetingId);
await meetingAPI.getAllMeetings();
await meetingAPI.updateMeeting(meetingId, data);
await meetingAPI.scheduleMeeting(meetingData);
```

#### Announcements
```javascript
import { announcementAPI } from './services/api';

await announcementAPI.createAnnouncement(announcementData);
await announcementAPI.getAnnouncements();
await announcementAPI.getAnnouncement(announcementId);
await announcementAPI.updateAnnouncement(announcementId, data);
```

#### Files
```javascript
import { fileAPI } from './services/api';

await fileAPI.uploadFile(file, folder);
await fileAPI.deleteFile(fileId);
await fileAPI.getFiles();
```

#### Payments
```javascript
import { paymentAPI } from './services/api';

await paymentAPI.initiatePayment(paymentData);
await paymentAPI.getPaymentHistory();
await paymentAPI.verifyPayment(paymentId);
await paymentAPI.getPaymentStatus(paymentId);
```

#### Teams
```javascript
import { teamAPI } from './services/api';

await teamAPI.getTeams();
await teamAPI.createTeam(teamData);
await teamAPI.getTeam(teamId);
await teamAPI.addTeamMember(teamId, memberData);
```

#### Analytics
```javascript
import { analyticsAPI } from './services/api';

await analyticsAPI.getPlatformMetrics();
await analyticsAPI.getUserAnalytics(userId);
await analyticsAPI.getRevenueAnalytics();
```

#### Contact & Newsletter
```javascript
import { contactAPI } from './services/api';

await contactAPI.submitContactForm(contactData);
await contactAPI.subscribeNewsletter(email);
await contactAPI.unsubscribeNewsletter(email);
```

---

### ✅ Custom Hooks

**Location:** `src/hooks/useCustomHooks.js`

#### useAuthFlow
```javascript
import { useAuthFlow } from './hooks/useCustomHooks';

const {
  step,           // 'login', 'register', 'verify'
  email,
  otpError,
  handleRegister,
  handleVerifyOTP,
  handleResendOTP,
  handleLogin
} = useAuthFlow();
```

#### useForm
```javascript
import { useForm } from './hooks/useCustomHooks';

const {
  formData,
  handleChange,
  handleSubmit,
  resetForm,
  loading,
  error,
  success
} = useForm(initialState, onSubmit);
```

#### useAsync
```javascript
import { useAsync } from './hooks/useCustomHooks';

const { execute, status, data, error } = useAsync(asyncFunction);
```

#### usePagination
```javascript
import { usePagination } from './hooks/useCustomHooks';

const {
  currentPage,
  totalPages,
  currentItems,
  nextPage,
  prevPage
} = usePagination(items, 10);
```

#### useLocalStorage
```javascript
import { useLocalStorage } from './hooks/useCustomHooks';

const [user, setUser] = useLocalStorage('user', null);
```

#### useFetch
```javascript
import { useFetch } from './hooks/useCustomHooks';

const { data, loading, error, refetch } = useFetch(url, 'GET', options);
```

---

## Error Handling

All API calls automatically handle errors. Token expiration is managed by the AuthContext.

**Example Error Handling:**
```jsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { login, error, setError } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err.message);
      // Show error to user
    }
  };

  useEffect(() => {
    // Clear error after 3 seconds
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <>
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Form JSX */}
    </>
  );
}
```

---

## Creating New API Endpoints

To add new endpoints to the API service:

1. Add method to appropriate API object in `src/services/api.js`:
```javascript
export const customAPI = {
  getCustom: async (id) => {
    return apiCall(`/custom/${id}`, 'GET');
  },

  createCustom: async (data) => {
    return apiCall('/custom/create', 'POST', data);
  }
};
```

2. Use in component:
```javascript
import { customAPI } from './services/api';

const response = await customAPI.getCustom(id);
```

---

## Testing API Integration

### 1. Test Authentication
- Go to Contact page
- Fill in contact form
- Check Network tab to see API call
- Verify response in browser console

### 2. Test Newsletter
- Fill newsletter form in footer
- Check Network tab
- Verify subscription confirmation

### 3. Test Real-time
- Open browser DevTools Console
- Check for Socket.io connection logs
- Look for "Socket connected" message

### 4. Test with Postman
- Import backend Postman collection
- Get JWT token from login endpoint
- Use token in Authorization header for protected endpoints

---

## Troubleshooting

### API Calls Failing
**Solution:** Ensure backend is running on `http://localhost:5000`
```bash
# In backend folder
npm run dev
```

### Socket.io Not Connecting
**Solution:** Check CORS settings in backend app.js:
```javascript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
  },
});
```

### Token Not Saving
**Solution:** Check localStorage is enabled
```javascript
// In browser console
localStorage.getItem('token')
```

### CORS Errors
**Solution:** Backend CORS is configured. If still failing, update:
```javascript
app.use(cors());
```

---

## Next Steps

1. ✅ Create Login/Register pages with auth forms
2. ✅ Create Dashboard page to display user data
3. ✅ Integrate payment processing page
4. ✅ Create admin analytics page
5. ✅ Add file upload component
6. ✅ Implement meeting scheduling
7. ✅ Create team management features

---

## File Structure
```
src/
├── services/
│   └── api.js              # All API endpoints
├── context/
│   ├── AuthContext.jsx     # Authentication context
│   └── SocketContext.jsx   # Real-time context
├── hooks/
│   └── useCustomHooks.js   # Custom hooks
├── Components/
│   └── Form/
│       ├── ContactForm.jsx     # Integrated ✅
│       └── NewsletterForm.jsx  # Integrated ✅
└── App.jsx                 # Updated with providers ✅
```

---

## Support
For issues or questions, check the backend API documentation or create GitHub issues.
