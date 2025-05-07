import axios from 'axios';
import { Filiere } from '../types/index';
const API_URL = 'http://localhost:8081/api/admin/filieres';
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  
  
  if (user?.token) {
    return {
      Authorization: `Basic ${user.token}`,
      'Content-Type': 'application/json',
    };
  }

  return { 'Content-Type': 'application/json' };
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeader();
    Object.entries(headers).forEach(([key, value]) => {
      config.headers?.set(key, value as string);
    });
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);
const filiereService = {
    getAllFilieres: async (): Promise<Filiere[]> => {
        return api.get('');
      },
    
      getFiliereById: async (id: string): Promise<Filiere> => {
        return api.get(`/${id}`);
      },
    
      addFiliere: async (filiere: Omit<Filiere, 'id'>): Promise<Filiere> => {
        return api.post('', filiere);
      },
    
      updateFiliere: async (id: string, filiere: Partial<Filiere>): Promise<Filiere> => {
        return api.put(`/${id}`, filiere);
      },
    
      deleteFiliere: async (id: string): Promise<void> => {
        return api.delete(`/${id}`);
      },
};
export default filiereService;  