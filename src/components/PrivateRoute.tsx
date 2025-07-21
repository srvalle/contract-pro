import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default PrivateRoute;
