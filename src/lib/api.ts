import axios from 'axios';
import { supabase } from './supabase';
import type { Book } from '../types/book';

// --- Configurer les APIs externes ---

// GOOGLE BOOKS
const googleBooksAPI = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
});

// OPENLIBRARY (pas besoin de clé API)
const openLibraryAPI = axios.create({
  baseURL: 'https://openlibrary.org',
});

// OPENALEX (pas besoin de clé API)
const openAlexAPI = axios.create({
  baseURL: 'https://api.openalex.org/works',
});

// --- Fonction principale : recherche sur toutes les APIs ---

export async function searchExternalAPIs(query: string): Promise<Book[]> {
  const books: Book[] = [];

  // GOOGLE BOOKS
  try {
    const googleResults = await googleBooksAPI.get('/volumes', {
      params: {
        q: query,
        maxResults: 10,
      },
    });

    const googleBooks = googleResults.data.items?.map((item: any) => ({
      id: `google_${item.id}`,
      title: item.volumeInfo.title || 'Titre inconnu',
      author: (item.volumeInfo.authors || ['Auteur inconnu']).join(', '),
      description: item.volumeInfo.description || 'Pas de description disponible',
      categories: item.volumeInfo.categories || [],
      coverUrl: item.volumeInfo.imageLinks?.thumbnail || '',
      publishedDate: item.volumeInfo.publishedDate || '',
      publisher: item.volumeInfo.publisher || '',
      pageCount: item.volumeInfo.pageCount || 0,
      language: item.volumeInfo.language || 'fr',
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier || '',
      rating: item.volumeInfo.averageRating || 0,
      price: item.saleInfo?.listPrice?.amount || 0,
      currency: item.saleInfo?.listPrice?.currencyCode || 'XOF',
      availability: item.saleInfo?.saleability === 'FOR_SALE' ? 'disponible' : 'indisponible',
      source: 'google',
    })) || [];

    books.push(...googleBooks);
  } catch (error) {
    console.error('Erreur Google Books :', error);
  }

  // OPENLIBRARY
  try {
    const openLibResults = await openLibraryAPI.get('/search.json', {
      params: { q: query, limit: 10 },
    });

    const openLibBooks = openLibResults.data.docs?.map((item: any) => ({
      id: `openlibrary_${item.key}`,
      title: item.title || 'Titre inconnu',
      author: item.author_name?.[0] || 'Auteur inconnu',
      description: item.first_sentence || 'Pas de description disponible',
      categories: item.subject || [],
      coverUrl: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : '',
      publishedDate: item.first_publish_year?.toString() || '',
      publisher: item.publisher?.[0] || '',
      pageCount: 0,
      language: 'fr',
      isbn: item.isbn?.[0] || '',
      rating: 0,
      price: 0,
      currency: 'XOF',
      availability: 'disponible',
      source: 'openlibrary',
    })) || [];

    books.push(...openLibBooks);
  } catch (error) {
    console.error('Erreur OpenLibrary :', error);
  }

  // OPENALEX
  try {
    const openAlexResults = await openAlexAPI.get('', {
      params: { search: query, per_page: 10 },
    });

    const openAlexBooks = openAlexResults.data.results?.map((item: any) => ({
      id: `openalex_${item.id}`,
      title: item.title || 'Titre inconnu',
      author: item.authorships?.[0]?.author?.display_name || 'Auteur inconnu',
      description: item.abstract_inverted_index ? Object.keys(item.abstract_inverted_index).join(' ') : 'Pas de description disponible',
      categories: item.concepts?.map((c: any) => c.display_name) || [],
      coverUrl: '',
      publishedDate: item.publication_year?.toString() || '',
      publisher: item.primary_location?.source?.display_name || '',
      pageCount: 0,
      language: 'fr',
      isbn: '',
      rating: 0,
      price: 0,
      currency: 'XOF',
      availability: 'disponible',
      source: 'openalex',
    })) || [];

    books.push(...openAlexBooks);
  } catch (error) {
    console.error('Erreur OpenAlex :', error);
  }

  // --- Stocker les livres dans Supabase ---
  for (const book of books) {
    const { data: existingBooks } = await supabase
      .from('books')
      .select('id')
      .eq('external_id', book.id)
      .limit(1);

    if (!existingBooks || existingBooks.length === 0) {
      await supabase.from('books').insert({
        external_id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        categories: book.categories,
        cover_url: book.coverUrl,
        published_date: book.publishedDate,
        publisher: book.publisher,
        page_count: book.pageCount,
        language: book.language,
        isbn: book.isbn,
        rating: book.rating,
        price: book.price,
        currency: book.currency,
        availability: book.availability,
        source: book.source,
      });
    }
  }

  return books;
}

// --- Fonction pour obtenir les détails d’un livre ---
export async function getBookDetails(id: string): Promise<Book | null> {
  const { data: bookData } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (!bookData) return null;

  return {
    id: bookData.id,
    title: bookData.title,
    author: bookData.author,
    description: bookData.description,
    categories: bookData.categories,
    coverUrl: bookData.cover_url,
    publishedDate: bookData.published_date,
    publisher: bookData.publisher,
    pageCount: bookData.page_count,
    language: bookData.language,
    isbn: bookData.isbn,
    rating: bookData.rating,
    price: bookData.price,
    currency: bookData.currency,
    availability: bookData.availability,
    source: bookData.source,
  };
}

// --- Fonction pour obtenir des livres similaires ---
export async function getSimilarBooks(bookId: string, limit = 6): Promise<Book[]> {
  const book = await getBookDetails(bookId);
  if (!book || !book.categories || book.categories.length === 0) return [];

  const { data: similarBooks } = await supabase
    .from('books')
    .select('*')
    .neq('id', bookId)
    .contains('categories', book.categories)
    .limit(limit);

  return similarBooks?.map((item) => ({
    id: item.id,
    title: item.title,
    author: item.author,
    description: item.description,
    categories: item.categories,
    coverUrl: item.cover_url,
    publishedDate: item.published_date,
    publisher: item.publisher,
    pageCount: item.page_count,
    language: item.language,
    isbn: item.isbn,
    rating: item.rating,
    price: item.price,
    currency: item.currency,
    availability: item.availability,
    source: item.source,
  })) || [];
}
