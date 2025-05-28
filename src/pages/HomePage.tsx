import { useState, useEffect } from 'react';
import { Container } from '../components/ui/Container';
import { BookGrid } from '../components/books/BookGrid';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import type { Book } from '../types/book';
import { BookCard } from '../components/BookCard';
import { Loader } from '../components/ui/Loader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/books`);
        if (response.data.success) {
          setBooks(response.data.books);
        } else {
          setError('Erreur lors de la récupération des livres');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Charger les livres populaires
        const popularResponse = await axios.get('http://localhost:3001/api/books/populaires');
        console.log('Livres populaires reçus:', popularResponse.data);
        setPopularBooks(popularResponse.data);
        
        // Charger les livres récents
        const recentResponse = await axios.get('http://localhos²t:3001/api/books/recent');
        console.log('Livres récents reçus:', recentResponse.data);
        setRecentBooks(recentResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  const categories = [
    { name: 'Romans', icon: '📚' },
    { name: 'Science Fiction', icon: '🚀' },
    { name: 'Histoire', icon: '🏛️' },
    { name: 'Biographies', icon: '👤' },
    { name: 'Sciences', icon: '🔬' },
    { name: 'Art', icon: '🎨' },
  ];
  
  return (
    <Layout fullWidth>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent"></div>
        
        <Container className="relative z-10 py-20 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Découvrez la bibliothèque du{' '}
                <span className="bg-gradient-to-r from-accent-400 to-secondary-400 bg-clip-text text-transparent">
                  futur
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-200 md:text-xl">
                Une expérience de lecture révolutionnaire avec intelligence artificielle intégrée et recherche optimisée.
              </p>
              <div className="mt-8 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button
                  size="lg"
                  onClick={() => navigate('/catalogue')}
                  className="bg-white text-primary-800 hover:bg-gray-100 dark:bg-primary-100 dark:text-primary-900 dark:hover:bg-primary-200"
                >
                  Explorer le catalogue
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/premium')}
                  className="border-white text-white hover:bg-white/10"
                >
                  Découvrir Premium
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto hidden md:block"
            >
              <div className="relative mx-auto w-full max-w-md">
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                  <img
                    src="https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt="Bibliothèque intelligente"
                    className="h-full w-full rounded object-cover"
                  />
                </div>
                
                <motion.div
                  initial={{ x: -20, y: 20, opacity: 0 }}
                  animate={{ x: -40, y: 40, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="absolute -bottom-6 -left-6 rounded-lg bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-900/80"
                >
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-primary-100 p-1 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Recherche instantanée
                    </span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ x: 20, y: -20, opacity: 0 }}
                  animate={{ x: 40, y: -40, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute -right-6 -top-6 rounded-lg bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-900/80"
                >
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-accent-100 p-1 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      IA intégrée
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
      
      {/* Categories Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Explorez par catégorie
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Découvrez notre vaste collection organisée par thèmes
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div 
                  className="group flex cursor-pointer flex-col items-center rounded-lg bg-white p-6 text-center transition-all hover:shadow-md dark:bg-gray-800"
                  onClick={() => navigate(`/categories/${category.name.toLowerCase()}`)}
                >
                  <span className="mb-4 text-4xl">{category.icon}</span>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Popular Books Section */}
      <section className="py-16">
        <Container>
          <BookGrid
            books={popularBooks}
            title="Livres populaires"
            showEmpty={!loading}
            isLoading={loading}
          />
          
          {popularBooks.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/catalogue')}
              >
                Voir plus de livres
              </Button>
            </div>
          )}
        </Container>
      </section>
      
      {/* Recent Books Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-900">
        <Container>
          <BookGrid
            books={recentBooks}
            title="Ajouts récents"
            showEmpty={!loading}
            isLoading={loading}
          />
          
          {recentBooks.length > 0 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/catalogue')}
              >
                Voir plus de livres
              </Button>
            </div>
          )}
        </Container>
      </section>
      
      {/* Premium Section */}
      <section className="py-16">
        <Container>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 p-1">
            <div className="rounded-xl bg-white p-8 dark:bg-gray-900">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                    Passez à{' '}
                    <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                      Premium
                    </span>
                  </h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Accédez à des milliers de livres, de cours et de certifications pour seulement 2000 FCFA par mois ou 18000 FCFA par an.
                  </p>
                  <ul className="mt-6 space-y-2">
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-success-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        Accès illimité à tous les livres
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-success-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        Cours exclusifs en ligne
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-success-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        Certifications Google, Microsoft, Oracle
                      </span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 text-success-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">
                        Assistant IA personnalisé
                      </span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Button
                      size="lg"
                      onClick={() => navigate('/premium')}
                    >
                      Commencer maintenant
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative ml-auto aspect-square w-full max-w-md rounded-2xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 p-1"
                  >
                    <div className="h-full w-full overflow-hidden rounded-xl bg-white dark:bg-gray-800">
                      <img
                        src="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="BiblioIntel Premium"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute -right-4 top-1/4 max-w-[200px] rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="rounded-full bg-success-100 p-1 text-success-600 dark:bg-success-900 dark:text-success-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Accès complet aux cours
                      </span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute -left-4 bottom-1/4 max-w-[200px] rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="rounded-full bg-accent-100 p-1 text-accent-600 dark:bg-accent-900 dark:text-accent-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Certifications reconnues
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}