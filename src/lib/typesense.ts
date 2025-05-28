import Typesense from 'typesense';

// Initialize Typesense client
// In a real environment, these would be environment variables
const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: import.meta.env.VITE_TYPESENSE_HOST || 'localhost',
      port: parseInt(import.meta.env.VITE_TYPESENSE_PORT || '8108'),
      protocol: import.meta.env.VITE_TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: import.meta.env.VITE_TYPESENSE_API_KEY || 'xyz',
  connectionTimeoutSeconds: 2,
});

export const searchBooks = async (query: string, options = {}) => {
  try {
    const searchParameters = {
      q: query,
      query_by: 'title,author,description,categories',
      sort_by: '_text_match:desc',
      per_page: 12,
      page: 1,
      ...options,
    };

    const searchResults = await typesenseClient
      .collections('books')
      .documents()
      .search(searchParameters);

    return searchResults;
  } catch (error) {
    console.error('Typesense search error:', error);
    return { hits: [] };
  }
};

export const addBook = async (book: any) => {
  try {
    const result = await typesenseClient
      .collections('books')
      .documents()
      .create(book);
    
    return result;
  } catch (error) {
    console.error('Error adding book to Typesense:', error);
    throw error;
  }
};

export default typesenseClient;