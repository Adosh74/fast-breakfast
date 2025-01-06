import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data to verify authentication
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/api/users/currentUser');
        setUser(response.data.currentUser);
      } catch (err) {
        console.error('Error fetching user:', err);
        navigate('/signin'); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner
  }

  const handleSignOut = async () => {
    try {
      await axiosInstance.post('/api/users/signout');
      navigate('/signin'); // Redirect to login after signout
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-600 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-6">You are now logged in and can access this page.</p>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}