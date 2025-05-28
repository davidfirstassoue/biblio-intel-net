# BiblioIntel - Bibliothèque Intelligente Futuriste

BiblioIntel est une bibliothèque numérique avancée avec IA intégrée, recherche optimisée et une expérience utilisateur moderne.

## Fonctionnalités

- Recherche intelligente avec intégration de Typesense
- Fallback automatique vers Google Books API, WorldCat API, et OpenLibrary API
- Chat IA avec Claude via OpenRouter
- Authentification utilisateur avec confirmation email
- Interface futuriste avec animations et glassmorphisme
- Mode sombre/clair et personnalisation des thèmes
- Tableau de bord utilisateur personnalisé
- Abonnement premium

## Technologies utilisées

- React 18 avec TypeScript
- Tailwind CSS pour le styling
- Framer Motion pour les animations
- Supabase pour la base de données et l'authentification
- Typesense pour la recherche rapide
- OpenRouter pour l'intégration de l'IA Claude

## Installation

### Prérequis

- Node.js 16+ installé
- Un compte Supabase (gratuit)

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votrenom/bibliointel.git
   cd bibliointel
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez Supabase :
   - Créez un compte sur [Supabase](https://supabase.com)
   - Créez un nouveau projet
   - Dans les paramètres de votre projet, récupérez l'URL et la clé anon
   - Créez un fichier `.env` à la racine du projet avec les variables suivantes :
     ```
     VITE_SUPABASE_URL=votre_url_supabase
     VITE_SUPABASE_ANON_KEY=votre_clé_anon_supabase
     ```

4. Importez les migrations Supabase :
   - Dans l'interface Supabase, allez dans "SQL Editor"
   - Copiez et exécutez le contenu des fichiers dans le dossier `supabase/migrations`

5. Lancez l'application en mode développement :
   ```bash
   npm run dev
   ```

6. L'application devrait être accessible à l'adresse : [http://localhost:5173](http://localhost:5173)

## Configuration de l'email

Pour que la confirmation par email fonctionne, configurez Mailtrap dans les paramètres de Supabase :

- Host : smtp.mailtrap.io
- Port : 2525
- Username : 10d805b665e9ae
- Password : 25a2e58495170c

## Déploiement

Pour créer une version de production :

```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist` et peuvent être déployés sur n'importe quel service d'hébergement statique comme Netlify, Vercel ou GitHub Pages.

## Structure du projet

- `/src` - Code source de l'application
  - `/components` - Composants React
  - `/lib` - Utilitaires et services
  - `/pages` - Les différentes pages de l'application
  - `/store` - État global avec Zustand
  - `/types` - Définitions TypeScript
- `/supabase` - Migrations et configurations Supabase

## Licence

Ce projet est sous licence MIT.