import  { useEffect, useState } from 'react';

import { Plus} from 'lucide-react';
import salleService from '../Services/salleService';
import SalleForm from '../components/Salle/SalleForm';
import SalleTable from '../components/Salle/SalleTable';
import Modal from '../components/Modal';
import type { Room } from '../types/index';
import ExcelImportExport from '../components/ExcelImportExport';
const excelColumns = [
  { header: 'Numero', key: 'number', type: 'number' as const },
  { header: 'Bloc', key: 'bloc', type: 'string' as const },
  { header: 'Disponibility', key: 'Disponibility', type: 'boolean' as const },
];




export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
 const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   useEffect(()=>{
    fetchRooms();
   },[]);

   const fetchRooms=async ()=>{
    setIsLoading(true);
    setError(null);
    try{
      const data =await salleService.getAllSalles();
      setRooms(data);
    }catch(err){
      setError('Failed to fetch Rooms');
      console.log(err);
      
    }finally{
      setIsLoading(false);
    }
   };
   const handleExcelImport =async  (importedData: Room[]) => {
    for (const salle of importedData) {
      await salleService.addSalle(salle);
      await fetchRooms();
    }
  };
   const handleSubmit = async (formData: Room) => {
    setIsLoading(true);
    setError(null);
    try {
      const salleData = {
        number: formData.number,
        bloc: formData.bloc,
        disponibility: formData.disponibility,
        
      };

      if (editingRoom) {
        await salleService.updateSalle(editingRoom.id, salleData);
      } else {
         await salleService.addSalle(salleData);
       
      }
      await fetchRooms();
      setIsModalOpen(false);
    }catch (err: any) {
      setError(err.response.data || 'Failed to save Room');
      console.error(err);
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Room?')) {
      setIsLoading(true);
      setError(null);
      try {
        await salleService.deleteSalle(id);
        setRooms(rooms.filter(r => r.id !== id));
      } catch (err) {
        setError('Failed to delete Room');
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
          Salles
        </h1>
        <button
          onClick={() =>{ 
            setIsModalOpen(true);
            setEditingRoom(null);}}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une salle
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
<ExcelImportExport
        data={rooms}
        templateFileName="salles"
        
        columns={excelColumns}
        onImport={handleExcelImport}
      />
     <SalleTable
      salles={rooms}
      onEdit={room=>{
        setEditingRoom(room);
        setIsModalOpen(true);
      }}
      onDelete={handleDelete}
     
     />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoom ? "Modifier la salle" : "Ajouter une salle"}      >

        <SalleForm 
        onSubmit={handleSubmit}
        onCancel={()=>setIsModalOpen(false)}
        defaultValues={editingRoom?{
          number:editingRoom.number,
          bloc:editingRoom.bloc,
          disponibility:editingRoom.disponibility,

        }:undefined}
        isLoading={isLoading}
      
      
     
        />
        
      </Modal>
    </div>
  );
}