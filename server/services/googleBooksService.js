import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query, maxResults = 40) => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_API_URL, {
      params: {
        q: query,
        maxResults,
        langRestrict: 'fr',
      }
    });

    return response.data.items.map(book => ({
      id: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Auteur inconnu',
      description: book.volumeInfo.description || '',
      categories: book.volumeInfo.categories || [],
      cover_url: book.volumeInfo.imageLinks?.thumbnail || '/images/default-book.png',
      published_date: book.volumeInfo.publishedDate,
      publisher: book.volumeInfo.publisher || '',
      page_count: book.volumeInfo.pageCount || 0,
      language: book.volumeInfo.language,
      isbn: book.volumeInfo.industryIdentifiers?.[0]?.identifier || '',
      rating: book.volumeInfo.averageRating || 0,
      price: book.saleInfo?.listPrice?.amount || 0,
      currency: book.saleInfo?.listPrice?.currencyCode || 'XOF',
      availability: book.saleInfo?.saleability === 'FOR_SALE' ? 'disponible' : 'indisponible',
      source: 'google'
    }));
  } catch (error) {
    console.error('Erreur lors de la recherche de livres:', error);
    return [];
  }
}; 