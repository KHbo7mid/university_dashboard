
import { useForm } from 'react-hook-form';
import { TeacherFormData } from '../../types/index';


interface TeacherFormProps {
  onSubmit: (data: TeacherFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<TeacherFormData>;
  isLoading?: boolean;
}

export default function TeacherForm({
  onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}: TeacherFormProps) {
  const { register, handleSubmit, formState: { errors }} = useForm<TeacherFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
        />
         {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      
      <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="text"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
             {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Département
  </label>
  <select
    {...register('department',{ required: 'Department is required' })}
    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 bg-white dark:bg-gray-800"
  >
    <option value="">Sélectionnez un département</option>
    <option value="Informatique">Informatique</option>
    <option value="Génie Électronique">Génie Électronique</option>
    <option value="Génie Mécanique">Génie Mécanique</option>
    <option value="Énergétique">Énergétique</option>
    <option value="Administration">Administration</option>
  </select>
  {errors.department && (
          <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
        )}
</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Grade
            </label>
            <input
              type="text"
              {...register('grade',
                { required: 'Grade is required' }
              )}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
              {errors.grade && (
          <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
        )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
             heurs Cours
            </label>
            <input
              type="text"
              {...register('heuresCours')}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
             
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
             heurs TD
            </label>
            <input
              type="text"
              {...register('heuresTd')}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
             
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
             heurs TP
            </label>
            <input
              type="text"
              {...register('heuresTp')}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
             
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Coefficient
            </label>
            <input
              type="text"
              {...register('coeff')}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            
          </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md"
          disabled={isLoading}
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