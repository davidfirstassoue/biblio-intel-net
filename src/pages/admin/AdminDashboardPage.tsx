import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Shield, Users, Book, Clock, BarChart, Settings } from 'lucide-react';

interface DashboardStats {
  activeUsers: number;
  totalBooks: number;
  activeLoans: number;
  todayVisits: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    activeUsers: 0,
    totalBooks: 0,
    activeLoans: 0,
    todayVisits: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchDashboardStats();
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <Layout>
        <Container className="py-16">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
                <p className="text-gray-600 dark:text-gray-300">Bienvenue, David First</p>
              </div>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Déconnexion
          </Button>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Book className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Livres disponibles</p>
                <p className="text-2xl font-bold">{stats.totalBooks}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Emprunts en cours</p>
                <p className="text-2xl font-bold">{stats.activeLoans}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <BarChart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Visites aujourd'hui</p>
                <p className="text-2xl font-bold">{stats.todayVisits}</p>
              </div>
            </div>
          </Card>
        </div>

        <h2 className="mb-4 text-xl font-semibold">Actions rapides</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            className="cursor-pointer p-6 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/admin/users')}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Gestion des utilisateurs</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Gérer les comptes utilisateurs</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer p-6 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/admin/books')}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Book className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Gestion des livres</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Gérer le catalogue</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer p-6 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/admin/loans')}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Gestion des emprunts</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Suivre les emprunts</p>
              </div>
            </div>
          </Card>

          <Card
            className="cursor-pointer p-6 transition-colors hover:bg-gray-50"
            onClick={() => navigate('/admin/settings')}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Paramètres système</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Configurer l'application</p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Layout>
  );
} 