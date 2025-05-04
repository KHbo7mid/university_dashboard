import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'TEACHER';
  name: string;
  firstLogin: boolean;
  department?: string;
  grade?: string;
  heures_cours?: number;
  heures_td?: number;
  heures_tp?: number;
  heuresSurveillance?: number;
  coeff?: number;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
     
      const userData = {
        ...data.user,
        role: data.role,
       
        firstLogin: data.firstLogin
      };
      console.log(userData);
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate(userData.role === 'ADMIN' ? '/admin' : '/teacher');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear both state and storage
    setUser(null);
    localStorage.removeItem('user');
    
    // Optional: Call backend logout if needed
    fetch('http://localhost:8081/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(error => {
      console.error('Logout API error:', error);
    });
    
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}