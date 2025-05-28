import React, { useEffect, useState } from 'react';
import BookGrid from '../components/BookGrid';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/livres';

interface Book {
  id: string;
  titre: string;
  auteur: string;
  image_url: string;
  note: number;
  prix: number;
  categorie: string;
}

const Catalogue: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setBooks(response.data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des livres');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Catalogue
      </h1>
      <BookGrid books={books} loading={loading} />
    </div>
  );
};

export default Catalogue; 