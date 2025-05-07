import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Calendar as CalendarIcon, AlertCircle, Users, Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import examenService from '../Services/examenService';
import { Examen, Teacher } from '../types';
import roomService from '../Services/salleService';
import planningService from '../Services/planningService';
import filiereService from '../Services/filiereService';
import enseignantService from '../Services/enseignantService';
const stats = [
  { name: 'Examens planifiés', value: '42', icon: CalendarIcon, trend: 'up', color: 'blue' },
  { name: 'Salles libres', value: '12', icon: Building, trend: 'stable', color: 'green' },
  { name: 'Professeurs disponibles', value: '8', icon: Users, trend: 'up', color: 'green' },
  { name: 'Professeurs indisponibles', value: '5', icon: Users, trend: 'down', color: 'red' },
  { name: 'Professeurs en attente', value: '2', icon: Users, trend: 'stable', color: 'yellow' },
  { name: 'Conflits en attente', value: '3', icon: AlertCircle, trend: 'down', color: 'red' },
];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
   
  // Color mapping for consistent theming
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-300',
      border: 'border-blue-100 dark:border-blue-800'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-300',
      border: 'border-green-100 dark:border-green-800'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-300',
      border: 'border-red-100 dark:border-red-800'
    },
    yellow: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      text: 'text-amber-600 dark:text-amber-300',
      border: 'border-amber-100 dark:border-amber-800'
    }
  };
const [examens, setExamens] = useState<Examen[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [isPlanning, setIsPlanning] = useState(false);
const navigate = useNavigate();
 interface PlanningData {
  professors: [];
  rooms: [];
  branches: [];
}
const startPlanning=async()=>{
  try{
    setIsLoading(true);
    // Fetch all necessary data for planning
    const [examens, salles, filieres, enseignants] = await Promise.all([
      examenService.getAllExamens(),
      roomService.getAllSalles(),
      filiereService.getAllFilieres(),
      enseignantService.getAllEnseignants()
    ]);
    console.log("examens",examens);
    console.log("salles",salles); 
    console.log("filieres",filieres);
    console.log("enseignants",enseignants);
    const filieresWithExamens = filieres.map(filiere => ({
      name: filiere.nom,
      subjects: examens.filter(examen => examen.filiere.id === filiere.id)
    }));
    const roomsUpdated = salles.map(s => `${s.bloc}-${s.number}`);
    const enseignantsUpdated = enseignants.map(enseignant => ({
      id: enseignant.name,
      hours: enseignant.heuresSurveillance,
      unavailableSlots: enseignant.unavailableSlots,
      subject: examens.find(examen => examen.enseignant_responsable.id === enseignant.id)?.nom,
      branch: examens.find(examen => examen.enseignant_responsable.id === enseignant.id)?.filiere.nom,
      is_responsible: true  
    }));
    const input = {
      professors: enseignantsUpdated,
      rooms: roomsUpdated,
      branches: filieresWithExamens,
      subject_schedule: examens.reduce((acc, examen) => {
        acc[examen.nom] = examen.start_time;
        return acc;
      }, {} as Record<string, string>)
    }

    console.log("input",input);
    
    // Send data to planning endpoint
    await planningService.initData(input);
    setIsPlanning(true);
    navigate('/admin/planning');
  }catch (error) {
    setError('Failed to start planning');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
  }

useEffect(() => {
  fetchExams();
}, []);

const fetchExams = async () => {
  setIsLoading(true);
  setError(null);
  try {
    const data = await examenService.getAllExamens();
  
    setExamens(data); 
  }catch (err) {
    setError('Failed to fetch exams');
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = colorMap[stat.color as keyof typeof colorMap];
          
          return (
            <div 
              key={stat.name} 
              className={`p-4 rounded-xl shadow-sm border ${colors.border} transition-all hover:shadow-md hover:translate-y-[-2px]`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
                {/* Trend indicator would go here */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar and Action Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Widget - Takes 2/3 space */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Calendrier 
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          <div className="mt-2">
            <Calendar
              onChange={(value) => value && setSelectedDate(value as Date)}
              value={selectedDate}
              locale="fr-FR"
              className="rounded-lg border-none w-full"
              tileClassName={({ date }) => 
                date.getDay() === 0 || date.getDay() === 6 
                  ? 'text-red-500 dark:text-red-400' 
                  : 'text-gray-900 dark:text-white'
              }
            />
          </div>
        </div>

        {/* Action Panel - Takes 1/3 space */}
        <div className="space-y-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Actions Rapides
            </h3>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-md transition duration-200 flex items-center justify-center"
            
            onClick={startPlanning}>
              <CalendarIcon className="w-5 h-5 mr-2" />
              {isLoading ? 'Préparation...' : 'Commencer la Planification'}
            </button>

            <div className="mt-4 space-y-3">
             <Link to='/admin/teachers'>
              <button className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition duration-200 flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les Enseignants
                </span>
              </button>
              </Link>

            <Link to='/admin/rooms'>
            <button className="w-full bg-white mt-3 dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition duration-200 flex items-center justify-between">
                <span className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Gérer les Salles
                </span>
              </button>
            </Link>

              <button className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition duration-200 flex items-center justify-between">
                <span className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Résoudre les Conflits
                </span>
                <span className="text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                  3 non résolus
                </span>
              </button>
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Examens à Venir
            </h3>
            <div className="space-y-3">
  {examens.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-400">Aucun examen prévu</p>
  ) : (
    examens.slice(0, 3).map((exam) => (
      <div
        key={exam.id}
        className="flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer"
      >
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 p-2 rounded-lg mr-3">
          <CalendarIcon className="w-4 h-4" />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{exam.nom}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {exam.date} • {exam.start_time}-{exam.end_time}
          </p>
        </div>
      </div>
    ))
  )}
</div>

          </div>
        </div>
      </div>
    </div>
  );
}