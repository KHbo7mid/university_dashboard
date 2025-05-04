import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Lock, User, BookOpen, Eye, ChevronRight } from 'lucide-react';

export function TeacherProfile() {
    const { user } = useAuth(); 
    
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Card */}
          <div className="w-full md:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-blue-100">{user?.department}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium dark:text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Grade</p>
                    <p className="font-medium dark:text-white">{user?.grade}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Link 
                    to="/teacher/change-password"
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-blue-500" />
                      <span className="font-medium dark:text-white">Changer mon mot de passe</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Teaching Information */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Teaching Workload Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold dark:text-white">Charge d'Enseignement</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Heures de Cours</h4>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-300">{user?.heures_cours}h</span>
                    </div>
                   
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200">Heures de TD</h4>
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-300">{user?.heures_td}h</span>
                    </div>
                   
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Heures de TP</h4>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-300">{user?.heures_tp}h</span>
                    </div>
                    
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Coefficient</h4>
                      <span className="text-2xl font-bold text-amber-600 dark:text-amber-300">{user?.coeff}</span>
                    </div>
                   
                  </div>
                </div>
              </div>
            </div>

            {/* Supervision Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center space-x-3">
                <Eye className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-semibold dark:text-white">Charge de Surveillance</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="relative w-48 h-48">
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">{user?.heuresSurveillance}h</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total heures</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}