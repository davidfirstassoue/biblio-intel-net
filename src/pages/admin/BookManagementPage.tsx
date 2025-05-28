import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout'; // Adjust path if necessary
import { Container } from '../../components/ui/Container';  // Adjust path if necessary
import { fetchBooks as apiFetchBooks, importBookByIsbn } from '../../../lib/api'; // Adjust path if necessary
import type { Book } from '../../../types/book'; // Adjust path if necessary

export function BookManagementPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isbn, setIsbn] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const loadBooks = async () => { // Made loadBooks a standalone function to be callable
    setIsLoading(true);
    setError(null);
    try {
      const fetchedBooks = await apiFetchBooks();
      setBooks(fetchedBooks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleImportBook = async () => {
    if (!isbn.trim()) {
      setImportError('Veuillez entrer un ISBN.');
      return;
    }
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);
    try {
      const response = await importBookByIsbn(isbn); // Replaced direct call with imported function
      
      if (response.success) { // Adjusted to check response.success
        setImportSuccess(response.message || 'Livre importé avec succès!');
        setIsbn(''); // Clear input
        await loadBooks(); // Refresh book list
      } else {
        setImportError(response.message || 'Erreur lors de l\'importation.');
      }
    } catch (err: any) { // This catch block might be less likely to be hit if importBookByIsbn handles errors well
      console.error('Import error:', err);
      setImportError(err.message || 'Erreur serveur lors de l\'importation.');
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedBooks = await apiFetchBooks();
        setBooks(fetchedBooks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, []);

  return (
    <Layout>
      <Container>
        <div className="py-8">
          <h1 className="text-2xl font-bold mb-6">Gestion des Livres</h1>
          
          <div className="mb-6 p-4 border rounded-lg dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-3">Importer un livre par ISBN</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="Entrez l'ISBN"
                className="flex-grow p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isImporting}
              />
              <button
                onClick={handleImportBook}
                disabled={isImporting || !isbn.trim()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {isImporting ? 'Importation...' : 'Importer'}
              </button>
            </div>
            {importError && <p className="text-red-500 mt-2">{importError}</p>}
            {importSuccess && <p className="text-green-500 mt-2">{importSuccess}</p>}
          </div>

          {isLoading && <p>Chargement des livres...</p>}
          {error && <p className="text-red-500">Erreur: {error}</p>}
          {!isLoading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titre</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Auteur</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ISBN</th>
                    {/* Add more columns if needed */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {books.length > 0 ? books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{book.id}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{book.title}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{book.author}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{book.isbn}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">Aucun livre trouvé.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
}
