import { useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

interface ScheduleItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  subject: string;
  status: 'confirmed' | 'pending' | 'conflict';
}

export default function TeacherSchedule() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: '1',
      date: '2023-05-15',
      startTime: '09:00',
      endTime: '12:00',
      room: 'A101',
      subject: 'Mathématiques',
      status: 'confirmed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'conflict': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
      <h3 className="font-medium text-lg mb-3 dark:text-white">
        Mon emploi du temps
      </h3>
      
      <div className="space-y-3">
        {schedule.length > 0 ? (
          schedule.map(item => (
            <div key={item.id} className="border rounded-lg p-3 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium dark:text-white">{item.subject}</h4>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(item.date).toLocaleDateString('fr-FR')}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{item.startTime} - {item.endTime}</span>
                    <MapPin className="w-4 h-4 ml-3 mr-1" />
                    <span>Salle {item.room}</span>
                  </div>
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
          <p className="text-gray-500 text-center py-4">Aucun emploi du temps disponible</p>
        )}
      </div>
    </div>
  );
}