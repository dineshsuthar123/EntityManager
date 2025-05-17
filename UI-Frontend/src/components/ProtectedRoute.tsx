import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import AuthService from '../services/auth.service';

interface ProtectedRouteProps {
    requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
    const location = useLocation();
    const isLoggedIn = AuthService.isLoggedIn();

    // Only check roles if the user is logged in and roles are required
    const hasRequiredRole = isLoggedIn && requiredRoles ?
        requiredRoles.some(role => AuthService.hasRole(role)) :
        true;

    if (!isLoggedIn) {
        // Redirect to login page but save the location they were trying to access
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRoles && !hasRequiredRole) {
        // User doesn't have the required role
        return <Navigate to="/unauthorized" replace />;
    }

    // User is logged in and has the required role (or no specific role is required)
    return <Outlet />;
};

export default ProtectedRoute;
