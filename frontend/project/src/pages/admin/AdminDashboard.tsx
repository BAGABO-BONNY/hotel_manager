import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { ShieldCheck, Users, Building, BedDouble, BookOpenCheck, BarChart3, Settings } from 'lucide-react';
import { adminService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface AdminCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  description?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, value, icon, bgColor = 'bg-primary-600', textColor = 'text-white', description }) => {
  return (
    <div className={`shadow-lg rounded-xl p-6 ${bgColor} ${textColor} transform hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider opacity-90">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-black bg-opacity-20 rounded-full">
          {icon}
        </div>
      </div>
      {description && <p className="mt-3 text-xs opacity-90">{description}</p>}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { auth, isAdmin } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error('Please log in to access this page.');
      navigate('/login');
    } else if (!isAdmin()) {
      toast.error('You do not have permission to access the admin dashboard.');
      navigate('/');
    }
  }, [auth, isAdmin, navigate]);

    const [stats, setStats] = useState<AdminCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        const data = response.data;
        
        setStats([
          { 
            title: 'Total Users', 
            value: data.totalUsers, 
            icon: <Users size={28} />, 
            bgColor: 'bg-blue-500',
            description: 'Total registered users'
          },
          { 
            title: 'Total Bookings', 
            value: data.totalBookings, 
            icon: <BookOpenCheck size={28} />, 
            bgColor: 'bg-green-500',
            description: 'All bookings made'
          },
          { 
            title: 'Listed Hotels', 
            value: data.totalHotels, 
            icon: <Building size={28} />, 
            bgColor: 'bg-purple-500',
            description: 'Active hotels'
          },
          { 
            title: 'Available Rooms', 
            value: data.totalRooms, 
            icon: <BedDouble size={28} />, 
            bgColor: 'bg-orange-500',
            description: 'Total rooms'
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const quickActions = [
    { label: 'Manage Users', icon: <Users size={24}/>, path: '/admin/users' },
    { label: 'Manage Bookings', icon: <BookOpenCheck size={24}/>, path: '/admin/bookings' },
    { label: 'Manage Hotels', icon: <Building size={24}/>, path: '/admin/hotels' },
    { label: 'View Reports', icon: <BarChart3 size={24}/>, path: '/admin/reports' },
    { label: 'System Settings', icon: <Settings size={24}/>, path: '/admin/settings' },
  ];
  
  if (!auth.isAuthenticated || !isAdmin()) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center">
            <ShieldCheck size={40} className="mr-3 text-primary-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Welcome, {auth.user?.name || 'Admin'}! Oversee and manage operations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            <div className="col-span-4 flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            stats.map((stat, index) => (
              <AdminCard key={index} {...stat} />
            ))
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <button 
                  key={index} 
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center justify-center p-4 bg-gray-100 hover:bg-primary-100 rounded-lg shadow-md hover:shadow-lg transition-all text-primary-700 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {action.icon}
                  <span className="mt-2 text-sm font-medium text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Recent Activity</h2>
            <ul className="space-y-3">
              <li className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">New user registered: <span className='font-medium'>john.doe@example.com</span></li>
              <li className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">Booking #12345 confirmed for <span className='font-medium'>Grand Hotel</span>.</li>
              <li className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">Hotel <span className='font-medium'>'Seaside Resort'</span> added.</li>
              <li className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition">System settings updated by <span className='font-medium'>admin_user</span>.</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;