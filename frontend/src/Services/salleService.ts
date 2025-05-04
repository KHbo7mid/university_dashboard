import axios from "axios";
import { Room } from "../types/index";
const API_URL = "http://localhost:8081/api/admin/salles";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  
  if (user && user.email && user.password) {
    return {
      Authorization: `Basic ${btoa(`${user.email}:${user.password}`)}`,
      'Content-Type': 'application/json'
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

  const salleService = {
    getAllSalles: async (): Promise<Room[]> => {
        return api.get('');
        },
    getSalleById: async (id: string): Promise<Room> => {
        return api.get(`/${id}`);
    },
    addSalle: async (salle: Omit<Room, 'id'>): Promise<Room> => {
        return api.post('', salle);
    },
    updateSalle: async (id: string, salle: Partial<Room>): Promise<Room> => {
        return api.put(`/${id}`, salle);
    },
    deleteSalle: async (id: string): Promise<void> => {
        return api.delete(`/${id}`);
    },
};
export default salleService;