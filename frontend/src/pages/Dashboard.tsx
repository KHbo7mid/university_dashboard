import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  
  Calendar as CalendarIcon,
  AlertCircle,
  
 
  Users,
  Building 
} from 'lucide-react';



const stats = [
  { name: 'Examens planifiés', value: '42', icon: CalendarIcon },
  
  { name: 'Salles libres', value: '12', icon: Building },
  { name: 'Professeurs disponibles', value: '8', icon: Users },
   {name:'Professeurs indisponibles', value:'5', icon:Users},
  { name: 'Professeurs en attente', value: '2', icon: Users },
  { name: 'Conflits en attente', value: '3', icon: AlertCircle },
  
];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Calendar Widget */}
        <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <h2 className="text-lg text-center font-medium text-gray-900 dark:text-white">
            Calendrier 
          </h2>
          <div className="mt-4 flex justify-center">
            <Calendar
              onChange={(value) => value && setSelectedDate(value as Date)}
              value={selectedDate}
              locale="fr-FR"
              className="rounded-lg border-none dark:bg-gray-700 dark:text-white"
            />
           
          </div>
        </div>

       
      </div>
    </div>
  );
}
