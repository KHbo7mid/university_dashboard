import { useForm } from 'react-hook-form';
import { Room } from '../../types/index';
interface SalleFormProps {
  onSubmit: (data: Room) => void;
  onCancel: () => void;
  defaultValues?: Partial<Room>;
  isLoading?: boolean;
}
export default function SalleForm({
    onSubmit,
  onCancel,
  defaultValues,
  isLoading = false,
}:SalleFormProps){
    const { register, handleSubmit, formState: { errors }} = useForm<Room>({
        defaultValues,
      });
      return  (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Numero
            </label>
            <input
              type="number"
              {...register('number')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.number && (
          <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bloc
            </label>
            <input
              type="text"
              {...register('bloc')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.bloc && (
          <p className="mt-1 text-sm text-red-600">{errors.bloc.message}</p>
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