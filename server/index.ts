import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes'; // Will resolve to bookRoutes.ts
import adminRoutes from './routes/adminRoutes'; // Will resolve to adminRoutes.ts
import { ensureBookCollectionExists } from './lib/typesenseClient'; // Added

dotenv.config();

// Ensure Typesense collection exists on startup
if (process.env.NODE_ENV !== 'test') { // Optional: avoid during tests
  ensureBookCollectionExists().catch(err => {
    console.error("Failed to ensure Typesense collection exists on startup:", err);
    // Decide if you want to exit or continue if Typesense is critical
    // process.exit(1); 
  });
}

const app: Express = express();
const PORT: string | number = process.env.PORT || 3001;

// CORS Configuration
app.use(cors({
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173', // Use an env var for frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// API Routes
app.use('/api', bookRoutes); // Mount book routes under /api/books (or /api if bookRoutes handles /books)
app.use('/api', adminRoutes); // Mount admin routes under /api/admin/login (or /api if adminRoutes handles /admin/login)

// Simple root welcome message
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'BiblioIntel API is running!' });
});

// Basic Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server démarré sur http://localhost:${PORT} (TypeScript version)`);
  // Note: The MySQL connection test from the old index.mjs is not included here.
  // It's better practice to test db connection within db.ts or on first query.
});
