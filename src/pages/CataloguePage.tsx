import { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Layout } from '../components/layout/Layout';
import { fetchBooks as apiFetchBooks } from '../../lib/api';
import type { Book } from '../types/book'; // Assuming this path is correct
import { BookGrid } from '../components/books/BookGrid';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
// import axios from 'axios'; // Removed

// const API_URL = 'http://localhost:3001/api'; // Removed

// Removed local Livre type definition

export function CataloguePage() {
  const [allBooks, setAllBooks] = useState<Book[]>([]); // To store all fetched books
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]); // To display filtered books
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        const booksData = await apiFetchBooks();
        setAllBooks(booksData);
        setFilteredBooks(booksData); // Initially show all books
      } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
        // Optionally set an error state here to display to the user
      } finally {
        setIsLoading(false);
      }
    };
    loadBooks();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredBooks(allBooks); // Show all books if search is empty
      setHasSearched(false);
      return;
    }
    setHasSearched(true);
    setIsLoading(true); // Optional: show loading during client-side filter for consistency
    const lowerCaseQuery = searchQuery.toLowerCase();
    const searchResults = allBooks.filter(book => 
      book.title.toLowerCase().includes(lowerCaseQuery) ||
      (book.author && book.author.toLowerCase().includes(lowerCaseQuery))
      // Add more fields to search if needed, e.g., ISBN, description
    );
    setFilteredBooks(searchResults);
    setIsLoading(false); // Hide loading after filter
  };

  return (
    <Layout>
      <Container>
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <Input
              type="text"
              placeholder="Rechercher un livre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </motion.div>

          {/*isLoading ? ( // isLoading state might still be useful for initial load
            <div className="text-center">Chargement...</div>
          ) : (*/}
            <BookGrid
              books={filteredBooks} // No mapping needed if BookGrid expects Book[] with correct props
              // title="Catalogue" // Optional: Add a title if BookGrid supports it
              // showEmpty={!isLoading && hasSearched && filteredBooks.length === 0} // Refine empty message logic
              // isLoading={isLoading}
            />
          {/*)}*/}
        </div>
      </Container>
    </Layout>
  );
}