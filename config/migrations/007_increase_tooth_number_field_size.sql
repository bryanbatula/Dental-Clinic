-- Increase tooth_number field size for better compatibility with different dental numbering systems

ALTER TABLE treatment_records 
ALTER COLUMN tooth_number TYPE VARCHAR(20);

-- Update comment to reflect the change
COMMENT ON COLUMN treatment_records.tooth_number IS 'Tooth number using various dental numbering systems (FDI, Universal, Palmer, etc.)'; 