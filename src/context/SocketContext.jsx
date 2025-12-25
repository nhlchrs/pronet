import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const socketURL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    const newSocket = io(socketURL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
      if (user?.id) {
        newSocket.emit('user_online', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Notification events
    newSocket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    newSocket.on('notification_subscribed', (data) => {
      console.log('Notifications subscribed:', data);
    });

    // User status events
    newSocket.on('user_status_changed', (data) => {
      console.log('User status changed:', data);
    });

    // Team events
    newSocket.on('team_updated', (data) => {
      console.log('Team updated:', data);
    });

    // Meeting events
    newSocket.on('meeting_started', (data) => {
      console.log('Meeting started:', data);
    });

    newSocket.on('meeting_ended', (data) => {
      console.log('Meeting ended:', data);
    });

    // Analytics events
    newSocket.on('analytics_updated', (data) => {
      console.log('Analytics updated:', data);
    });

    // Payout events
    newSocket.on('payout_status', (data) => {
      console.log('Payout status:', data);
    });

    setSocket(newSocket);

    return () => {
      if (user?.id) {
        newSocket.emit('user_offline', user.id);
      }
      newSocket.close();
    };
  }, [token, user?.id]);

  // Subscribe to notifications
  const subscribeNotifications = () => {
    if (socket && user?.id) {
      socket.emit('subscribe_notifications', user.id);
    }
  };

  // Unsubscribe from notifications
  const unsubscribeNotifications = () => {
    if (socket && user?.id) {
      socket.emit('unsubscribe_notifications', user.id);
    }
  };

  // Subscribe to team updates
  const subscribeTeam = (teamId) => {
    if (socket) {
      socket.emit('subscribe_team', teamId);
    }
  };

  // Unsubscribe from team
  const unsubscribeTeam = (teamId) => {
    if (socket) {
      socket.emit('unsubscribe_team', teamId);
    }
  };

  // Subscribe to analytics
  const subscribeAnalytics = () => {
    if (socket) {
      socket.emit('subscribe_analytics');
    }
  };

  // Subscribe to payout updates
  const subscribePayoutUpdates = (userId) => {
    if (socket) {
      socket.emit('subscribe_payout_updates', userId);
    }
  };

  // Subscribe to meeting
  const subscribeMeeting = (meetingId) => {
    if (socket) {
      socket.emit('subscribe_meeting', meetingId);
    }
  };

  // Clear notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
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
    clearNotifications,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

// Hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
