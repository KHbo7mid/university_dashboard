import { useState } from 'react';
import { Bell, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Notification } from '../types';

interface NotificationDropdownProps {
  notifications: Notification[];
  darkMode: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export function NotificationDropdown({
  notifications,
  darkMode,
  onMarkAsRead,
  onMarkAllAsRead
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg relative ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        )}
      </button>
      
      {isOpen && (
        <div className={`absolute left-0 mt-2  w-80 rounded-md shadow-lg py-1 z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => onMarkAsRead(notification.id)}
                  className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                    notification.read 
                      ? 'bg-gray-50 dark:bg-gray-700/50' 
                      : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                      {notification.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-500" />}
                      {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        {format(new Date(notification.date), "d MMMM 'à' HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Marquer tout comme lu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}