import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  role: string;
}

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setUsers(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

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
            <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          </div>
          <Button onClick={() => navigate('/admin/users/new')} className="flex items-center gap-2">
            <Plus size={20} />
            Nouvel utilisateur
          </Button>
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
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4">Date d'inscription</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b dark:border-gray-700">
                    <td className="px-6 py-4 dark:text-gray-300">{user.id}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{user.name}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 dark:text-gray-300">{user.role}</td>
                    <td className="px-6 py-4 dark:text-gray-300">
                      {new Date(user.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded p-1 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
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