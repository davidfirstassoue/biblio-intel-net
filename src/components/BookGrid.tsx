import React from 'react';
import { motion } from 'framer-motion';

interface Book {
  id: string;
  titre: string;
  auteur: string;
  image_url: string;
  note: number;
  prix: number;
  categorie: string;
}

interface BookGridProps {
  books: Book[];
  loading: boolean;
}

const BookGrid: React.FC<BookGridProps> = ({ books, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-96"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {books.map((book) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-64">
            <img
              src={book.image_url}
              alt={book.titre}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/default-book.png';
              }}
            />
            <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-sm font-bold">
              ★ {book.note || '4.0'}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
              {book.titre}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {book.auteur}
            </p>
            <div className="flex justify-between items-center">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded">
                {book.categorie}
              </span>
              <span className="text-green-600 dark:text-green-400 font-bold">
                {book.prix ? `${book.prix} EUR` : 'Disponible'}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BookGrid; 