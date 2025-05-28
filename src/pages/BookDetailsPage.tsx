import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BookGrid } from '../components/books/BookGrid';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getBookDetails, getSimilarBooks } from '../lib/api';
import { motion } from 'framer-motion';
import { BookOpen, Heart, ShoppingCart, Star } from 'lucide-react';
import type { Book } from '../types/book';

export function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');
  
  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      
      try {
        if (id) {
          const bookData = await getBookDetails(id);
          setBook(bookData);
          
          if (bookData) {
            const similar = await getSimilarBooks(id);
            setSimilarBooks(similar);
          }
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);
  
  if (isLoading) {
    return (
      <Layout>
        <Container className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement en cours...</p>
          </div>
        </Container>
      </Layout>
    );
  }
  
  if (!book) {
    return (
      <Layout>
        <Container className="py-16">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Livre non trouvé
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
              Le livre que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Link to="/catalogue">
              <Button>Retour au catalogue</Button>
            </Link>
          </div>
        </Container>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Container className="py-16">
        <div className="mb-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 overflow-hidden rounded-lg shadow-lg">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-96 w-full items-center justify-center bg-gray-200 dark:bg-gray-800">
                  <span className="text-gray-400 dark:text-gray-600">
                    Image non disponible
                  </span>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {book.categories?.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            
            <h1 className="mb-2 font-display text-3xl font-bold text-gray-900 dark:text-white">
              {book.title}
            </h1>
            
            <p className="mb-4 text-xl text-gray-700 dark:text-gray-300">
              par <span className="font-medium">{book.author}</span>
            </p>
            
            <div className="mb-6 flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={`${
                    i < Math.round(book.rating)
                      ? 'fill-warning-500 text-warning-500'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {book.rating} / 5
              </span>
            </div>
            
            <div className="mb-8 flex flex-wrap gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400">Publié par</span>
                <span className="font-medium">{book.publisher || 'Non spécifié'}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400">Date de publication</span>
                <span className="font-medium">{book.publishedDate || 'Non spécifiée'}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pages</span>
                <span className="font-medium">{book.pageCount || 'Non spécifié'}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 dark:text-gray-400">ISBN</span>
                <span className="font-medium">{book.isbn || 'Non spécifié'}</span>
              </div>
            </div>
            
            {book.price > 0 && (
              <div className="mb-8 rounded-lg bg-primary-50 p-4 dark:bg-primary-900/30">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Prix</p>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {book.price} {book.currency}
                    </p>
                  </div>
                  <Badge
                    variant={book.availability === 'disponible' ? 'success' : 'warning'}
                    className="text-sm"
                  >
                    {book.availability === 'disponible' ? 'En stock' : 'Épuisé'}
                  </Badge>
                </div>
              </div>
            )}
            
            <div className="mb-8 flex flex-wrap gap-4">
              <Button size="lg">
                <BookOpen size={18} className="mr-2" />
                Lire un extrait
              </Button>
              
              <Button size="lg" variant="accent">
                <ShoppingCart size={18} className="mr-2" />
                Ajouter au panier
              </Button>
              
              <Button size="lg" variant="outline">
                <Heart size={18} className="mr-2" />
                Ajouter aux favoris
              </Button>
            </div>
            
            <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex space-x-8">
                <button
                  className={`py-2 text-sm font-medium ${
                    activeTab === 'description'
                      ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button
                  className={`py-2 text-sm font-medium ${
                    activeTab === 'details'
                      ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Détails
                </button>
              </div>
            </div>
            
            <div className="prose max-w-none dark:prose-invert">
              {activeTab === 'description' ? (
                <p>{book.description || 'Aucune description disponible.'}</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Titre
                      </h3>
                      <p>{book.title}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Auteur
                      </h3>
                      <p>{book.author}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Éditeur
                      </h3>
                      <p>{book.publisher || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Date de publication
                      </h3>
                      <p>{book.publishedDate || 'Non spécifiée'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Langue
                      </h3>
                      <p>{book.language === 'fr' ? 'Français' : book.language}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        ISBN
                      </h3>
                      <p>{book.isbn || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Pages
                      </h3>
                      <p>{book.pageCount || 'Non spécifié'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Source
                      </h3>
                      <p className="capitalize">{book.source || 'Non spécifiée'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Commentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="mb-6 font-display text-2xl font-semibold text-gray-900 dark:text-white">
            Commentaires
          </h2>
          
          <Card>
            <CardHeader>
              <CardTitle>Partagez votre avis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="comment" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Votre commentaire
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
                  placeholder="Écrivez votre commentaire ici..."
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Note
                </label>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} className="p-1 text-gray-300 hover:text-warning-500 dark:text-gray-600 dark:hover:text-warning-500">
                      <Star size={24} />
                    </button>
                  ))}
                </div>
              </div>
              <Button>Soumettre</Button>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Aucun commentaire pour le moment. Soyez le premier à donner votre avis !
            </p>
          </div>
        </motion.div>
        
        {/* Livres similaires */}
        {similarBooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <BookGrid
              books={similarBooks}
              title="Livres similaires"
              showEmpty={false}
            />
          </motion.div>
        )}
      </Container>
    </Layout>
  );
}