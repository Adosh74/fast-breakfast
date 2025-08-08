import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import AdminOrders from './pages/AdminOrders';
import Receipts from './pages/Receipts';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './pages/Users';
import Statistics from './pages/Statistics';
import Header from './components/Header';
import ManageItems from './pages/ManageItems';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<><Header /><Home /></>} />
          <Route path="/admin/orders" element={<><Header /><AdminOrders /></>} />
          <Route path="/admin/receipts" element={<><Header /><Receipts /></>} />
          <Route path="/admin/users" element={<><Header /><Users /></>} />
          <Route path="/statistics" element={<><Header /><Statistics /></>} />
          <Route path="/manage-items" element={<><Header /><ManageItems /></>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}