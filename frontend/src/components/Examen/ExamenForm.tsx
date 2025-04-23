import { useForm } from 'react-hook-form';
import { Examen, Filiere, Teacher } from '../../types/index';
import { useEffect, useState } from 'react';
import enseignantService from '../../Services/enseignantService';
import filiereService from '../../Services/filiereService';

interface ExamenFormProps {
  onSubmit: (data: Examen) => void;
  onCancel: () => void;
  defaultValues?: Partial<Examen>;
  isLoading?: boolean;
}

export default function ExamenForm({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}: ExamenFormProps) {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [enseignants, setEnseignants] = useState<Teacher[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<Examen>({
    defaultValues,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const [filieresData, enseignantsData] = await Promise.all([
          filiereService.getAllFilieres(),
          enseignantService.getAllEnseignants()
        ]);
        
        setFilieres(filieresData);
        setEnseignants(enseignantsData);
      } catch (err) {
        setError('Failed to load required data');
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  if (isLoadingData) {
    return <div>Loading form data...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nom
        </label>
        <input
          type="text"
          {...register('nom', { required: 'Nom is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.nom && (
          <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
        )}
      </div>
     
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Filière
        </label>
        <select
          {...register('filiere', { required: 'Filière is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a filière</option>
          {filieres.map(filiere => (
            <option key={filiere.id} value={JSON.stringify(filiere)}>
              {filiere.niveau} - {filiere.nom}
            </option>
          ))}
        </select>
        {errors.filiere && (
          <p className="mt-1 text-sm text-red-600">{errors.filiere.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          {...register('date', { required: 'Date is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Heure Début
        </label>
        <input
          type="time"
          {...register('start_time', { required: 'Start time is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.start_time && (
          <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Heure Fin
        </label>
        <input
          type="time"
          {...register('end_time', { required: 'End time is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.end_time && (
          <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enseignant Responsable
        </label>
        <select
          {...register('enseignant_responsable', { required: 'Enseignant is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select an enseignant</option>
          {enseignants.map(teacher => (
            <option key={teacher.id} value={JSON.stringify(teacher)}>
              {teacher.name}
            </option>
          ))}
        </select>
        {errors.enseignant_responsable && (
          <p className="mt-1 text-sm text-red-600">{errors.enseignant_responsable.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isLoading ? 'Envoi...' : defaultValues ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}