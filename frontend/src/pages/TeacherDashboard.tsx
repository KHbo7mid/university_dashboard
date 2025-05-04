import TeacherAvailability from "../components/Enseignant/TeacherAvailability";
import TeacherQuickActions from "../components/Enseignant/TeacherQuickActions";
// import TeacherSchedule from "../components/Enseignant/TeacherSchedule";
import { useAuth } from "../contexts/AuthContext";
import { BookOpen, Calendar,  Home,Eye } from 'lucide-react';

export default function TeacherDashboard() {  
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Tableau de bord enseignant</h1>
                    </div>
                  
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Bienvenue, {user?.name}
                            </h2>
                            <p className="text-indigo-100 max-w-lg">
                                Consultez votre emploi du Surveillance, gérez vos disponibilités et accédez à vos outils pédagogiques.
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm">
                                <Home className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Availability Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center space-x-3">
                                <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-lg font-semibold dark:text-white">Mes disponibilités</h2>
                            </div>
                            <div className="p-6">
                                <TeacherAvailability />
                            </div>
                        </div>
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
                      

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                                <h2 className="text-lg font-semibold dark:text-white">Actions rapides</h2>
                            </div>
                            <div className="p-4">
                                <TeacherQuickActions />
                            </div>
                        </div>

                       
                       
                    </div>
                </div>
            </main>
        </div>
    );  
}