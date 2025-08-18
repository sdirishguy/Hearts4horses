'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, LoginData, RegisterData, authAPI, tokenUtils, userUtils } from '@/lib/auth';

interface UserRole {
  id: number;
  key: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  userType: string | null; // Keep for backward compatibility
  userRoles: UserRole[]; // New: array of user roles
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (roleKey: string) => boolean; // Helper function to check roles
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && userRoles.length > 0;

  const hasRole = (roleKey: string): boolean => {
    return userRoles.some(role => role.key === roleKey);
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = tokenUtils.getToken();
        const storedUser = userUtils.getUser();
        const storedUserType = userUtils.getUserType();
        const storedUserRoles = userUtils.getUserRoles();

        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          setUserType(response.userType);
          setUserRoles(response.roles || []);
        } else {
          // Clear any invalid stored data
          tokenUtils.removeToken();
          userUtils.removeUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        tokenUtils.removeToken();
        userUtils.removeUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      const response: AuthResponse = await authAPI.login(data);
      
      console.log('AuthContext: Login response:', response);
      console.log('AuthContext: userType from response:', response.userType);
      
      // Store token and user data
      tokenUtils.setToken(response.token);
      userUtils.setUser(response.user, response.userType, response.roles);
      
      // Update state
      setUser(response.user);
      setUserType(response.userType);
      setUserRoles(response.roles || []);
      
      console.log('AuthContext: State updated - userType:', response.userType, 'roles:', response.roles);
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('AuthContext: Starting registration...');
      setIsLoading(true);
      const response: AuthResponse = await authAPI.register(data);
      
      console.log('AuthContext: Registration response:', response);
      console.log('AuthContext: userType from response:', response.userType);
      console.log('AuthContext: roles from response:', response.roles);
      
      // Store token and user data
      tokenUtils.setToken(response.token);
      userUtils.setUser(response.user, response.userType, response.roles);
      
      // Update state
      setUser(response.user);
      setUserType(response.userType);
      setUserRoles(response.roles || []);
      
      console.log('AuthContext: State updated - userType:', response.userType, 'roles:', response.roles);
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear stored data
    tokenUtils.removeToken();
    userUtils.removeUser();
    
    // Update state
    setUser(null);
    setUserType(null);
    setUserRoles([]);
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
      setUserType(response.userType);
      setUserRoles(response.roles || []);
      userUtils.setUser(response.user, response.userType, response.roles);
    } catch (error) {
      console.error('Refresh user error:', error);
      // If refresh fails, logout
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    userRoles,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
