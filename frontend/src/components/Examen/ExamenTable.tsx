import { Examen } from "../../types/index";
import DataTable from '../DataTable';
import { Pencil, Trash2 } from 'lucide-react';

interface ExamenTableProps {
  examens: Examen[];
    onEdit: (examen: Examen) => void;
    onDelete: (id: string) => void;
    isLoading?: boolean;
}
export default function ExamenTable({
    examens,
    onEdit,     
    onDelete,   
    isLoading = false,
}: ExamenTableProps) {
    const columns = [
        { accessorKey: 'nom', header: 'Nom' },
        { accessorKey: 'filiere', header: 'Filière',

            cell: ({ row }: any) => (
                <span>
                  {row.original.filiere?.niveau} - {row.original.filiere?.nom}
                </span>
              )
            },
         
        { accessorKey: 'date', header: 'Date' },
       
        { accessorKey: 'enseignant_responsable', header: 'Enseignant Responsable',
            cell: ({ row }: any) => (
                <span>
                  {row.original.enseignant_responsable?.name}
                </span>
              )
            },
        
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
            data={examens}
            columns={columns}
            searchPlaceholder="Rechercher un examen..."
           
        />  
    );  
}