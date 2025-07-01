-- Add dental chart and treatment fields to clients table

-- Add dental chart data field (JSON to store tooth status)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='dental_chart') THEN
        ALTER TABLE clients ADD COLUMN dental_chart JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

-- Add dental examination fields
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='present_oral_complaint') THEN
        ALTER TABLE clients ADD COLUMN present_oral_complaint TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='medical_information') THEN
        ALTER TABLE clients ADD COLUMN medical_information JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='dental_information') THEN
        ALTER TABLE clients ADD COLUMN dental_information JSONB DEFAULT '{}'::jsonb;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='previous_dental_care') THEN
        ALTER TABLE clients ADD COLUMN previous_dental_care TEXT;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='clinic_dentist') THEN
        ALTER TABLE clients ADD COLUMN clinic_dentist VARCHAR(255);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='referred_by') THEN
        ALTER TABLE clients ADD COLUMN referred_by VARCHAR(255);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='occupation') THEN
        ALTER TABLE clients ADD COLUMN occupation VARCHAR(255);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='remarks') THEN
        ALTER TABLE clients ADD COLUMN remarks VARCHAR(100) DEFAULT 'Good';
    END IF;
END $$; 