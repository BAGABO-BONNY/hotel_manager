import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, UserCircle, LogOut, Hotel, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For the main mobile menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // For the user dropdown menu
  const { auth, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false); // Close main mobile menu
    setIsUserMenuOpen(false); // Close user dropdown
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-primary-900 to-primary-800 text-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Hotel className="h-8 w-8 text-accent-400" />
            <span className="text-xl font-serif font-semibold"> Hotel</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-accent-300 transition-colors">
              Home
            </Link>
            <Link to="/hotels" className="hover:text-accent-300 transition-colors">
              Hotels
            </Link>
            
            {auth.isAuthenticated ? (
              <>
                <Link to="/bookings" className="hover:text-accent-300 transition-colors">
                  My Bookings
                </Link>
                
                {isAdmin() && (
                  <Link to="/admin" className="hover:text-accent-300 transition-colors">
                    Admin
                  </Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 hover:text-accent-300 transition-colors"
                  >
                    <span>{auth.user?.name}</span>
                    <UserCircle size={20} />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-50 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded hover:bg-primary-700 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-accent-500 rounded hover:bg-accent-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-800 shadow-inner animate-fade-in">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="p-2 hover:bg-primary-700 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/hotels" 
                className="p-2 hover:bg-primary-700 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Hotels
              </Link>
              
              {auth.isAuthenticated ? (
                <>
                  <Link 
                    to="/bookings" 
                    className="p-2 hover:bg-primary-700 rounded flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Calendar size={18} className="mr-2" />
                    My Bookings
                  </Link>
                  
                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="p-2 hover:bg-primary-700 rounded flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <DollarSign size={18} className="mr-2" />
                      Admin
                    </Link>
                  )}
                  
                  <div className="border-t border-primary-700 pt-2 mt-2">
                    <div className="p-2 text-accent-300 flex items-center">
                      <UserCircle size={18} className="mr-2" />
                      {auth.user?.name}
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left p-2 hover:bg-primary-700 rounded flex items-center"
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="p-2 hover:bg-primary-700 rounded text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="p-2 bg-accent-500 hover:bg-accent-600 rounded text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;