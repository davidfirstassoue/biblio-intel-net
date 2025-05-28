import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Users, Book, Clock, BarChart, Settings } from 'lucide-react';
import axios from 'axios';

export function AdminDashboardPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const verifyAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAdmin(response.data.admin);
      } catch (error) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

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

  const stats = [
    { label: 'Utilisateurs actifs', value: '1,234', icon: Users, color: 'text-blue-500' },
    { label: 'Livres disponibles', value: '5,678', icon: Book, color: 'text-green-500' },
    { label: 'Emprunts en cours', value: '89', icon: Clock, color: 'text-amber-500' },
    { label: 'Visites aujourd\'hui', value: '456', icon: BarChart, color: 'text-purple-500' },
  ];

  const actions = [
    { label: 'Gestion des utilisateurs', icon: Users, href: '/admin/users' },
    { label: 'Gestion des livres', icon: Book, href: '/admin/books' },
    { label: 'Gestion des emprunts', icon: Clock, href: '/admin/loans' },
    { label: 'Paramètres système', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <Layout>
      <Container className="py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-700">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord administrateur</h1>
              <p className="text-gray-600 dark:text-white">
                Bienvenue, {admin?.name || 'Administrateur'}
              </p>
            </div>
          </div>
          
          <Button onClick={handleLogout} variant="outline">
            Déconnexion
          </Button>
        </div>

        {/* Statistiques */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-white">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`rounded-full bg-gray-100 p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Actions rapides */}
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Actions rapides</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.href)}
              className="group rounded-xl border-2 border-gray-200 p-6 transition-all hover:border-accent-500 dark:border-gray-700 dark:hover:border-accent-500"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-accent-100 group-hover:text-accent-700 dark:bg-gray-800 dark:text-white dark:group-hover:bg-accent-900 dark:group-hover:text-accent-100">
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">{action.label}</h3>
            </button>
          ))}
        </div>
      </Container>
    </Layout>
  );
} 