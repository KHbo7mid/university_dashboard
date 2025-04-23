// src/components/Teacher/TeacherTable.tsx
import { Teacher } from '../../types/index';
import DataTable from '../DataTable';
import { Pencil, Trash2 } from 'lucide-react';

interface TeacherTableProps {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function TeacherTable({
  teachers,
  onEdit,
  onDelete,
  isLoading = false,
}: TeacherTableProps) {
  const columns = [
    { accessorKey: 'name', header: 'Nom & Prenom' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'department', header: 'Département' },
    { accessorKey: 'grade', header: 'Grade' },
    {
      header: 'Surveillance',
      cell: ({ row }: any) => `${ row.original.heuresSurveillance || 0} heures`,
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
      data={teachers}
      columns={columns}
      searchPlaceholder="Rechercher un enseignant..."
      
    />
  );
}