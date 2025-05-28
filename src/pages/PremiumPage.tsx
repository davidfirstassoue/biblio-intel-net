import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Check, Star } from 'lucide-react';

const features = [
  {
    icon: '📚',
    title: 'Accès illimité',
    description: 'Profitez d\'un accès illimité à notre bibliothèque complète'
  },
  {
    icon: '🎓',
    title: 'Cours exclusifs',
    description: 'Accédez à des cours en ligne de qualité professionnelle'
  },
  {
    icon: '🤖',
    title: 'Assistant IA avancé',
    description: 'Un assistant personnel alimenté par l\'IA pour des recommandations personnalisées'
  },
  {
    icon: '📱',
    title: 'Multi-appareils',
    description: 'Synchronisez votre bibliothèque sur tous vos appareils'
  }
];

const plans = [
  {
    name: 'Mensuel',
    price: '2000',
    period: 'par mois',
    features: [
      'Accès à tous les livres',
      'Cours en ligne',
      'Assistant IA',
      'Support premium',
      'Téléchargements illimités'
    ],
    popular: false
  },
  {
    name: 'Annuel',
    price: '18000',
    period: 'par an',
    features: [
      'Tous les avantages mensuels',
      '2 mois gratuits',
      'Accès prioritaire aux nouveautés',
      'Contenu exclusif',
      'Webinaires mensuels'
    ],
    popular: true
  }
];

export function PremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState('annual');

  return (
    <Layout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <Container className="py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-6 font-display text-4xl font-bold md:text-6xl">
              Passez à{' '}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                Premium
              </span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Débloquez l'accès à des milliers de livres, cours et certifications.
              Enrichissez vos connaissances sans limites.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 font-display text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className={`relative rounded-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 p-1'
                    : 'border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="relative h-full rounded-xl bg-white p-8 dark:bg-gray-900">
                  {plan.popular && (
                    <div className="absolute -top-4 right-4 rounded-full bg-accent-500 px-3 py-1 text-sm font-medium text-white">
                      Populaire
                    </div>
                  )}
                  
                  <h3 className="mb-4 font-display text-2xl font-bold">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="font-display text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400"> FCFA </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                  
                  <ul className="mb-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="mr-3 h-5 w-5 text-success-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Choisir ce plan
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-16 dark:bg-gray-800">
          <Container>
            <h2 className="mb-12 text-center font-display text-3xl font-bold">
              Ce que disent nos membres Premium
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  name: 'Sophie M.',
                  role: 'Étudiante en master',
                  content: 'L\'accès illimité aux livres académiques a transformé ma façon d\'étudier. Un investissement qui en vaut vraiment la peine !',
                  avatar: '👩‍🎓'
                },
                {
                  name: 'Marc D.',
                  role: 'Professionnel',
                  content: 'Les cours en ligne et les certifications m\'ont permis d\'acquérir de nouvelles compétences essentielles pour ma carrière.',
                  avatar: '👨‍💼'
                },
                {
                  name: 'Amina K.',
                  role: 'Enseignante',
                  content: 'La qualité du contenu et l\'assistant IA sont exceptionnels. Je recommande vivement l\'abonnement Premium.',
                  avatar: '👩‍🏫'
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900"
                >
                  <div className="mb-4 text-4xl">{testimonial.avatar}</div>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <Container className="py-16">
          <h2 className="mb-12 text-center font-display text-3xl font-bold">
            Questions fréquentes
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            {[
              {
                question: 'Comment fonctionne l\'abonnement Premium ?',
                answer: 'L\'abonnement Premium vous donne un accès illimité à notre bibliothèque complète, aux cours en ligne et aux certifications. Vous pouvez choisir entre un abonnement mensuel ou annuel.'
              },
              {
                question: 'Puis-je annuler à tout moment ?',
                answer: 'Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès aux fonctionnalités Premium jusqu\'à la fin de votre période de facturation.'
              },
              {
                question: 'Les mises à jour sont-elles incluses ?',
                answer: 'Absolument ! Votre abonnement Premium vous donne accès à toutes les nouvelles fonctionnalités et au contenu dès leur sortie.'
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="rounded-lg border border-gray-200 p-6 dark:border-gray-700"
              >
                <h3 className="mb-3 font-display text-xl font-bold">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </Layout>
  );
} 