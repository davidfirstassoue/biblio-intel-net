-- Création de la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS Bibliointel;
USE Bibliointel;

-- Suppression de la table si elle existe
DROP TABLE IF EXISTS livres;

-- Création de la table livres avec la nouvelle structure
CREATE TABLE livres (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20),
  titre VARCHAR(255) NOT NULL,
  auteur VARCHAR(255),
  description TEXT,
  image_url VARCHAR(500),
  date_publication VARCHAR(20),
  editeur VARCHAR(255),
  source VARCHAR(50),
  source_id VARCHAR(100),
  date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_source_book (source, source_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour améliorer les performances
CREATE INDEX idx_date_publication ON livres(date_publication);
CREATE INDEX idx_source ON livres(source);
CREATE INDEX idx_date_ajout ON livres(date_ajout); 