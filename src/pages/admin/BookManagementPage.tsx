import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Pencil, Trash2, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  publication_year: string;
  genre: string;
  publisher: string;
  language: string;
  page_count: number;
}

export function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/livres', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setBooks(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des livres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBooks();
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/livres/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setBooks(response.data);
    } catch (error) {
      setError('Erreur lors de la recherche');
    }
  };

  const handleDelete = async (bookId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/livres/${bookId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setBooks(books.filter(book => book.id !== bookId));
    } catch (error) {
      setError('Erreur lors de la suppression du livre');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <Container className="py-8">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Gestion des livres</h1>
          </div>
          <Button onClick={() => navigate('/admin/books/new')} className="flex items-center gap-2">
            <Plus size={20} />
            Nouveau livre
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Rechercher un livre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search size={20} />
              Rechercher
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Titre</th>
                  <th className="px-6 py-4">Auteur</th>
                  <th className="px-6 py-4">Année</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Éditeur</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4 dark:text-gray-300">{book.id}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{book.title}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{book.author}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{book.publication_year}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{book.genre}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{book.publisher}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </Layout>
  );
} 