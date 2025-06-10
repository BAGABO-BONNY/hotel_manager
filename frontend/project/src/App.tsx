import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HotelsListPage from './pages/hotel/HotelsListPage';
import HotelDetailPage from './pages/hotel/HotelDetailPage';
import BookingPage from './pages/booking/BookingPage';
import BookingConfirmationPage from './pages/booking/BookingConfirmationPage';
import BookingsListPage from './pages/booking/BookingsListPage';
import AdminDashboard from './pages/admin/AdminDashboard';
// CustomerDashboard import removed as it's no longer used

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode; adminOnly?: boolean }> = ({ 
  element, 
  adminOnly = false 
}) => {
  const { auth, isAdmin } = useAuth();
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }
  
  return <>{element}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/hotels" element={<HotelsListPage />} />
      <Route path="/hotels/:hotelId" element={<HotelDetailPage />} />
      <Route 
        path="/booking/:hotelId/:roomId" 
        element={<ProtectedRoute element={<BookingPage />} />} 
      />
      <Route 
        path="/booking-confirmation" 
        element={<ProtectedRoute element={<BookingConfirmationPage />} />} 
      />
      <Route 
        path="/bookings" 
        element={<ProtectedRoute element={<BookingsListPage />} />} 
      />
      <Route 
        path="/admin/dashboard" // Changed to /admin/dashboard to match LoginPage navigation
        element={<ProtectedRoute element={<AdminDashboard />} adminOnly />}
      />
      {/* CustomerDashboard route removed */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#22c55e',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;