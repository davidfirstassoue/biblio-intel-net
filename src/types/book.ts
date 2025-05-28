export interface Book {
  id: string;
  external_id?: string | null;
  title: string;
  author: string;
  description: string;
  categories: string[];
  cover_url: string;
  published_date: string;
  publisher: string;
  page_count: number;
  language: string;
  isbn: string;
  rating: number;
  price: number;
  currency: string;
  availability: string;
  source: string;
  created_at?: string;
}