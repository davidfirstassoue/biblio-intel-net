import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Layout } from './layout/Layout';
import { Container } from './ui/Container';
import { BookCard } from './BookCard';
import { Loader } from './ui/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

interface CategoryInfo {
  name: string;
  icon: string;
  description: string;
}

const categoryInfo: Record<string, CategoryInfo> = {
  romans: {
    name: 'Romans',
    icon: '📚',
    description: 'Découvrez notre collection de romans captivants, des classiques aux nouveautés.'
  },
  'science-fiction': {
    name: 'Science Fiction',
    icon: '🚀',
    description: 'Explorez des mondes futuristes et des aventures spatiales extraordinaires.'
  },
  histoire: {
    name: 'Histoire',
    icon: '🏛️',
    description: 'Plongez dans le passé avec notre sélection de livres historiques.'
  },
  biographies: {
    name: 'Biographies',
    icon: '👤',
    description: 'Découvrez des vies extraordinaires à travers nos biographies inspirantes.'
  },
  sciences: {
    name: 'Sciences',
    icon: '🔬',
    description: 'Explorez le monde fascinant des sciences et des découvertes.'
  },
  art: {
    name: 'Art',
    icon: '🎨',
    description: 'Admirez les plus belles œuvres et apprenez les techniques artistiques.'
  }
};

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const info = category ? categoryInfo[category] : null;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/books/category/${category}`);
        if (response.data.success) {
          setBooks(response.data.books);
          setError(null);
        } else {
          setError(response.data.message || 'Erreur lors de la récupération des livres');
          setBooks([]);
        }
      } catch (error: any) {
        console.error('Erreur:', error);
        setError(error.response?.data?.message || 'Erreur de connexion au serveur');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchBooks();
    }
  }, [category]);

  if (!info) {
    return (
      <Layout>
        <Container className="py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-error-600">
              Catégorie non trouvée
            </h1>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-16">
        <div className="mb-12 text-center">
          <div className="mb-4 text-6xl">{info.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {info.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {info.description}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : error ? (
          <div className="bg-error-50 text-error-600 p-4 rounded-lg">
            {error}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Aucun livre trouvé dans cette catégorie.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
} 