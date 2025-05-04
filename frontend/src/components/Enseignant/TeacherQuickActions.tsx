import { Lock, AlertCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeacherQuickActions() {
  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
      <h3 className="font-medium text-lg mb-3 dark:text-white">
        Actions rapides
      </h3>
      
      <div className="space-y-2">
        <Link 
          to="/teacher/change-password"
          className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Lock className="w-5 h-5 text-blue-500" />
          <span className="dark:text-white">Changer mon mot de passe</span>
        </Link>
        
        <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <span className="dark:text-white">Signaler un problème</span>
        </button>
        
        <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <Mail className="w-5 h-5 text-green-500" />
          <span className="dark:text-white">Contacter l'administration</span>
        </button>
      </div>
    </div>
  );
}