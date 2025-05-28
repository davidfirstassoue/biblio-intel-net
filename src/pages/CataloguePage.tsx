import { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { Layout } from '../components/layout/Layout';
import { BookGrid } from '../components/books/BookGrid';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export type Livre = {
  id: number;
  titre: string;
  auteur: string;
  description: string;
  isbn: string;
  image_url: string;
  date_publication: string;
  editeur: string;
  nombre_pages: number;
  langue: string;
};

export function CataloguePage() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    const fetchLivres = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/livres`);
        setLivres(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLivres();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await axios.get(`${API_URL}/livres/search?q=${encodeURIComponent(searchQuery)}`);
      setLivres(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsLoading(false);
    }
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

          {isLoading ? (
            <div className="text-center">Chargement...</div>
          ) : (
            <BookGrid
              books={livres.map(livre => ({
                id: livre.id.toString(),
                title: livre.titre,
                author: livre.auteur,
                coverUrl: livre.image_url,
                description: livre.description
              }))}
            />
          )}
        </div>
      </Container>
    </Layout>
  );
}