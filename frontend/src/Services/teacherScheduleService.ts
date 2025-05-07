// teacherScheduleService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/schedule';

interface ScheduleItem {
  datetime: string;
  room: string;
  subjects: string[];
  co_teacher?: string;
}

export const getTeacherSchedule = async (teacherId: string): Promise<ScheduleItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/${teacherId}`);
    return response.data.schedule || [];
  } catch (error) {
    console.error('Error fetching teacher schedule:', error);
    throw error;
  }
};