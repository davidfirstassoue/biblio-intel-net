import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Moon, Search, Sun, User, X, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { AiChatModal } from '../features/AiChatModal';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { mode, toggleMode } = useThemeStore();
  
  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Catalogue', href: '/catalogue' },
    { name: 'Catégories', href: '/categories' },
    { name: 'Premium', href: '/premium' },
  ];
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };
  
  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80' 
          : 'bg-transparent'
      }`}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-display font-bold text-gray-900 dark:text-white"
            >
              <span className="text-primary-600 dark:text-primary-400">Biblio</span>
              <span>Intel</span>
            </Link>
            
            <div className="hidden md:flex md:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/search" 
              className="flex items-center justify-center rounded-full h-9 w-9 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Search size={20} />
              <span className="sr-only">Rechercher</span>
            </Link>
            
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center justify-center rounded-full h-9 w-9 bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
            >
              <span className="sr-only">Assistant IA</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10L12 14L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 9.3345 4.15875 6.93964 6 5.29168M12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 11.0907 7.22149 10.2338 7.61857 9.48102" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <button
              onClick={toggleMode}
              className="flex items-center justify-center rounded-full h-9 w-9 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="sr-only">Changer de thème</span>
            </button>

            {/* Bouton Admin */}
            <button
              onClick={handleAdminLogin}
              className="flex items-center justify-center rounded-full h-9 w-9 bg-accent-100 text-accent-700 hover:bg-accent-200 dark:bg-accent-900 dark:text-accent-300 dark:hover:bg-accent-800"
              title="Accès administrateur"
            >
              <Shield size={20} />
              <span className="sr-only">Accès administrateur</span>
            </button>
            
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center justify-center rounded-full h-9 w-9 bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                <User size={18} />
                <span className="sr-only">Tableau de bord</span>
              </Link>
            ) : (
              <Link to="/auth/signin">
                <Button size="sm" variant="default">
                  Connexion
                </Button>
              </Link>
            )}
            
            <button
              className="flex md:hidden items-center justify-center rounded-full h-9 w-9 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="sr-only">Menu</span>
            </button>
          </div>
        </nav>
      </Container>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 pt-16">
          <Container className="py-8">
            <div className="flex flex-col space-y-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}

      <AiChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </header>
  );
}