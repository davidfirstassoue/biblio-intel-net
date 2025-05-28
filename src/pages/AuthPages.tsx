import { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Layout } from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signIn, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (user) {
    return <Navigate to="/" />;
  }
  
  const from = location.state?.from?.pathname || '/';
  
  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('L\'email est requis');
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError('Email invalide');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Le mot de passe est requis');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };
  
  return (
    <Layout>
      <Container size="sm" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mx-auto max-w-md overflow-hidden">
            <div className="bg-primary-600 p-6 text-white dark:bg-primary-700">
              <h1 className="text-center text-2xl font-bold">Connexion</h1>
              <p className="mt-2 text-center text-primary-100">
                Accédez à votre compte BiblioIntel
              </p>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 rounded-lg bg-error-50 p-4 text-error-800 dark:bg-error-900/50 dark:text-error-200">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  placeholder="votre@email.com"
                  disabled={isLoading}
                />
                
                <Input
                  id="password"
                  type="password"
                  label="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:focus:ring-primary-600"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                    >
                      Se souvenir de moi
                    </label>
                  </div>
                  
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
                
                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Vous n'avez pas de compte ?{' '}
                <Link
                  to="/auth/signup"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  S'inscrire
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </Container>
    </Layout>
  );
}

export function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp, isLoading, error, user } = useAuthStore();
  
  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (user) {
    return <Navigate to="/" />;
  }
  
  const validateForm = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('L\'email est requis');
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError('Email invalide');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!password) {
      setPasswordError('Le mot de passe est requis');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Veuillez confirmer votre mot de passe');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    }
  };
  
  return (
    <Layout>
      <Container size="sm" className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mx-auto max-w-md overflow-hidden">
            <div className="bg-primary-600 p-6 text-white dark:bg-primary-700">
              <h1 className="text-center text-2xl font-bold">Inscription</h1>
              <p className="mt-2 text-center text-primary-100">
                Créez votre compte BiblioIntel
              </p>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-6 rounded-lg bg-error-50 p-4 text-error-800 dark:bg-error-900/50 dark:text-error-200">
                  {error}
                </div>
              )}
              
              {success ? (
                <div className="rounded-lg bg-success-50 p-6 text-center text-success-800 dark:bg-success-900/50 dark:text-success-200">
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-success-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mb-2 text-lg font-semibold">Inscription réussie !</h3>
                  <p className="mb-4">
                    Un email de confirmation a été envoyé à <strong>{email}</strong>.
                    Veuillez vérifier votre boîte de réception et suivre les instructions pour activer votre compte.
                  </p>
                  <div className="mt-6">
                    <Link to="/auth/signin">
                      <Button>Se connecter</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    id="email"
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    placeholder="votre@email.com"
                    disabled={isLoading}
                  />
                  
                  <Input
                    id="password"
                    type="password"
                    label="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={passwordError}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  
                  <Input
                    id="confirmPassword"
                    type="password"
                    label="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={confirmPasswordError}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  
                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:focus:ring-primary-600"
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                    >
                      J'accepte les{' '}
                      <a
                        href="#"
                        className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        conditions d'utilisation
                      </a>
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                  </Button>
                  
                  <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    Vous avez déjà un compte ?{' '}
                    <Link
                      to="/auth/signin"
                      className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Se connecter
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </motion.div>
      </Container>
    </Layout>
  );
}