-- Make description field optional in treatment_records table

ALTER TABLE treatment_records 
ALTER COLUMN description DROP NOT NULL;

-- Update comment to reflect the change
COMMENT ON COLUMN treatment_records.description IS 'Optional description of the treatment performed'; 