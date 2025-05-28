import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios'; // No longer used directly
import { loginAdmin } from '../../lib/api'; // Added import
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';

// Utilisation de la syntaxe Vite pour les variables d'environnement
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'; // Removed

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Renamed from 'mot_de_passe' to 'password' for consistency with form
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 'password' is the state variable holding the password from the form
      const response = await loginAdmin(email, password); 

      if (response.success && response.admin) { // Check for admin object as well
        // TODO: Implement proper session management (e.g., context, Zustand)
        // For now, just navigate on success. No token is returned by the current backend.
        console.log('Admin login successful:', response.admin);
        navigate('/admin/dashboard');
      } else {
        setError(response.message || 'Identifiants invalides ou erreur inconnue.');
      }
    } catch (error: any) {
      // The loginAdmin function in api.ts already tries to return error.response.data
      // So, if it's a structured error from backend, response should have .success = false
      // This catch block is for network errors or other unexpected issues
      console.error('Login submit error:', error);
      setError('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Container className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-md"
        >
          <Card className="overflow-hidden">
            <div className="bg-accent-600 p-6 text-center text-white">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Shield className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold">Administration</h1>
              <p className="mt-2 text-accent-100">
                Accès réservé aux administrateurs
              </p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 rounded-lg bg-error-50 p-4 text-sm text-error-600 dark:bg-error-900/50 dark:text-error-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Email administrateur
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-accent-500 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-accent-500"
                    placeholder="admin@bibliointel.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-accent-500 focus:ring-accent-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-accent-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent-600 hover:bg-accent-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Cette page est réservée aux administrateurs.{' '}
                <button
                  onClick={() => navigate('/')}
                  className="font-medium text-accent-600 hover:text-accent-500 dark:text-accent-400"
                >
                  Retour à l'accueil
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </Layout>
  );
} 