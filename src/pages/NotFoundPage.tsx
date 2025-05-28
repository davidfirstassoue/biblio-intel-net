import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-primary-600">404</h1>
          <h2 className="mb-4 text-2xl font-semibold">Page non trouvée</h2>
          <p className="mb-8 text-gray-600">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft size={20} />
            Retour à l'accueil
          </Button>
        </div>
      </Container>
    </Layout>
  );
} 