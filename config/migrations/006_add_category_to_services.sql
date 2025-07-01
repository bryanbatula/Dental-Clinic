-- Add category column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'General';

-- Update existing services with appropriate categories
UPDATE services SET category = 'General' WHERE category IS NULL;

-- Update specific services with more appropriate categories
UPDATE services SET category = 'Preventive' WHERE name IN ('Regular Checkup', 'Deep Cleaning');
UPDATE services SET category = 'Restorative' WHERE name IN ('Tooth Filling', 'Root Canal');
UPDATE services SET category = 'Cosmetic' WHERE name IN ('Teeth Whitening');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category); 