import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType, AuthState, User } from '../types';

// Default auth state
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuthState);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000; // Convert to seconds
        const tokenExpiresIn = decodedToken.exp - currentTime;
        
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          return;
        }
        
        // Set up token refresh if token expires in less than 1 hour
        if (tokenExpiresIn < 3600) {
          // TODO: Implement token refresh logic here
          console.log('Token will expire soon, refresh needed');
        }
        
        const user: User = {
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.sub,
          role: decodedToken.role,
        };
        
        setAuth({
          isAuthenticated: true,
          user,
          token,
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Login function - store token in localStorage and update auth state
  const login = (token: string) => {
    localStorage.setItem('token', token);
    
    try {
      const decodedToken: any = jwtDecode(token);
      
      const user: User = {
        id: decodedToken.id,
        name: decodedToken.name,
        email: decodedToken.sub,
        role: decodedToken.role,
      };
      
      setAuth({
        isAuthenticated: true,
        user,
        token,
      });
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  // Logout function - remove token from localStorage and reset auth state
  const logout = () => {
    localStorage.removeItem('token');
    setAuth(defaultAuthState);
  };

  // Check if user is admin
  const isAdmin = () => {
    return auth.user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};