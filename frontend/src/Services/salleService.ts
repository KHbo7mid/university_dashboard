import axios from "axios";
import { Room } from "../types/index";
const API_URL = "http://localhost:8081/api/salles";

const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
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