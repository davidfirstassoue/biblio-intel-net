import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { BookGrid } from '../components/books/BookGrid';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'romans',
    name: 'Romans',
    icon: '📚',
    description: 'Des histoires captivantes pour tous les goûts',
    color: 'from-blue-500 to-purple-500',
    subcategories: ['Romance', 'Policier', 'Fantastique', 'Science-fiction']
  },
  {
    id: 'sciences',
    name: 'Sciences',
    icon: '🔬',
    description: 'Explorez les mystères de l\'univers',
    color: 'from-green-500 to-teal-500',
    subcategories: ['Physique', 'Biologie', 'Astronomie', 'Mathématiques']
  },
  {
    id: 'histoire',
    name: 'Histoire',
    icon: '🏛️',
    description: 'Voyagez à travers les époques',
    color: 'from-amber-500 to-orange-500',
    subcategories: ['Antiquité', 'Moyen Âge', 'Histoire moderne', 'Histoire contemporaine']
  },
  {
    id: 'art',
    name: 'Art & Culture',
    icon: '🎨',
    description: 'Découvrez la beauté sous toutes ses formes',
    color: 'from-pink-500 to-rose-500',
    subcategories: ['Peinture', 'Musique', 'Cinéma', 'Photographie']
  },
  {
    id: 'tech',
    name: 'Technologie',
    icon: '💻',
    description: 'L\'innovation à portée de main',
    color: 'from-indigo-500 to-blue-500',
    subcategories: ['Programmation', 'Intelligence artificielle', 'Cybersécurité', 'Réseaux']
  },
  {
    id: 'philosophie',
    name: 'Philosophie',
    icon: '🤔',
    description: 'Questionnez le monde qui vous entoure',
    color: 'from-violet-500 to-purple-500',
    subcategories: ['Éthique', 'Métaphysique', 'Philosophie politique', 'Logique']
  }
];

export function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <Layout>
      <Container className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-8 text-center font-display text-4xl font-bold md:text-5xl">
            Explorez nos{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Catégories
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-400">
            Découvrez notre vaste collection de livres organisée par thèmes. 
            Trouvez facilement les ouvrages qui vous passionnent.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${category.color} p-1 transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="relative h-full rounded-xl bg-white p-6 dark:bg-gray-900">
                  <div className="mb-4 text-4xl">{category.icon}</div>
                  <h3 className="mb-2 font-display text-xl font-bold">{category.name}</h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {category.description}
                  </p>
                  
                  <div className="mb-6 flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => navigate(`/catalogue?category=${category.id}`)}
                    className={`inline-flex items-center rounded-lg bg-gradient-to-r ${category.color} px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105`}
                  >
                    Explorer
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold">
              Livres dans la catégorie {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <BookGrid
              books={[]}
              isLoading={false}
              showEmpty={true}
              emptyMessage="Chargement des livres..."
            />
          </div>
        )}
      </Container>
    </Layout>
  );
} 