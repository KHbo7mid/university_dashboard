import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen,
  Building,
  Calendar,
  Sun,
  Moon,
  LogOut,
  Menu,
  User,
  Shield
} from 'lucide-react';
import logo from '../images/logo.png';
import mockNotifications from '../mockData';
import { useAuth } from '../contexts/AuthContext';
import { NotificationDropdown } from './NotificationDropDown';

const adminNavigation = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Enseignants', href: '/admin/teachers', icon: Users },
  { name: 'Filières', href: '/admin/filieres', icon: GraduationCap },
  { name: 'Salles', href: '/admin/rooms', icon: Building },
  { name: 'Examens', href: '/admin/examens', icon: BookOpen },
  { name: 'Planning des examens', href: '/admin/planning', icon: Calendar },
];

const teacherNavigation = [
  { name: 'Tableau de bord', href: '/teacher', icon: LayoutDashboard },
  { name: 'Emploi de surveillance', href: '/teacher/surveillance', icon: Shield },
  { name: 'Profil', href: '/teacher/profile', icon: User },
];

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const [notifications, setNotifications] = useState(mockNotifications());
  const { user, logout } = useAuth();
  
  // Get the appropriate navigation based on user role
  const navigation = user?.role === 'ADMIN' ? adminNavigation : teacherNavigation;
  
  const handleLogout = () => {
    logout();
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, read: true} : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} flex`}>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transition-transform transform lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <aside className={`w-64 h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex items-center justify-between h-16 px-4">
            <img src={logo} alt="Logo" className="h-12 w-12" />
            <button onClick={() => setSidebarOpen(false)} className="text-xl font-bold text-gray-500">&times;</button>
          </div>
          <nav className="mt-4">
            {navigation.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                to={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  location.pathname === href
                    ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-blue-600'}`
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </Link>
            ))}
          </nav>
        </aside>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col w-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="mx-auto h-24 w-24">
          <img src={logo} alt="Logo" className="h-24 w-24" />
        </div>
        <nav className="mt-4">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              to={href}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                location.pathname === href
                  ? `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-blue-600'}`
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-50'}`
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className={`h-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex items-center justify-between px-4`}>
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <NotificationDropdown
              notifications={notifications}
              darkMode={darkMode}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </div>

          {/* Admin Info & Logout */}
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {user?.email} ({user?.role === 'ADMIN' ? 'Administrateur' : 'Enseignant'})
            </span>
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}