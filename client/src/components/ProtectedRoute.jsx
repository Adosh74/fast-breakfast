import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/users/currentuser');
        if (response.data.currentUser) {
          setIsAuthenticated(true);
          setUserRole(response.data.currentUser.role);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/signin" />;

  // Add admin route protection
  if (window.location.pathname.startsWith('/admin') && userRole !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}