import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';

export function Footer() {
  return (
    <footer className="bg-gray-100 py-12 dark:bg-gray-900">
      <Container>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link 
              to="/" 
              className="flex items-center text-xl font-display font-bold text-gray-900 dark:text-white"
            >
              <span className="text-primary-600 dark:text-primary-400">Biblio</span>
              <span>Intel</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Une bibliothèque numérique intelligente avec recherche optimisée et IA intégrée.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/catalogue" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  Catégories
                </Link>
              </li>
              <li>
                <Link 
                  to="/premium" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  Premium
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Légal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link 
                  to="/mentions-legales" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link 
                  to="/confidentialite" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link 
                  to="/cgv" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  CGV
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a 
                  href="mailto:contact@bibliointel.com" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  bibliointel@gmail.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+24177998202" 
                  className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                >
                  +241 77 99 82 02
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} BiblioIntel. Tous droits réservés.
          </p>
        </div>
      </Container>
    </footer>
  );
}