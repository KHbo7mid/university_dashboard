import React, { useState, useEffect } from 'react';
import { Edit, Send, Check, X, User, Calendar, Clock, Home, BookOpen } from 'lucide-react';
import { Teacher, PlanningData } from '../types/index';
import planningService from '../Services/planningService';
import teacherService from '../Services/enseignantService';

interface RoomData {
  subjects: string[];
  teachers: string[]; // or Teacher[] if you want to use objects
}

interface TimeSlot {
  [room: string]: RoomData;
}

interface UpdatedPlanningData {
  [date: string]: {
    [time: string]: TimeSlot;
  };
}

export default function PlanningPage() {
  const [planning, setPlanning] = useState<UpdatedPlanningData>({});
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editingSlot, setEditingSlot] = useState<{date: string, time: string, room: string} | null>(null);
  const [selectedSurveillants, setSelectedSurveillants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const planningRes = await planningService.getSchedules();
      
      
      setPlanning(planningRes.data || {});
     
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (date: string, time: string, room: string, currentTeachers: string[]) => {
    setEditingSlot({ date, time, room });
    setSelectedSurveillants(currentTeachers);
  };

  const cancelEditing = () => {
    setEditingSlot(null);
    setSelectedSurveillants([]);
  };

  const handleSurveillantChange = (teacherId: string) => {
    setSelectedSurveillants(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const saveChanges = async () => {
    if (!editingSlot || selectedSurveillants.length < 2) {
      setError('Select at least 2 surveillants');
      return;
    }

    try {
      setIsLoading(true);
      const { date, time, room } = editingSlot;
      
      const updatedPlanning = JSON.parse(JSON.stringify(planning));
      updatedPlanning[date][time][room].teachers = selectedSurveillants;
      
      setPlanning(updatedPlanning);
      setEditingSlot(null);
      setSuccess('Changes saved successfully');
      setTimeout(() => setSuccess(null), 3000);
      
      // Call API to save changes
      // await planningService.updatePlanning(updatedPlanning);
    } catch (err) {
      setError('Failed to save changes');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFlattenedPlanning = () => {
    const result: {
      date: string;
      time: string;
      room: string;
      subjects: string[];
      teachers: string[];
    }[] = [];

    Object.entries(planning).forEach(([date, times]) => {
      Object.entries(times).forEach(([time, rooms]) => {
        Object.entries(rooms).forEach(([room, roomData]) => {
          result.push({
            date,
            time,
            room,
            subjects: roomData.subjects,
            teachers: roomData.teachers
          });
        });
      });
    });
   console.log("result", result);
   
    return result;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Exam Planning Management</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
          <button onClick={() => setError(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          {success}
          <button onClick={() => setSuccess(null)} className="float-right font-bold">×</button>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading planning data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Calendar className="inline mr-1" size={14} /> Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Clock className="inline mr-1" size={14} /> Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <Home className="inline mr-1" size={14} /> Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <BookOpen className="inline mr-1" size={14} /> Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <User className="inline mr-1" size={14} /> Teachers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFlattenedPlanning().map((slot, index) => {
                const isEditing = editingSlot?.date === slot.date && 
                                 editingSlot?.time === slot.time && 
                                 editingSlot?.room === slot.room;
                
                return (
                  <tr key={`${slot.date}-${slot.time}-${slot.room}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(slot.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slot.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {slot.room}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <ul className="list-disc list-inside">
                        {slot.subjects.map((subject, i) => (
                          <li key={i}>{subject}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {isEditing ? (
                        <div className="space-y-2">
                          {teachers.map((teacher) => (
                            <div key={teacher.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`teacher-${teacher.id}`}
                                checked={selectedSurveillants.includes(teacher.id)}
                                onChange={() => handleSurveillantChange(teacher.id)}
                                className="mr-2"
                              />
                              <label htmlFor={`teacher-${teacher.id}`}>
                                {teacher.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="space-y-1">
                          {slot.teachers.map((teacher, i) => (
                            <li key={i} className="flex items-center">
                              <span>{teacher}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={saveChanges}
                            className="text-green-600 hover:text-green-800"
                            title="Save changes"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel editing"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(slot.date, slot.time, slot.room, slot.teachers)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit teachers"
                        >
                          <Edit size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}