import { Room } from "../../types/index";
import DataTable from '../DataTable';
import { Pencil, Trash2 } from 'lucide-react';
interface SalleTableProps{
    salles:Room[];
    onEdit: (salle: Room) => void;
      onDelete: (id: string) => void;
    
}
export default function SalleTable({
    salles,
    onEdit,
    onDelete,
  
}:SalleTableProps){
   const columns = [
       {
         accessorKey: 'number',
         header: 'Numéro',
       },
       {
         accessorKey: 'bloc',
         header: 'Bloc',
       },
      
       {
         accessorKey: 'disponibility',
         header: 'Disponibilité',
         cell: ({ row }: any) => (
           row.original.disponibility ? (
             <span className="text-green-600 font-bold flex justify-center">✅</span>
           ) : (
             <span className="text-red-600 font-bold flex justify-center">❌</span>
           )
         ),
       },
       
       {
         id: 'actions',
         header: 'Actions',
         cell: ({ row }: any) => (
           <div className="flex space-x-2">
             <button
               onClick={() => onEdit(row.original)}
               className="p-1 text-blue-600 hover:text-blue-800"
             >
               <Pencil className="h-4 w-4" />
             </button>
             <button
               onClick={() => onDelete(row.original.id)}
               className="p-1 text-red-600 hover:text-red-800"
             >
               <Trash2 className="h-4 w-4" />
             </button>
           </div>
         ),
       },
     ];
     return (
        <DataTable
              data={salles}
              columns={columns}
              searchPlaceholder="Rechercher une salle..."
              
            />
     );
}