import { FC } from 'react';

export const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-300">Chargement...</span>
    </div>
  );
}; 