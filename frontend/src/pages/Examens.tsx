import  { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';
import ExamenForm from '../components/Examen/ExamenForm';
import ExamenTable from '../components/Examen/ExamenTable';
import Modal from '../components/Modal';
import type { Examen, Filiere, Teacher } from '../types/index';
import examenService from '../Services/examenService';
import ExcelImportExport from '../components/ExcelImportExport';

const excelColumns = [
  { header: 'Nom', key: 'nom', type: 'string' as const },
  { header: 'Date', key: 'date', type: 'string' as const },
  { header: 'Date Debut', key: 'start_time', type: 'string' as const },
  { header: 'Date Fin', key: 'end_time', type: 'string' as const },
  { 
    header: 'Filiere', 
    key: 'filiere', 
    type: 'string' as const,
    value: (examen: Examen) => examen.filiere?.nom || '' 
  },
  { 
    header: 'Enseignant Responsable', 
    key: 'enseignant_responsable', 
    type: 'string' as const,
    value: (examen: Examen) => examen.enseignant_responsable?.name || ''
  }
  
 
];


export default function Examens() {
  const [examens, setExamens] = useState<Examen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExamen, setEditingExamen] = useState<Examen | null>(null);
   const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

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
  
    const handleSubmit = async (formData: Examen) => {
      setIsLoading(true);
      setError(null);
      
   
      try {
        const filiere = formData.filiere ? JSON.parse(formData.filiere) : null;
    const enseignant = formData.enseignant_responsable ? JSON.parse(formData.enseignant_responsable) : null;
        const ExamData = {
          nom: formData.nom,
          date: formData.date,
          start_time: formData.start_time ,
          end_time: formData.end_time ,
          filiere: filiere,
          enseignant_responsable: enseignant,
        
        };
  
        if (editingExamen) {
          await examenService.updateExamen(editingExamen.id, ExamData);
        } else {
           await examenService.addExamen(ExamData);
         
        }
        await fetchExams();
        setIsModalOpen(false);
      }catch (err: any) {
        setError(err.response.data || 'Failed to save exam');
        console.error(err);
        setIsModalOpen(false);
      } finally {
        setIsLoading(false);
      }
    };
    const handleExcelImport = async (importedData: any[]) => {
      try {
        const transformedData = importedData.map(item => ({
          ...item,
          filiere: item.filiere ? { nom: item.filiere } : null,
          enseignant_responsable: item.enseignant_responsable ? { name: item.enseignant_responsable } : null
        }));
    
        // Use bulk insert if available
        for (const exam of transformedData) {
          await examenService.addExamen(exam);
        }
        await fetchExams();
      } catch (err) {
        setError('Failed to import exams');
        console.error(err);
      }
    };
    const handleDelete = async (id: string) => {
      if (window.confirm('Are you sure you want to delete this exam?')) {
        setIsLoading(true);
        setError(null);
        try {
          await examenService.deleteExamen(id);
          setExamens(examens.filter(examen => examen.id !== id));
        } catch (err) {
          setError('Failed to delete exam');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    const flattenedExamens = examens.map(examen => ({
      ...examen,
      filiere: examen.filiere?.nom || '',
      enseignant_responsable: examen.enseignant_responsable?.name || ''
    }));
   const handleDeleteAll = async () => {
      if (window.confirm('Are you sure you want to delete all exams?')) {
        setIsLoading(true);
        setError(null);
        try {
          await examenService.deleteAllExamens();
          setExamens([]);
        } catch (err) {
          setError('Failed to delete all exams');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };
 
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Examens
        </h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingExamen(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un examen
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <ExcelImportExport
              data={flattenedExamens}
              templateFileName="examens"
              
              columns={excelColumns}
              onImport={handleExcelImport}
            />
      <ExamenTable
        examens={examens}
        onEdit={(examen) => {
          setEditingExamen(examen);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
 
<div className="flex justify-end mt-4">
        <button
          onClick={handleDeleteAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Supprimer tous les examens
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExamen ? "Modifier l'examen" : "Ajouter un examen"}
      >
        <ExamenForm
         
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          defaultValues={editingExamen ? {
            nom: editingExamen.nom || '',
            date: editingExamen.date || '',
            start_time: editingExamen.start_time || '',
            end_time: editingExamen.end_time || '',
            filiere: editingExamen.filiere || undefined,
            enseignant_responsable: editingExamen.enseignant_responsable || undefined,
          } : undefined}
          isLoading={isLoading}
        />
        
      </Modal>
    </div>
  );
}
