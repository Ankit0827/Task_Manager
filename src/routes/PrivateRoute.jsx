import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }

  // User is authenticated and has correct role
  return <Outlet />;
};

export default PrivateRoute;
