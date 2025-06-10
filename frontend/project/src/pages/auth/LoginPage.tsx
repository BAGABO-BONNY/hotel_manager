import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import Layout from '../../components/layout/Layout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { Hotel } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [loginIntent, setLoginIntent] = useState<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Clear previous API errors
    setFieldErrors({}); // Clear previous field errors

    if (!validate()) return; // Validation will set fieldErrors
    
    setIsLoading(true);
    
    try {
      const responseData = await authService.login(email, password);
      login(responseData.token); // AuthContext handles token decoding and role setting
      toast.success('Successfully logged in!');

      // Navigation based on role from response (also available in AuthContext after login)
      if (responseData.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (responseData.role === 'CUSTOMER') {
        navigate('/bookings');
      } else {
        navigate('/');
      }

    } catch (err: any) {
      console.error('Login failed:', err);
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setApiError(message); // Display API error to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center space-x-2 pt-4">
                <Button
                  onClick={() => setLoginIntent('CUSTOMER')}
                  variant={loginIntent === 'CUSTOMER' ? 'primary' : 'outline'}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${loginIntent === 'CUSTOMER' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Customer Login
                </Button>
                <Button
                  onClick={() => setLoginIntent('ADMIN')}
                  variant={loginIntent === 'ADMIN' ? 'primary' : 'outline'}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${loginIntent === 'ADMIN' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Admin Login
                </Button>
              </div>
              <div className="flex justify-center mb-4">
                <Hotel size={40} className="text-primary-600" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">{loginIntent === 'ADMIN' ? 'Admin Portal Login' : 'Customer Account Login'}</h1>
              <p className="text-gray-600 mt-2">Log in to your {loginIntent === 'ADMIN' ? 'administrator' : 'customer'} account</p>
            </div>
            
            {apiError && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-300 text-red-700 text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                error={fieldErrors.email}
                required
              />
              
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={fieldErrors.password}
                required
              />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Log In
              </Button>
            </form>
            
            {loginIntent === 'CUSTOMER' && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;