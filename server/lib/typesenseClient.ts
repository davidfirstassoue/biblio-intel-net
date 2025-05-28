import Typesense from 'typesense';
import dotenv from 'dotenv';

dotenv.config();

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || 'localhost';
const TYPESENSE_PORT = process.env.TYPESENSE_PORT ? parseInt(process.env.TYPESENSE_PORT) : 8108;
const TYPESENSE_PROTOCOL = process.env.TYPESENSE_PROTOCOL || 'http';
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY || 'xyz'; // Default placeholder, ensure this is configured in .env for production

if (TYPESENSE_API_KEY === 'xyz' && process.env.NODE_ENV !== 'development') {
  console.warn('Warning: Typesense API key is set to placeholder "xyz" in a non-development environment.');
}

export const typesenseClient = new Typesense.Client({
  nodes: [{
    host: TYPESENSE_HOST,
    port: TYPESENSE_PORT,
    protocol: TYPESENSE_PROTOCOL,
  }],
  apiKey: TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 5, // Increased timeout slightly
});

// Schema definition for the 'books' collection
export const bookSchemaName = 'books';
export const bookSchema = {
  name: bookSchemaName,
  fields: [
    { name: 'id', type: 'string' }, // This should be the book's unique ID from your MySQL DB
    { name: 'title', type: 'string', sort: true },
    { name: 'author', type: 'string', facet: true, sort: true },
    { name: 'description', type: 'string', optional: true },
    { name: 'isbn', type: 'string', optional: true, facet: true },
    { name: 'published_date', type: 'string', optional: true, facet: true }, // Consider int32 for year if only year is stored
    { name: 'editeur', type: 'string', optional: true, facet: true },
    { name: 'image_url', type: 'string', optional: true, index: false, optional_true_values: [""] }, // No need to index image_url for search usually
    { name: 'source', type: 'string', facet: true, optional: true },
    // Add any other fields you want to search or filter on
  ],
  default_sorting_field: 'title', // Optional: if you have a relevance or popularity score, use that
};

// Function to ensure the collection exists
export async function ensureBookCollectionExists() {
  try {
    await typesenseClient.collections(bookSchemaName).retrieve();
    console.log(`Typesense collection '${bookSchemaName}' already exists.`);
  } catch (error: any) {
    if (error.httpStatus === 404) {
      console.log(`Typesense collection '${bookSchemaName}' not found, creating it...`);
      await typesenseClient.collections().create(bookSchema);
      console.log(`Typesense collection '${bookSchemaName}' created.`);
    } else {
      // Log the full error for better debugging if it's not a 404
      console.error('Error checking/creating Typesense collection:', error.message, error.stack, error.httpStatus);
    }
  }
}

// Optionally, call ensureBookCollectionExists on startup, perhaps in server/index.ts
// For example:
// if (process.env.NODE_ENV !== 'test') { // Avoid running during tests if not needed
//   ensureBookCollectionExists().catch(console.error);
// }
