CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion des administrateurs prédéfinis
INSERT INTO admins (email, password, name) VALUES
('davidfirst@admin.com', 'yesssaphir', 'David Admin'),
('Sefora@admin.com', 'sefora1999', 'Sefora Admin'),
('emmanueldlv@admin.com', 'kasangoyeye', 'Emmanuel Admin'); 