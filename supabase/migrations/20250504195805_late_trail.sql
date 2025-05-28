/*
  # Create Books Table

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `external_id` (text, nullable)
      - `title` (text)
      - `author` (text)
      - `description` (text)
      - `categories` (text array)
      - `cover_url` (text)
      - `published_date` (text)
      - `publisher` (text)
      - `page_count` (integer)
      - `language` (text)
      - `isbn` (text)
      - `rating` (float)
      - `price` (float)
      - `currency` (text)
      - `availability` (text)
      - `source` (text)
      - `created_at` (timestamp with time zone)
      
  2. Security
    - Enable RLS on `books` table
    - Add policies for authenticated and anonymous users to read
    - Add policy for only authenticated users to insert
*/

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text,
  title text NOT NULL,
  author text NOT NULL,
  description text,
  categories text[] DEFAULT '{}',
  cover_url text,
  published_date text,
  publisher text,
  page_count integer DEFAULT 0,
  language text DEFAULT 'fr',
  isbn text,
  rating float DEFAULT 0,
  price float DEFAULT 0,
  currency text DEFAULT 'XOF',
  availability text DEFAULT 'indisponible',
  source text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS books_title_idx ON books USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS books_author_idx ON books USING gin (author gin_trgm_ops);
CREATE INDEX IF NOT EXISTS books_external_id_idx ON books (external_id);

-- Enable row level security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow all users to read books
CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  USING (true);

-- Only authenticated users can insert books
CREATE POLICY "Authenticated users can insert books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users with the same ID can update their own books
CREATE POLICY "Users can update their own books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (source = 'user_' || auth.uid());