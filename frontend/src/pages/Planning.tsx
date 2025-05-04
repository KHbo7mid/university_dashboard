import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Download, GripVertical, Share2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ExamSchedule, Teacher, Filiere, Examen, Room } from '../types/index';
// import { mockTeachers, mockPrograms, mockExamens, mockRooms } from '../staticData';

interface PlanningForm {
  examId: string;
  roomIds: string[];
  filiereIds: string[];
  surveillanceIds: string[];
}

const Modal = ({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Planning() {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [unscheduledExams, setUnscheduledExams] = useState<Examen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ExamSchedule | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<PlanningForm>();

  // Initialisation des données
  useEffect(() => {
    setUnscheduledExams([...mockExamens]);
  }, []);

  // Générer les emplois du temps pour les surveillants
  const generateTeacherSchedules = () => {
    const teacherSchedules: Record<string, { teacher: Teacher; exams: any[] }> = {};

    schedules.forEach(schedule => {
      const exam = mockExamens.find(e => e.id === schedule.examId);
      if (!exam) return;

      schedule.room.forEach(room => {
        const roomId = mockRooms.find((r: Room) => r.id === room.id);
        if (!roomId) return;

        schedule.surveillance.forEach(teacher => {
          if (!teacherSchedules[teacher.id]) {
            teacherSchedules[teacher.id] = { teacher, exams: [] };
          }

          teacherSchedules[teacher.id].exams.push({
            examName: exam.name,
            date: exam.date,
            startTime: exam.start_time,
            endTime: exam.end_time,
            room: `${room.bloc}-${room.number}`,
            filieres: schedule.filiere.map(f => f.name).join(', ')
          });
        });
      });
    });

    return teacherSchedules;
  };

  // Télécharger un emploi du temps individuel
  const downloadTeacherSchedule = (teacherId: string) => {
    const schedule = generateTeacherSchedules()[teacherId];
    if (!schedule) return;

    const content = [
      `Emploi du temps de surveillance - ${schedule.teacher.name}`,
      '=============================================\n',
      ...schedule.exams.map((exam, i) => 
        `Examen ${i + 1}: ${exam.examName}\n` +
        `Date: ${exam.date}\n` +
        `Heure: ${exam.startTime} - ${exam.endTime}\n` +
        `Salle: ${exam.room}\n` +
        `Filières: ${exam.filieres}\n` +
        `---------------------------------------------`
      )
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `surveillance_${schedule.teacher.name.replace(/\s+/g, '_')}.txt`;
    link.click();
  };

  // Télécharger tous les emplois du temps
  const downloadAllSchedules = () => {
    Object.keys(generateTeacherSchedules()).forEach(downloadTeacherSchedule);
  };

  // Soumission du formulaire
  const onSubmit = (data: PlanningForm) => {
    const selectedExam = mockExamens.find(e => e.id === data.examId);
    const selectedRooms = mockRooms.filter(r => data.roomIds.includes(r.id));
    const selectedFilieres = mockPrograms.filter(f => data.filiereIds.includes(f.id));
    const selectedSurveillance = mockTeachers.filter(t => data.surveillanceIds.includes(t.id));

    if (!selectedExam || selectedRooms.length === 0 || selectedFilieres.length < 2 || selectedSurveillance.length < 2) {
      alert("Veuillez remplir tous les champs requis (au moins 1 salle, 2 filières et 2 surveillants)");
      return;
    }

    const newSchedule: ExamSchedule = {
      id: editingSchedule?.id || `sched-${Date.now()}`,
      examId: data.examId,
      room: selectedRooms,
      filiere: selectedFilieres,
      surveillance: selectedSurveillance
    };

    if (editingSchedule) {
      setSchedules(schedules.map(s => s.id === editingSchedule.id ? newSchedule : s));
    } else {
      setSchedules([...schedules, newSchedule]);
      setUnscheduledExams(unscheduledExams.filter(e => e.id !== data.examId));
    }

    handleCloseModal();
  };

  // Gestion du drag and drop
  const onDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === 'unscheduled' && destination.droppableId === 'scheduled') {
      const examId = unscheduledExams[source.index].id;
      setValue('examId', examId);
      setIsModalOpen(true);
    }
  };

  // Gestion de l'édition
  const handleEdit = (schedule: ExamSchedule) => {
    setEditingSchedule(schedule);
    setValue('examId', schedule.examId);
    setValue('roomIds', schedule.room.map(r => r.id));
    setValue('filiereIds', schedule.filiere.map(f => f.id));
    setValue('surveillanceIds', schedule.surveillance.map(t => t.id));
    setIsModalOpen(true);
  };

  // Gestion de la suppression
  const handleDelete = (id: string) => {
    const scheduleToDelete = schedules.find(s => s.id === id);
    if (scheduleToDelete) {
      const examToRestore = mockExamens.find(e => e.id === scheduleToDelete.examId);
      if (examToRestore) {
        setUnscheduledExams([...unscheduledExams, examToRestore]);
      }
    }
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // Fermeture du modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
    reset();
  };

  // Variables calculées
  const selectedExamId = watch('examId');
  const selectedExam = selectedExamId ? mockExamens.find(e => e.id === selectedExamId) : null;
  const excludedTeacherId = selectedExam ? selectedExam.teacher_responsable : null;
  
  const availableRooms = mockRooms.filter(room => 
    !editingSchedule || room.disponibility || editingSchedule.room.map(r => r.id).includes(room.id)
  );

  const availableFilieres = mockPrograms.filter(filiere =>
    !editingSchedule || editingSchedule.filiere.some(f => f.id === filiere.id)
  );

  const availableTeachers = mockTeachers.filter(teacher =>
    (!editingSchedule || editingSchedule.surveillance.some(t => t.id === teacher.id)) &&
    teacher.id !== excludedTeacherId
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planning des examens</h1>
        <div className="flex space-x-3">
          <button
            onClick={downloadAllSchedules}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Share2 className="mr-2" size={18} />
            Envoyer tous
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={unscheduledExams.length === 0}
          >
            <Plus className="mr-2" size={18} />
            Ajouter examen
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Examens non planifiés */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Examens non planifiés</h2>
            <Droppable droppableId="unscheduled">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-20"
                >
                  {unscheduledExams.map((exam, index) => (
                    <Draggable key={exam.id} draggableId={`unscheduled-${exam.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white p-3 rounded shadow flex items-center border"
                        >
                          <div {...provided.dragHandleProps} className="mr-3 text-gray-400">
                            <GripVertical size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{exam.name}</div>
                            <div className="text-sm text-gray-600">
                              {mockPrograms.find(f => f.id === exam.filiere)?.name} • {exam.date} {exam.start_time}-{exam.end_time}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Examens planifiés */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Examens planifiés</h2>
            <Droppable droppableId="scheduled">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-20"
                >
                  {schedules.map((schedule, index) => {
                    const exam = mockExamens.find(e => e.id === schedule.examId);
                    if (!exam) return null;

                    return (
                      <Draggable key={schedule.id} draggableId={`scheduled-${schedule.id}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="bg-white p-3 rounded shadow border"
                          >
                            <div className="flex justify-between items-start">
                              <div {...provided.dragHandleProps} className="flex items-start mr-3">
                                <GripVertical size={16} className="mt-1 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{exam.name}</div>
                                <div className="text-sm text-gray-600 mb-2">
                                  {exam.date} {exam.start_time}-{exam.end_time}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-semibold">Salles:</span>
                                    <ul className="list-disc list-inside">
                                      {schedule.room.map(roomId => {
                                        const foundRoom = mockRooms.find((r: Room) => r.id === roomId.id);
                                        return foundRoom ? <li key={roomId.id}>{foundRoom.bloc}-{foundRoom.number}</li> : null;
                                      })}
                                    </ul>
                                  </div>
                                  <div>
                                    <span className="font-semibold">Filières:</span>
                                    <ul className="list-disc list-inside">
                                      {schedule.filiere.map(f => <li key={f.id}>{f.name}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <span className="font-semibold">Surveillants:</span>
                                    <ul className="list-disc list-inside">
                                      {schedule.surveillance.map(t => <li key={t.id}>{t.name}</li>)}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEdit(schedule)}
                                  className="text-blue-600 hover:text-blue-800 p-1"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(schedule.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Emplois du temps des surveillants */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Emplois du temps des surveillants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(generateTeacherSchedules()).map(([teacherId, { teacher, exams }]) => (
            <div key={teacherId} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">{teacher.name}</h3>
                <button
                  onClick={() => downloadTeacherSchedule(teacherId)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Télécharger"
                >
                  <Download size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {exams.map((exam, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <p className="font-medium">{exam.examName}</p>
                    <p className="text-sm">{exam.date} {exam.startTime}-{exam.endTime}</p>
                    <p className="text-sm">Salle: {exam.room}</p>
                    <p className="text-sm">Filières: {exam.filieres}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal pour ajouter/modifier un examen */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingSchedule ? "Modifier l'examen" : "Planifier un examen"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Examen</label>
            <select
              {...register('examId', { required: true })}
              className="w-full p-2 border rounded"
              disabled={!!editingSchedule}
            >
              {editingSchedule ? (
                <option value={editingSchedule.examId}>
                  {mockExamens.find(e => e.id === editingSchedule.examId)?.name}
                </option>
              ) : (
                <>
                  <option value="">Sélectionner un examen</option>
                  {unscheduledExams.map(exam => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name} ({mockPrograms.find(f => f.id === exam.filiere)?.name})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salles (sélectionnez une ou plusieurs)</label>
            <div className="grid grid-cols-2 gap-2">
              {availableRooms.map(room => (
                <div key={room.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`room-${room.id}`}
                    value={room.id}
                    {...register('roomIds', { required: true })}
                    className="mr-2"
                  />
                  <label htmlFor={`room-${room.id}`}>
                    {room.bloc}-{room.number}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filières (sélectionnez au moins 2)</label>
            <div className="grid grid-cols-2 gap-2">
              {availableFilieres.map(filiere => (
                <div key={filiere.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`filiere-${filiere.id}`}
                    value={filiere.id}
                    {...register('filiereIds', { required: true })}
                    className="mr-2"
                  />
                  <label htmlFor={`filiere-${filiere.id}`}>
                    {filiere.name} ({filiere.niveau})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Surveillants (sélectionnez au moins 2)</label>
            <div className="grid grid-cols-2 gap-2">
              {availableTeachers.map(teacher => (
                <div key={teacher.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`teacher-${teacher.id}`}
                    value={teacher.id}
                    {...register('surveillanceIds', { required: true })}
                    className="mr-2"
                  />
                  <label htmlFor={`teacher-${teacher.id}`}>
                    {teacher.name} ({teacher.department})
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingSchedule ? 'Modifier' : 'Planifier'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}