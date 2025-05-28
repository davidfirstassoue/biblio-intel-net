import axios from 'axios';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_API = 'https://openlibrary.org';

class BookApiService {
  async searchGoogleBooks(query, maxResults = 9) {
    try {
      const response = await axios.get(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
      if (!response.data.items) {
        console.error('Pas de résultats de Google Books');
        return [];
      }
      return response.data.items.map(book => ({
        isbn: book.volumeInfo.industryIdentifiers?.[0]?.identifier || '',
        titre: book.volumeInfo.title,
        auteur: book.volumeInfo.authors?.join(', ') || 'Auteur inconnu',
        description: book.volumeInfo.description || '',
        image_url: book.volumeInfo.imageLinks?.thumbnail || '',
        date_publication: book.volumeInfo.publishedDate || '',
        editeur: book.volumeInfo.publisher || '',
        source: 'google_books',
        source_id: book.id
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche Google Books:', error);
      return [];
    }
  }

  async searchOpenLibrary(query, limit = 9) {
    try {
      const response = await axios.get(`${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.data.docs) {
        console.error('Pas de résultats de OpenLibrary');
        return [];
      }
      return response.data.docs.map(book => ({
        isbn: book.isbn?.[0] || '',
        titre: book.title,
        auteur: book.author_name?.join(', ') || 'Auteur inconnu',
        description: '',
        image_url: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : '',
        date_publication: book.first_publish_year?.toString() || '',
        editeur: book.publisher?.[0] || '',
        source: 'open_library',
        source_id: book.key
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche OpenLibrary:', error);
      return [];
    }
  }

  async getPopularBooks() {
    try {
      // Recherche de livres populaires (bestsellers ou livres bien notés)
      const popularQueries = ['bestseller', 'award winning', 'best rated'];
      const query = popularQueries[Math.floor(Math.random() * popularQueries.length)];
      const [googleBooks, openLibraryBooks] = await Promise.all([
        this.searchGoogleBooks(query, 5),
        this.searchOpenLibrary(query, 4)
      ]);
      const books = [...googleBooks, ...openLibraryBooks];
      console.log(`Nombre de livres populaires trouvés: ${books.length}`);
      return books;
    } catch (error) {
      console.error('Erreur dans getPopularBooks:', error);
      return [];
    }
  }

  async getRecentBooks() {
    try {
      const currentYear = new Date().getFullYear();
      const [googleBooks, openLibraryBooks] = await Promise.all([
        this.searchGoogleBooks(`subject:fiction+publishedDate:${currentYear}`, 5),
        this.searchOpenLibrary(`published_in:${currentYear}`, 4)
      ]);
      const books = [...googleBooks, ...openLibraryBooks];
      console.log(`Nombre de livres récents trouvés: ${books.length}`);
      return books;
    } catch (error) {
      console.error('Erreur dans getRecentBooks:', error);
      return [];
    }
  }
}

export default new BookApiService(); 