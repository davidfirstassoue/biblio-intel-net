import { BookCard } from './BookCard';
import type { Book } from '../../types/book';

interface BookGridProps {
  books: Book[];
  title?: string;
  showEmpty?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
}

export function BookGrid({ 
  books, 
  title, 
  showEmpty = true, 
  emptyMessage = "Aucun livre trouvé",
  isLoading = false
}: BookGridProps) {
  return (
    <div>
      {title && (
        <h2 className="mb-6 text-2xl font-display font-semibold text-gray-900 dark:text-white">{title}</h2>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chargement des livres...
          </p>
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
            />
          ))}
        </div>
      ) : (
        showEmpty && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-16 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
              {emptyMessage}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Essayez d'autres termes de recherche ou parcourez nos catégories.
            </p>
          </div>
        )
      )}
    </div>
  );
}