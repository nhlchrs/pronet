// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to handle API calls
export const apiCall = async (endpoint, method = 'GET', data = null, headers = {}) => {
  const token = localStorage.getItem('token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers: defaultHeaders,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'API Error');
    }

    return responseData;
  } catch (error) {
    throw error;
  }
};

// ===== AUTH ENDPOINTS =====
export const authAPI = {
  register: async (userData) => {
    return apiCall('/register', 'POST', userData);
  },

  login: async (email, password) => {
    return apiCall('/login', 'POST', { email, password });
  },

  verifyOTP: async (email, otp) => {
    return apiCall('/verify', 'POST', { email, otp });
  },

  resendOTP: async (email) => {
    return apiCall('/resendOtp', 'POST', { email });
  },

  getAllUsers: async () => {
    return apiCall('/allusers', 'GET');
  },

  getUserById: async (userId) => {
    return apiCall('/getUserbyId', 'POST', { userId });
  },

  getUserMetrics: async () => {
    return apiCall('/getUserPlatformMetrics', 'GET');
  },

  getDashboardVisualizations: async () => {
    return apiCall('/getDashboardVisualizations', 'GET');
  },

  agreeToTerms: async () => {
    return apiCall('/user/agree-to-terms', 'POST');
  },

  checkTermsAgreement: async () => {
    return apiCall('/user/check-terms-agreement', 'GET');
  },
};

// ===== SESSION ENDPOINTS =====
export const sessionAPI = {
  createSession: async (sessionData) => {
    return apiCall('/session/create', 'POST', sessionData);
  },

  getSession: async (sessionId) => {
    return apiCall(`/session/${sessionId}`, 'GET');
  },

  updateSession: async (sessionId, data) => {
    return apiCall(`/session/${sessionId}`, 'PUT', data);
  },

  deleteSession: async (sessionId) => {
    return apiCall(`/session/${sessionId}`, 'DELETE');
  },
};

// ===== USER ENDPOINTS =====
export const userAPI = {
  getProfile: async () => {
    return apiCall('/user/profile', 'GET');
  },

  updateProfile: async (userData) => {
    return apiCall('/user/update-profile', 'PUT', userData);
  },

  changePassword: async (passwordData) => {
    return apiCall('/user/change-password', 'POST', passwordData);
  },
};

// ===== MEETING ENDPOINTS =====
export const meetingAPI = {
  // Admin endpoints (for creating, updating, deleting)
  createMeeting: async (meetingData) => {
    return apiCall('/admin/meeting/create', 'POST', meetingData);
  },

  // USER ENDPOINTS (NO ADMIN REQUIRED)
  // Get available meetings for the user
  getUserAvailableMeetings: async () => {
    return apiCall('/user/available-meetings', 'GET');
  },

  // Get upcoming meetings
  getUpcomingMeetings: async () => {
    return apiCall('/meeting/upcoming', 'GET');
  },

  // Get specific meeting details
  getMeeting: async (meetingId) => {
    return apiCall(`/meeting/${meetingId}`, 'GET');
  },

  // Join a meeting
  joinMeeting: async (meetingId) => {
    return apiCall(`/meeting/${meetingId}/join`, 'GET');
  },

  // ADMIN ONLY
  getAllMeetings: async () => {
    return apiCall('/admin/meetings', 'GET');
  },

  updateMeeting: async (meetingId, data) => {
    return apiCall(`/admin/meeting/${meetingId}`, 'PUT', data);
  },

  deleteMeeting: async (meetingId) => {
    return apiCall(`/admin/meeting/${meetingId}`, 'DELETE');
  },
};

// ===== ANNOUNCEMENT ENDPOINTS =====
export const announcementAPI = {
  createAnnouncement: async (announcementData) => {
    return apiCall('/announcements', 'POST', announcementData);
  },

  getAnnouncements: async () => {
    return apiCall('/announcements', 'GET');
  },

  getAnnouncement: async (announcementId) => {
    return apiCall(`/announcements/${announcementId}`, 'GET');
  },

  updateAnnouncement: async (announcementId, data) => {
    return apiCall(`/announcements/${announcementId}`, 'PUT', data);
  },

  deleteAnnouncement: async (announcementId) => {
    return apiCall(`/announcements/${announcementId}`, 'DELETE');
  },
};

// ===== FILE ENDPOINTS =====
export const fileAPI = {
  uploadFile: async (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method: 'POST',
      headers,
      body: formData,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/upload/file`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  deleteFile: async (fileId) => {
    return apiCall(`/upload/delete/${fileId}`, 'DELETE');
  },

  getFiles: async () => {
    return apiCall('/upload/list', 'GET');
  },
};

// ===== PAYMENT ENDPOINTS =====
export const paymentAPI = {
  initiatePayment: async (paymentData) => {
    return apiCall('/payments/initiate', 'POST', paymentData);
  },

  getPaymentHistory: async () => {
    return apiCall('/payments/history', 'GET');
  },

  verifyPayment: async (paymentId) => {
    return apiCall(`/payments/verify/${paymentId}`, 'POST');
  },

  getPaymentStatus: async (paymentId) => {
    return apiCall(`/payments/status/${paymentId}`, 'GET');
  },
};

// ===== TEAM ENDPOINTS =====
export const teamAPI = {
  // Team management endpoints
  getTeams: async () => {
    return apiCall('/team/list', 'GET');
  },

  createTeam: async (teamData) => {
    return apiCall('/team/create', 'POST', teamData);
  },

  getTeam: async (teamId) => {
    return apiCall(`/team/${teamId}`, 'GET');
  },

  updateTeam: async (teamId, data) => {
    return apiCall(`/team/${teamId}`, 'PUT', data);
  },

  deleteTeam: async (teamId) => {
    return apiCall(`/team/${teamId}`, 'DELETE');
  },

  addTeamMember: async (teamId, memberData) => {
    return apiCall(`/team/${teamId}/add-member`, 'POST', memberData);
  },

  removeTeamMember: async (teamId, memberId) => {
    return apiCall(`/team/${teamId}/remove-member/${memberId}`, 'DELETE');
  },

  // Referral system endpoints
  initializeMembership: async () => {
    return apiCall('/team/init-membership', 'POST');
  },

  checkMemberStatus: async () => {
    return apiCall('/team/check-status', 'GET');
  },

  getMyReferralCode: async () => {
    return apiCall('/team/my-referral-code', 'GET');
  },

  validateReferralCode: async (code) => {
    return apiCall('/team/validate-referral-code', 'POST', { code });
  },

  applyReferralCode: async (code) => {
    return apiCall('/team/apply-referral-code', 'POST', { code });
  },

  getDownlineStructure: async () => {
    return apiCall('/team/downline-structure/me', 'GET');
  },

  // Get user's own downline (user as root, no ancestors)
  getUserDownline: async () => {
    return apiCall('/team/my-downline', 'GET');
  },
};

// ===== ANALYTICS ENDPOINTS =====
export const analyticsAPI = {
  getPlatformMetrics: async () => {
    return apiCall('/admin/analytics/metrics', 'GET');
  },

  getUserAnalytics: async (userId) => {
    return apiCall(`/admin/analytics/user/${userId}`, 'GET');
  },

  getRevenueAnalytics: async () => {
    return apiCall('/admin/analytics/revenue', 'GET');
  },

  getTeamAnalytics: async (teamId) => {
    return apiCall(`/admin/analytics/team/${teamId}`, 'GET');
  },
};

// ===== CONTACT/NEWSLETTER ENDPOINTS =====
export const contactAPI = {
  submitContactForm: async (contactData) => {
    return apiCall('/contact/submit', 'POST', contactData);
  },

  subscribeNewsletter: async (email) => {
    return apiCall('/newsletter/subscribe', 'POST', { email });
  },

  unsubscribeNewsletter: async (email) => {
    return apiCall('/newsletter/unsubscribe', 'POST', { email });
  },
};

// ===== HEALTH CHECK =====
export const healthCheck = async () => {
  return apiCall('/health', 'GET');
};
