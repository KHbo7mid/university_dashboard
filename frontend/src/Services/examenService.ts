import axios from "axios";
import { Examen } from "../types/index";
const API_URL = "http://localhost:8081/api/admin/examens";
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
  // Add response interceptor to handle errors
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
  
  const examenService = {
    getAllExamens: async (): Promise<Examen[]> => {
      return api.get("");
    } ,
    getExamenById: async (id: string): Promise<Examen> => {
      return api.get(`/${id}`);
    },
    addExamen: async (examen: Omit<Examen, "id">): Promise<Examen> => {
      return api.post("", examen);
    },
    updateExamen: async (id: string, examen: Partial<Examen>): Promise<Examen> => {
      return api.put(`/${id}`, examen);
    },
    deleteExamen: async (id: string): Promise<void> => {
      return api.delete(`/${id}`);
    },
    deleteAllExamens: async (): Promise<void> => {
      return api.delete("/all");
    }
  };
  export default examenService;
  