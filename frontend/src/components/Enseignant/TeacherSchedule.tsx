import { useState, useEffect, useContext } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { getTeacherSchedule } from '../../Services/teacherScheduleService';
import { AuthContext } from '../../contexts/AuthContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import SchedulePDF from './ShedulePdf';
interface ScheduleItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  subjects: string[];
  coTeacher?: string;
  status: string;
}

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
       
        
        const data = await getTeacherSchedule(user.name);
        
        // Transform the API data to match our frontend interface
        const transformedSchedule = data.map((item, index) => ({
          id: `item-${index}`,
          date: item.datetime.split(' ')[0],
          startTime: item.datetime.split(' ')[1],
          endTime: calculateEndTime(item.datetime.split(' ')[1]), // Helper function
          room: item.room,
          subjects: item.subjects,
          coTeacher: item.co_teacher,
          status: 'confirmed' 
        }));
        
        setSchedule(transformedSchedule);
       
      } catch (err) {
        setError('Failed to load schedule');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const calculateEndTime = (startTime: string): string => {
   
    const [hours, minutes] = startTime.split(':').map(Number);
    

    let totalMinutes = hours * 60 + minutes + 90; 
    
   
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'conflict': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
        <div className="text-red-500 flex items-center">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
      
      <h3 className="font-medium text-lg mb-3 dark:text-white">
        Mon emploi du Surveillance
      </h3>

      {schedule.length > 0 && (
        <PDFDownloadLink 
          document={<SchedulePDF schedule={schedule} teacherName={user.name} />}
          fileName={`emploi_du_temps_${user.name}.pdf`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          {({ loading }) => (
            loading ? 'Génération du PDF...' : 'Télécharger PDF'
          )}
        </PDFDownloadLink>
      )}
   
      
      <div className="space-y-3 mt-3">
        {schedule.length > 0 ? (
          schedule.map(item => (
            <div key={item.id} className="border rounded-lg p-3 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium dark:text-white">
                    {item.subjects.join(' / ')}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{item.startTime} - {item.endTime}</span>
                    <MapPin className="w-4 h-4 ml-3 mr-1" />
                    <span>Salle {item.room}</span>
                  </div>
                  {item.coTeacher && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Avec: {item.coTeacher}
                    </div>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                  {item.status === 'confirmed' ? 'Confirmé' : 
                   item.status === 'pending' ? 'En attente' : 'Conflit'}
                </span>
              </div>
              
              {item.status === 'conflict' && (
                <div className="flex items-center text-sm text-red-600 dark:text-red-400 mt-2">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>Vous avez signalé un conflit pour ce créneau</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">Aucun cours programmé</p>
        )}
      </div>
    </div>
  );
}