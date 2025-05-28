import { FC } from 'react';
import { motion } from 'framer-motion';

interface Book {
  id: number;
  title: string;
  author: string;
  publication_year?: number;
  genre?: string;
  cover_url: string;
  description: string;
  publisher?: string;
  language: string;
  page_count?: number;
}

interface BookCardProps {
  book: Book;
}

export const BookCard: FC<BookCardProps> = ({ book }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={book.cover_url}
          alt={`Couverture de ${book.title}`}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/200x300?text=Image+non+disponible';
          }}
        />
        {book.genre && (
          <div className="absolute top-2 right-2 bg-accent-600 text-white px-2 py-1 rounded-full text-xs">
            {book.genre}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {book.author}
        </p>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          {book.publication_year && (
            <p>Année : {book.publication_year}</p>
          )}
          {book.publisher && (
            <p>Éditeur : {book.publisher}</p>
          )}
          {book.page_count && (
            <p>{book.page_count} pages</p>
          )}
        </div>

        <p className="mt-3 text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
          {book.description}
        </p>
      </div>
    </motion.div>
  );
}; 