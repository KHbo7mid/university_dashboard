import { useState } from 'react';
import { Calendar, XCircle, CheckCircle } from 'lucide-react';

export default function TeacherAvailability() {
  const [unavailableSlots, setUnavailableSlots] = useState<{date: string, reason: string}[]>([]);
  const [newSlot, setNewSlot] = useState({date: '', reason: ''});

  const handleAddSlot = () => {
    if (newSlot.date && newSlot.reason) {
      setUnavailableSlots([...unavailableSlots, newSlot]);
      setNewSlot({date: '', reason: ''});
    }
  };

  const handleRemoveSlot = (index: number) => {
    setUnavailableSlots(unavailableSlots.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4">
      <h3 className="font-medium text-lg mb-3 dark:text-white">
        Mes indisponibilités
      </h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="date"
            value={newSlot.date}
            onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
            className="border rounded p-2 flex-1 dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="text"
            placeholder="Raison"
            value={newSlot.reason}
            onChange={(e) => setNewSlot({...newSlot, reason: e.target.value})}
            className="border rounded p-2 flex-1 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={handleAddSlot}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
        
        <div className="space-y-2">
          {unavailableSlots.map((slot, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded dark:border-gray-700">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <span className="dark:text-white">
                  {new Date(slot.date).toLocaleDateString('fr-FR')} - {slot.reason}
                </span>
              </div>
              <button 
                onClick={() => handleRemoveSlot(index)}
                className="text-red-500 hover:text-red-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Envoyer mes indisponibilités
        </button>
      </div>
    </div>
  );
}