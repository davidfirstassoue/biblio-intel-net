import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { motion } from 'framer-motion';
import { BookGrid } from '../components/books/BookGrid';
import { supabase } from '../lib/supabase';
import type { Book } from '../types/book';

export function DashboardPage() {
  const { user, signOut, updateProfile } = useAuthStore();
  const { mode, setMode, color, setColor } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'history' | 'settings'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [history, setHistory] = useState<Book[]>([]);
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!user) {
    return <Navigate to="/auth/signin" />;
  }
  
  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        name,
        avatarUrl,
      });
      
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Une erreur est survenue lors de la mise à jour du profil.');
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Données fictives pour les favoris et l'historique
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Les Misérables',
      author: 'Victor Hugo',
      description: 'Un chef-d\'œuvre de la littérature française',
      categories: ['Roman', 'Classique'],
      coverUrl: 'https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=600',
      publishedDate: '1862',
      publisher: 'Éditions XYZ',
      pageCount: 1488,
      language: 'fr',
      isbn: '9781234567897',
      rating: 4.8,
      price: 25,
      currency: 'EUR',
      availability: 'disponible',
      source: 'manual',
    },
    {
      id: '2',
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      description: 'Une œuvre poétique et philosophique',
      categories: ['Fiction', 'Philosophie'],
      coverUrl: 'https://images.pexels.com/photos/1738598/pexels-photo-1738598.jpeg?auto=compress&cs=tinysrgb&w=600',
      publishedDate: '1943',
      publisher: 'Éditions XYZ',
      pageCount: 96,
      language: 'fr',
      isbn: '9782345678901',
      rating: 4.9,
      price: 15,
      currency: 'EUR',
      availability: 'disponible',
      source: 'manual',
    },
  ];
  
  return (
    <Layout>
      <Container className="py-16">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl font-bold text-gray-900 dark:text-white"
          >
            Tableau de bord
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-gray-600 dark:text-gray-400"
          >
            Gérez votre compte et vos préférences
          </motion.p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-[240px_1fr]">
          <Card className="h-fit md:sticky md:top-24">
            <div className="p-4">
              <nav className="space-y-1">
                <button
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profil
                </button>
                
                <button
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    activeTab === 'favorites'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('favorites')}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Favoris
                </button>
                
                <button
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    activeTab === 'history'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Historique
                </button>
                
                <button
                  className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Paramètres
                </button>
                
                <hr className="my-4 border-gray-200 dark:border-gray-800" />
                
                <button
                  className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={handleSignOut}
                >
                  <svg
                    className="mr-3 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Se déconnecter
                </button>
              </nav>
            </div>
          </Card>
          
          <div>
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={name || 'Avatar'}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-2xl font-medium text-gray-500 dark:text-gray-400">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {name || 'Utilisateur'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                      <Badge className="mt-2" variant="outline">
                        Utilisateur gratuit
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      id="name"
                      label="Nom"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre nom"
                    />
                    
                    <Input
                      id="email"
                      label="Email"
                      value={user.email}
                      disabled
                      placeholder="votre@email.com"
                    />
                    
                    <Input
                      id="avatarUrl"
                      label="URL de l'avatar"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://exemple.com/avatar.jpg"
                    />
                    
                    <div className="flex justify-end">
                      <Button onClick={handleUpdateProfile}>
                        Mettre à jour le profil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'favorites' && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                  Mes favoris
                </h2>
                <BookGrid
                  books={mockBooks}
                  showEmpty={true}
                  emptyMessage="Vous n'avez pas encore de favoris"
                />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div>
                <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                  Historique de lecture
                </h2>
                <BookGrid
                  books={mockBooks}
                  showEmpty={true}
                  emptyMessage="Votre historique est vide"
                />
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                        Thème
                      </h3>
                      <div className="flex items-center space-x-4">
                        <button
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                            mode === 'light'
                              ? 'border-primary-600 bg-white text-primary-600 ring-2 ring-primary-600/30'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => setMode('light')}
                          aria-label="Mode clair"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                        </button>
                        
                        <button
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                            mode === 'dark'
                              ? 'border-primary-600 bg-gray-900 text-primary-400 ring-2 ring-primary-600/30'
                              : 'border-gray-300 bg-gray-900 text-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600'
                          }`}
                          onClick={() => setMode('dark')}
                          aria-label="Mode sombre"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                        Couleur principale
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        <button
                          className={`h-8 w-8 rounded-full bg-primary-600 ${
                            color === 'primary' ? 'ring-2 ring-primary-600/30 ring-offset-2 dark:ring-offset-gray-900' : ''
                          }`}
                          onClick={() => setColor('primary')}
                          aria-label="Couleur primaire"
                        />
                        <button
                          className={`h-8 w-8 rounded-full bg-secondary-600 ${
                            color === 'secondary' ? 'ring-2 ring-secondary-600/30 ring-offset-2 dark:ring-offset-gray-900' : ''
                          }`}
                          onClick={() => setColor('secondary')}
                          aria-label="Couleur secondaire"
                        />
                        <button
                          className={`h-8 w-8 rounded-full bg-accent-600 ${
                            color === 'accent' ? 'ring-2 ring-accent-600/30 ring-offset-2 dark:ring-offset-gray-900' : ''
                          }`}
                          onClick={() => setColor('accent')}
                          aria-label="Couleur d'accent"
                        />
                        <button
                          className={`h-8 w-8 rounded-full bg-purple-600 ${
                            color === 'purple' ? 'ring-2 ring-purple-600/30 ring-offset-2 dark:ring-offset-gray-900' : ''
                          }`}
                          onClick={() => setColor('purple')}
                          aria-label="Couleur violette"
                        />
                        <button
                          className={`h-8 w-8 rounded-full bg-pink-600 ${
                            color === 'pink' ? 'ring-2 ring-pink-600/30 ring-offset-2 dark:ring-offset-gray-900' : ''
                          }`}
                          onClick={() => setColor('pink')}
                          aria-label="Couleur rose"
                        />
                        <button
                          className={`h-8 w-8 rounded-full bg-teal-600 ${
                            color === 'teal' ? 'ring-2 ring-teal-600/30 ring-offset-2 dark:ring-offset-gray-900' : ''
                          }`}
                          onClick={() => setColor('teal')}
                          aria-label="Couleur teal"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de contenu</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                        Catégories préférées
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Romans</Badge>
                        <Badge variant="secondary">Science Fiction</Badge>
                        <Badge variant="secondary">Histoire</Badge>
                        <Badge variant="outline">+ Ajouter</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                        Auteurs préférés
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Victor Hugo</Badge>
                        <Badge variant="secondary">Albert Camus</Badge>
                        <Badge variant="outline">+ Ajouter</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Abonnement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border border-warning-200 bg-warning-50 p-4 dark:border-warning-900 dark:bg-warning-900/30">
                      <div className="flex items-center">
                        <div className="mr-4 flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-warning-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-warning-800 dark:text-warning-300">
                            Vous utilisez le plan gratuit
                          </h4>
                          <p className="mt-1 text-xs text-warning-700 dark:text-warning-400">
                            Passez à Premium pour accéder à toutes les fonctionnalités et au contenu exclusif.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                      <h4 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                        BiblioIntel Premium
                      </h4>
                      <ul className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 text-success-500"
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
                          Accès illimité à tous les livres
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 text-success-500"
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
                          Cours exclusifs en ligne
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 text-success-500"
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
                          Certifications reconnues
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="mr-2 h-4 w-4 text-success-500"
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
                          Assistant IA personnalisé
                        </li>
                      </ul>
                      <div className="mb-4 flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          2000 FCFA
                        </span>
                        <span className="ml-1 text-gray-600 dark:text-gray-400">/mois</span>
                      </div>
                      <Button fullWidth>S'abonner maintenant</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}