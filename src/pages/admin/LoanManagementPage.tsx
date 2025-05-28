import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Check, X, ArrowLeft, Search, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Loan {
  id: number;
  user_id: number;
  book_id: number;
  user_name: string;
  book_title: string;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: 'en cours' | 'retourné' | 'en retard';
}

export function LoanManagementPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'late' | 'returned'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/loans', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setLoans(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des emprunts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchLoans();
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/admin/loans/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setLoans(response.data);
    } catch (error) {
      setError('Erreur lors de la recherche');
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      await axios.post(`http://localhost:3001/api/admin/loans/${loanId}/return`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchLoans(); // Rafraîchir la liste
    } catch (error) {
      setError('Erreur lors du retour du livre');
    }
  };

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'en cours':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/50';
      case 'retourné':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/50';
      case 'en retard':
        return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/50';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
    }
  };

  const filteredLoans = loans.filter(loan => {
    switch (filter) {
      case 'active':
        return loan.status === 'en cours';
      case 'late':
        return loan.status === 'en retard';
      case 'returned':
        return loan.status === 'retourné';
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <Container className="py-8">
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Gestion des emprunts</h1>
          </div>
          <Button onClick={() => navigate('/admin/loans/new')} className="flex items-center gap-2">
            <Plus size={20} />
            Nouvel emprunt
          </Button>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <input
              type="text"
              placeholder="Rechercher un emprunt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 p-2 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search size={20} />
              Rechercher
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Tous
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
            >
              En cours
            </Button>
            <Button
              variant={filter === 'late' ? 'default' : 'outline'}
              onClick={() => setFilter('late')}
            >
              En retard
            </Button>
            <Button
              variant={filter === 'returned' ? 'default' : 'outline'}
              onClick={() => setFilter('returned')}
            >
              Retournés
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left text-sm font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Livre</th>
                  <th className="px-6 py-4">Date d'emprunt</th>
                  <th className="px-6 py-4">Date de retour prévue</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map(loan => (
                  <tr key={loan.id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4 dark:text-gray-300">{loan.id}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{loan.user_name}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{loan.book_title}</td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {new Date(loan.borrow_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {new Date(loan.due_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-sm ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {loan.status === 'en cours' && (
                          <button
                            onClick={() => handleReturn(loan.id)}
                            className="rounded p-1 text-green-600 hover:bg-green-50"
                            title="Marquer comme retourné"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {loan.status === 'en retard' && (
                          <>
                            <button
                              onClick={() => handleReturn(loan.id)}
                              className="rounded p-1 text-green-600 hover:bg-green-50"
                              title="Marquer comme retourné"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              className="rounded p-1 text-orange-600 hover:bg-orange-50"
                              title="Envoyer un rappel"
                            >
                              <Clock size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Container>
    </Layout>
  );
} 