-- Ensure services table exists with correct structure (safe for re-runs)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default services
INSERT INTO services (name, description, duration, price) VALUES
('Regular Checkup', 'Routine dental examination and cleaning', 30, 75.00),
('Deep Cleaning', 'Thorough cleaning and plaque removal', 60, 150.00),
('Tooth Filling', 'Cavity filling procedure', 45, 120.00),
('Root Canal', 'Root canal treatment', 90, 800.00),
('Teeth Whitening', 'Professional teeth whitening treatment', 60, 250.00)
ON CONFLICT (name) DO NOTHING; 