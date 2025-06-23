-- Add missing columns for analytics functionality

-- Add created_at column to clients table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='created_at') THEN
        ALTER TABLE clients ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        -- Update existing records with a default date
        UPDATE clients SET created_at = CURRENT_TIMESTAMP - INTERVAL '30 days' WHERE created_at IS NULL;
    END IF;
END $$;

-- Add category column to services table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='services' AND column_name='category') THEN
        ALTER TABLE services ADD COLUMN category VARCHAR(50) DEFAULT 'General';
        
        -- Update existing services with appropriate categories
        UPDATE services SET category = CASE 
            WHEN name ILIKE '%checkup%' OR name ILIKE '%cleaning%' THEN 'General'
            WHEN name ILIKE '%whitening%' OR name ILIKE '%cosmetic%' THEN 'Cosmetic'
            WHEN name ILIKE '%filling%' OR name ILIKE '%cavity%' THEN 'General'
            WHEN name ILIKE '%root canal%' OR name ILIKE '%surgery%' THEN 'Surgery'
            WHEN name ILIKE '%orthodontic%' OR name ILIKE '%braces%' THEN 'Orthodontics'
            WHEN name ILIKE '%emergency%' THEN 'Emergency'
            WHEN name ILIKE '%children%' OR name ILIKE '%pediatric%' THEN 'Pediatric'
            ELSE 'General'
        END
        WHERE category = 'General';
    END IF;
END $$; 