import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  // TEMPORARILY COMMENTED OUT - Subscription checking disabled
  // const [checkingSubscription, setCheckingSubscription] = useState(true);
  // const [hasSubscription, setHasSubscription] = useState(false);

  // // Paths that don't require subscription check (user can access to subscribe)
  // const publicPaths = ['/payment'];
  // const isPublicPath = publicPaths.includes(location.pathname);

  // useEffect(() => {
  //   if (user && !loading) {
  //     // Check multiple possible subscription fields
  //     const isSubscribed = user.membershipStatus === 'active' || 
  //                         user.subscriptionStatus === 'active' ||
  //                         user.hasMembership === true ||
  //                         (user.subscription && user.subscription.isActive);
  //     
  //     setHasSubscription(isSubscribed);
  //     setCheckingSubscription(false);
  //   } else if (!loading) {
  //     setCheckingSubscription(false);
  //   }
  // }, [user, loading]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TEMPORARILY COMMENTED OUT - Subscription enforcement disabled
  // // If user is authenticated but doesn't have subscription and trying to access protected page
  // if (!hasSubscription && !isPublicPath) {
  //   return <Navigate 
  //     to="/payment" 
  //     replace 
  //     state={{ 
  //       message: "Please subscribe to a plan to access this feature",
  //       fromProtectedRoute: true,
  //       attemptedPath: location.pathname 
  //     }} 
  //   />;
  // }

  return children;
}



