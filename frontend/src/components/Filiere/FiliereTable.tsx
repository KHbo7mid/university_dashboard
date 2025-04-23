import { Filiere } from "../../types/index";
import DataTable from '../DataTable';
import { Pencil, Trash2 } from 'lucide-react';
interface FiliereTableProps {
    filieres: Filiere[];
  onEdit: (teacher: Filiere) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}
export default function FiliereTable({
    filieres,
    onEdit,
  onDelete,
  isLoading = false,
}: FiliereTableProps) {
  const columns = [
    { accessorKey: 'niveau', header: 'Niveau' },
    { accessorKey: 'nom', header: 'Nom' },
    { accessorKey: 'type', header: 'Type' },
    { accessorKey: 'nbr_students', header: 'Nombre d\'étudiants' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(row.original)}  
            className="p-1 text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1 text-red-600 hover:text-red-800"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];        
  return (
    <DataTable
      data={filieres}
      columns={columns}
      searchPlaceholder="Rechercher une filière..."
     
    />
  );
}