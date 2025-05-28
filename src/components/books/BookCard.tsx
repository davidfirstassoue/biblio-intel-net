import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  index?: number;
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link to={`/livre/${book.id}`}>
        <Card 
          hoverable 
          className="group h-full overflow-hidden transition-all duration-300"
        >
          <div className="relative h-56 overflow-hidden">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                <span className="text-gray-400 dark:text-gray-600">
                  Image non disponible
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="mb-1 font-medium line-clamp-1">
              {book.title || 'Titre inconnu'}
            </h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {book.author || 'Auteur inconnu'}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {Array.isArray(book.categories) && book.categories.length > 0 ? (
                book.categories.map((category, idx) => (
                  <Badge key={idx} variant="secondary">
                    {category}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary">Non classé</Badge>
              )}
            </div>
            
            {book.published_date && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                {new Date(book.published_date).getFullYear()}
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}