// src/services/enseignantService.ts
import axios from 'axios';
import { Teacher } from '../types/index';

const API_URL = 'http://localhost:8081/api/enseignants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

const enseignantService = {
  getAllEnseignants: async (): Promise<Teacher[]> => {
    return api.get('');
  },

  getEnseignantById: async (id: string): Promise<Teacher> => {
    return api.get(`/${id}`);
  },

  addEnseignant: async (enseignant: Omit<Teacher, 'id'>): Promise<Teacher> => {
    return api.post('', enseignant);
  },

  updateEnseignant: async (id: string, enseignant: Partial<Teacher>): Promise<Teacher> => {
    return api.put(`/${id}`, enseignant);
  },

  deleteEnseignant: async (id: string): Promise<void> => {
    return api.delete(`/${id}`);
  },

  
};

export default enseignantService;