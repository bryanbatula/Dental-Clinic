-- Add missing columns to treatment_records table

ALTER TABLE treatment_records 
ADD COLUMN IF NOT EXISTS dentist VARCHAR(255),
ADD COLUMN IF NOT EXISTS notes TEXT;