USE Bibliointel;

-- Ajout des colonnes manquantes si elles n'existent pas déjà
ALTER TABLE livres
  ADD COLUMN IF NOT EXISTS isbn VARCHAR(20),
  ADD COLUMN IF NOT EXISTS source VARCHAR(50),
  ADD COLUMN IF NOT EXISTS source_id VARCHAR(100),
  ADD COLUMN IF NOT EXISTS date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD UNIQUE INDEX IF NOT EXISTS unique_source_book (source, source_id),
  ADD INDEX IF NOT EXISTS idx_date_publication (date_publication),
  ADD INDEX IF NOT EXISTS idx_source (source),
  ADD INDEX IF NOT EXISTS idx_date_ajout (date_ajout); 