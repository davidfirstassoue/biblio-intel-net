import { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout } from '../../components/layout/Layout';
import { Container } from '../../components/ui/Container';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SystemSettings {
  loan_duration_days: number;
  max_loans_per_user: number;
  late_fee_per_day: number;
  email_notifications_enabled: boolean;
  maintenance_mode: boolean;
  backup_frequency_days: number;
}

export function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    loan_duration_days: 14,
    max_loans_per_user: 3,
    late_fee_per_day: 0.50,
    email_notifications_enabled: true,
    maintenance_mode: false,
    backup_frequency_days: 7
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/settings', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setSettings(response.data);
    } catch (error) {
      setError('Erreur lors de la récupération des paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await axios.put('http://localhost:3001/api/admin/settings', settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
      });
      setSuccessMessage('Paramètres mis à jour avec succès');
    } catch (error) {
      setError('Erreur lors de la mise à jour des paramètres');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
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
            <h1 className="text-2xl font-bold">Paramètres système</h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-600">
            {successMessage}
          </div>
        )}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Durée d'emprunt (jours)
                </label>
                <input
                  type="number"
                  name="loan_duration_days"
                  value={settings.loan_duration_days}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:outline-none"
                  min="1"
                  max="60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Emprunts maximum par utilisateur
                </label>
                <input
                  type="number"
                  name="max_loans_per_user"
                  value={settings.max_loans_per_user}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:outline-none"
                  min="1"
                  max="10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Pénalité de retard par jour (€)
                </label>
                <input
                  type="number"
                  name="late_fee_per_day"
                  value={settings.late_fee_per_day}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:outline-none"
                  min="0"
                  step="0.10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Fréquence des sauvegardes (jours)
                </label>
                <input
                  type="number"
                  name="backup_frequency_days"
                  value={settings.backup_frequency_days}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-primary-500 focus:outline-none"
                  min="1"
                  max="30"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="email_notifications_enabled"
                  checked={settings.email_notifications_enabled}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-900">
                  Activer les notifications par email
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-900">
                  Mode maintenance
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Save size={20} />
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      </Container>
    </Layout>
  );
} 