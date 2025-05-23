import  { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';
import FiliereForm from '../components/Filiere/FiliereForm';
import FiliereTable from '../components/Filiere/FiliereTable';
import Modal from '../components/Modal';

import type { Filiere } from '../types';
import filiereService from '../Services/filiereService';
import ExcelImportExport from '../components/ExcelImportExport';

const excelColumns = [
  { header: 'Type', key: 'type', type: 'string' as const },
  { header: 'Niveau', key: 'niveau', type: 'string' as const },
  { header: 'Nom', key: 'nom', type: 'string' as const },
  { header: 'Nombre Etudiants', key: 'nbr_students', type: 'number' as const },

];

export default function Programs() {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFiliere, setEditingFiliere] = useState<Filiere | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 // New state to track selected type
  useEffect(() => {
    fetchFiliere();
  }, []);
  const fetchFiliere = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await filiereService.getAllFilieres();
      setFilieres(data);
    } catch (err) {
      setError('Failed to fetch programs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleExcelImport =async  (importedData: Filiere[]) => {
    for (const filiere of importedData) {
      await filiereService.addFiliere(filiere);
      await fetchFiliere();
    }
  };
  const handleSubmit = async (formData: Filiere) => {
    setIsLoading(true);
    setError(null);
    try {
      const filiereData = {
        nom: formData.nom,
        type: formData.type,
        niveau: formData.niveau,
        nbr_students: Number(formData.nbr_students) || 0,
      };

      if (editingFiliere) {
      const updatedFiliere=  await filiereService.updateFiliere(editingFiliere.id, filiereData);
        setFilieres(filieres.map(f => (f.id === editingFiliere.id ? updatedFiliere : f)));
        console.log(filiereData);
        
      } else {
       const newFiliere=  await filiereService.addFiliere(filiereData);
        setFilieres([...filieres, newFiliere]);
       
      }
      await fetchFiliere();
      setIsModalOpen(false);
      setEditingFiliere(null); 
    }catch (err: any) {
      setError(err.response.data || 'Failed to save Filiere');
      console.error(err);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Filiere?')) {
      setIsLoading(true);
      setError(null);
      try {
        await filiereService.deleteFiliere(id);
        setFilieres(filieres.filter(f => f.id !== id));
      } catch (err) {
        setError('Failed to delete teacher');
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
          Filières
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une filière
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

<ExcelImportExport
        data={filieres}
        templateFileName="filieres"
        
        columns={excelColumns}
        onImport={handleExcelImport}
      />

     <FiliereTable
        filieres={filieres}
        onEdit={f => {
          setEditingFiliere(f);
          setIsModalOpen(true);
        }
        }
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFiliere(null); 
        }}
        title={editingFiliere ? "Modifier la filière" : "Ajouter une filière"}
      >
        <FiliereForm
         onSubmit={handleSubmit}
         onCancel={() => setIsModalOpen(false)}
         defaultValues={editingFiliere? {
         
          nom: editingFiliere.nom,
          type: editingFiliere.type,
          niveau: editingFiliere.niveau,
          nbr_students: editingFiliere.nbr_students,
         } : undefined}
         isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}
