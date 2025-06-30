// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

/* ───────────────────────────── 1. ROUTE PROTÉGÉE ───────────────────────────── */
interface ProtectedRouteProps {
  children?: React.ReactNode;              // tu peux passer des children OU utiliser <Outlet/>
  requiredRoles?: User['role'][];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  // non connecté → on le renvoie vers /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // connecté mais rôle interdit
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children ?? <Outlet />}</>;
};

/* ──────────────── 2. ROUTE INVERSÉE : GUEST-ONLY / PUBLIC ──────────────── */
/**
 * Pour les pages accessibles UNIQUEMENT si l’utilisateur n’est PAS connecté
 * (login, register, forgot-password, etc.)
 */
export const GuestRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
      </div>
    );
  }

  // déjà connecté → redirection ailleurs
  return user ? <Navigate to="/" replace /> : <Outlet />;
};
