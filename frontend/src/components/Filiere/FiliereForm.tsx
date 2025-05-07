import { useForm } from 'react-hook-form';
import { Filiere } from '../../types/index';
import { useState } from 'react';
interface FiliereFormProps {
  onSubmit: (data: Filiere) => void;
  onCancel: () => void;
  defaultValues?: Partial<Filiere>;
  isLoading?: boolean;
}

const levels: Record<'Cycle d\'Ingénieur' | 'Cycle Préparatoire' | 'Mastere' | 'Licence', string[]> = {
  'Cycle d\'Ingénieur': ['A1', 'A2', 'A3'],
  'Cycle Préparatoire': ['A1', 'A2'],
  'Mastere': ['A1', 'A2', 'A3'],
  'Licence': ['A1', 'A2', 'A3'],
};


export default function FiliereForm({
    onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}: FiliereFormProps) {
    const [selectedType, setSelectedType] = useState<keyof typeof levels>('Licence');
    const { register, handleSubmit, formState: { errors }} = useForm<Filiere>({
        defaultValues,
    });
    const levelOptions = levels[selectedType] || [];
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              {...register('type',
                { required: 'Type is required' }
              )}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              onChange={(e) => setSelectedType(e.target.value as keyof typeof levels)} 
            >
              <option value="Licence">Licence</option>
              <option value="Mastere">Mastere</option>
              <option value="Cycle Préparatoire">Cycle Préparatoire</option>
              <option value="Cycle d'Ingénieur">Cycle d'Ingénieur</option>
            </select>
            {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Niveau
            </label>
            <select
              {...register('niveau',
                { required: 'Niveau is required' }
              )}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {levelOptions.map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {errors.niveau && (
          <p className="mt-1 text-sm text-red-600">{errors.niveau.message}</p>
        )}
          </div>
         
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom
            </label>
            <input
              type="text"
              {...register('nom',
                { required: 'Name is required' })}
              
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
 {errors.nom && (
          <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
        )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre d'étudiants
            </label>
            <input
              type="text"
              {...register('nbr_students',
                { valueAsNumber: true },)}
             
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
             {errors.nbr_students && (
          <p className="mt-1 text-sm text-red-600">{errors.nbr_students.message}</p>
        )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={isLoading}
        >
          {isLoading ? 'Envoi...' : defaultValues ? 'Modifier' : 'Ajouter'}
        </button>
          </div>
        </form>
    );
}