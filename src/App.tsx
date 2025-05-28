import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { SignInPage, SignUpPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { PremiumPage } from './pages/PremiumPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import Catalogue from './pages/Catalogue';
import AjoutsRecents from './pages/AjoutsRecents';
import { CategoryPage } from './components/CategoryPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { BookManagementPage } from './pages/admin/BookManagementPage';
import { LoanManagementPage } from './pages/admin/LoanManagementPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const { mode } = useThemeStore();
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold text-gray-800 dark:text-white">
                
              </div>
              <div className="space-x-4">
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  
                </Link>
                <Link
                  to="/ajouts-recents"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/livre/:id" element={<BookDetailsPage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/ajouts-recents" element={<AjoutsRecents />} />
          <Route path="/categories/:category" element={<CategoryPage />} />
          
          {/* Routes Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/books" element={<BookManagementPage />} />
          <Route path="/admin/loans" element={<LoanManagementPage />} />
          <Route path="/admin/settings" element={<SystemSettingsPage />} />
          
          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;