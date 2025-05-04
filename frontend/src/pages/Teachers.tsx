// src/pages/Teachers.tsx
import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';
import ExcelImportExport from '../components/ExcelImportExport';
import enseignantService from '../Services/enseignantService';
import TeacherForm from '../components/Teacher/TeacherForm';
import TeacherTable from '../components/Teacher/TeacherTable';
import { Teacher, TeacherFormData } from '../types/index';

const excelColumns = [
  { header: 'Nom & Prenom', key: 'name', type: 'string' as const },
  { header: 'Email', key: 'email', type: 'string' as const },
  { header: 'Département', key: 'department', type: 'string' as const },
  { header: 'Grade', key: 'grade', type: 'string' as const },
  { header: 'Heures Cours', key: 'heures_cours', type: 'number' as const },
  { header: 'Heures TD', key: 'heures_td', type: 'number' as const },
  { header: 'Heures TP', key: 'heures_tp', type: 'number' as const },
  { header: 'Coefficient', key: 'coeff', type: 'number' as const },
 
];

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await enseignantService.getAllEnseignants();
    
      setTeachers(data); 
    }catch (err) {
      setError('Failed to fetch teachers');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: TeacherFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const teacherData = {
        name: formData.name,
        email: formData.email,
        department: formData.department,
        grade: formData.grade,
        heuresCours: parseFloat(formData.heuresCours) || 0,
        heuresTd: parseFloat(formData.heuresTd) || 0,
        heuresTp: parseFloat(formData.heuresTp) || 0,
        coeff: parseFloat(formData.coeff) || 1,
      };

      if (editingTeacher) {
        await enseignantService.updateEnseignant(editingTeacher.id, teacherData);
      } else {
         await enseignantService.addEnseignant(teacherData);
       
      }
      await fetchTeachers();
      setIsModalOpen(false);
    }catch (err: any) {
      setError(err.response.data || 'Failed to save teacher');
      console.error(err);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setIsLoading(true);
      setError(null);
      try {
        await enseignantService.deleteEnseignant(id);
        setTeachers(teachers.filter(teacher => teacher.id !== id));
      } catch (err) {
        setError('Failed to delete teacher');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleExcelImport =async  (importedData: Teacher[]) => {
    for (const teacher of importedData) {
      await enseignantService.addEnseignant(teacher);
      await fetchTeachers();
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Enseignants</h1>
        <button
          onClick={() => {
            setEditingTeacher(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
        >
          <Plus className="mr-2" />
          Ajouter un enseignant
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <ExcelImportExport
        data={teachers}
        templateFileName="enseignants"
        
        columns={excelColumns}
        onImport={handleExcelImport}
      />

      <TeacherTable
        teachers={teachers}
        onEdit={teacher => {
          setEditingTeacher(teacher);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? "Modifier enseignant" : "Ajouter enseignant"}
      >
         <TeacherForm
    onSubmit={handleSubmit}
    onCancel={() => setIsModalOpen(false)}
    defaultValues={editingTeacher ? {
      name: editingTeacher.name || '',
      email: editingTeacher.email || '',
      department: editingTeacher.department || '',
      grade: editingTeacher.grade || '',
      heuresCours: editingTeacher.heuresCours?.toString() || '0',
      heuresTd: editingTeacher.heuresTd?.toString() || '0',
      heuresTp: editingTeacher.heuresTp?.toString() || '0',
      coeff: editingTeacher.coeff?.toString() || '1',
    } : undefined}
    isLoading={isLoading}
  />
      </Modal>
    </div>
  );
}