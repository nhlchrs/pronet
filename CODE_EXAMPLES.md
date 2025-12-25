// ============================================
// QUICK CODE EXAMPLES - Frontend API Integration
// ============================================

// ============================================
// 1. AUTHENTICATION EXAMPLES
// ============================================

// Example 1: User Registration
import { useAuth } from './context/AuthContext';

function RegisterPage() {
  const { register, error, loading } = useAuth();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register(
        'John',           // firstName
        'Doe',            // lastName
        'john@example.com',
        '+91-1234567890', // phone
        'password123'
      );
      console.log('Registration successful:', response);
      // Redirect to OTP verification page
    } catch (err) {
      console.error('Registration failed:', err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="text" placeholder="First Name" required />
      <input type="text" placeholder="Last Name" required />
      <input type="email" placeholder="Email" required />
      <input type="tel" placeholder="Phone" required />
      <input type="password" placeholder="Password" required />
      {error && <p className="error">{error}</p>}
      <button disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
    </form>
  );
}

// Example 2: OTP Verification
function VerifyOTPPage() {
  const { verifyOTP, resendOTP, loading } = useAuth();
  const [otp, setOtp] = useState('');
  
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP('john@example.com', otp);
      console.log('OTP verified successfully');
      // Redirect to dashboard
    } catch (err) {
      console.error('OTP verification failed:', err.message);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP('john@example.com');
      alert('OTP resent successfully');
    } catch (err) {
      console.error('Resend OTP failed:', err.message);
    }
  };

  return (
    <form onSubmit={handleVerifyOTP}>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        maxLength="6"
        required
      />
      <button disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
      <button type="button" onClick={handleResendOTP}>Resend OTP</button>
    </form>
  );
}

// Example 3: User Login
function LoginPage() {
  const { login, isAuthenticated, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="error">{error}</p>}
      <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}

// ============================================
// 2. REAL-TIME UPDATES EXAMPLES
// ============================================

// Example 4: Real-time Notifications
import { useSocket } from './context/SocketContext';

function NotificationCenter() {
  const { 
    isConnected, 
    notifications, 
    subscribeNotifications,
    clearNotifications
  } = useSocket();

  useEffect(() => {
    if (isConnected) {
      subscribeNotifications();
    }
  }, [isConnected]);

  return (
    <div className="notification-center">
      <h3>Notifications ({notifications.length})</h3>
      {!isConnected && <p className="warning">Not connected to server</p>}
      <ul>
        {notifications.map((notif) => (
          <li key={notif.id}>
            <p>{notif.message}</p>
            <small>{new Date(notif.timestamp).toLocaleTimeString()}</small>
          </li>
        ))}
      </ul>
      {notifications.length > 0 && (
        <button onClick={clearNotifications}>Clear All</button>
      )}
    </div>
  );
}

// Example 5: Team Subscription
function TeamDashboard({ teamId }) {
  const { subscribeTeam, unsubscribeTeam, socket } = useSocket();

  useEffect(() => {
    subscribeTeam(teamId);

    // Listen for team updates
    socket?.on('team_updated', (teamData) => {
      console.log('Team updated:', teamData);
      // Update UI with new team data
    });

    return () => {
      unsubscribeTeam(teamId);
    };
  }, [teamId]);

  return <div>Team Dashboard</div>;
}

// ============================================
// 3. API CALL EXAMPLES
// ============================================

// Example 6: Get User Profile
import { userAPI } from './services/api';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        setProfile(response.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>{profile?.fname} {profile?.lname}</h1>
      <p>Email: {profile?.email}</p>
      <p>Phone: {profile?.phone}</p>
    </div>
  );
}

// Example 7: Schedule Meeting
import { meetingAPI } from './services/api';

function ScheduleMeeting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSchedule = async (meetingData) => {
    setLoading(true);
    try {
      const response = await meetingAPI.scheduleMeeting({
        title: 'Team Sync',
        scheduledAt: '2025-12-25T10:00:00Z',
        duration: 60,
        participants: ['user1@example.com', 'user2@example.com']
      });
      alert('Meeting scheduled successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={() => handleSchedule({})} 
      disabled={loading}
    >
      {loading ? 'Scheduling...' : 'Schedule Meeting'}
    </button>
  );
}

// Example 8: Upload File
import { fileAPI } from './services/api';

function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fileAPI.uploadFile(file, 'documents');
      console.log('File uploaded:', response);
      alert('File uploaded successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

// ============================================
// 4. FORM HANDLING EXAMPLES
// ============================================

// Example 9: Custom Form Hook
import { useForm } from './hooks/useCustomHooks';

function ContactFormExample() {
  const { 
    formData, 
    handleChange, 
    handleSubmit, 
    loading, 
    error, 
    success 
  } = useForm(
    { name: '', email: '', message: '' },
    async (data) => {
      await contactAPI.submitContactForm(data);
    }
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
        required
      />
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Message sent successfully!</p>}
      <button disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}

// Example 10: Async Operation Hook
import { useAsync } from './hooks/useCustomHooks';

function UsersList() {
  const { execute, status, data, error } = useAsync(
    async () => await userAPI.getAllUsers()
  );

  return (
    <div>
      <button onClick={execute} disabled={status === 'pending'}>
        Load Users
      </button>
      {status === 'pending' && <p>Loading...</p>}
      {error && <p className="error">{error.message}</p>}
      {data && (
        <ul>
          {data.users?.map(user => (
            <li key={user._id}>{user.fname} {user.lname}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ============================================
// 5. PROTECTED ROUTE EXAMPLE
// ============================================

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return children;
}

// Usage:
// <Routes>
//   <Route path="/dashboard" element={
//     <ProtectedRoute>
//       <Dashboard />
//     </ProtectedRoute>
//   } />
// </Routes>

// ============================================
// 6. PAYMENT PROCESSING EXAMPLE
// ============================================

import { paymentAPI } from './services/api';

function PaymentPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payment = await paymentAPI.initiatePayment({
        amount: parseFloat(amount),
        currency: 'USD',
        description: 'Service payment'
      });

      // Redirect to payment gateway
      window.location.href = payment.paymentLink;
    } catch (err) {
      console.error('Payment failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="0.01"
        required
      />
      <button disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

// ============================================
// 7. PAGINATION EXAMPLE
// ============================================

import { usePagination } from './hooks/useCustomHooks';

function UsersPaginationList({ users }) {
  const { currentPage, totalPages, currentItems, nextPage, prevPage } = 
    usePagination(users, 10);

  return (
    <div>
      <ul>
        {currentItems.map(user => (
          <li key={user._id}>{user.fname}</li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

// ============================================
// END OF EXAMPLES
// ============================================
