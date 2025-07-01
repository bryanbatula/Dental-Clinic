-- Create treatment records table for tracking dental work and payments

CREATE TABLE IF NOT EXISTS treatment_records (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date_performed DATE NOT NULL DEFAULT CURRENT_DATE,
    tooth_number VARCHAR(10),
    description TEXT NOT NULL,
    charge DECIMAL(10,2) DEFAULT 0.00,
    paid DECIMAL(10,2) DEFAULT 0.00,
    balance DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_treatment_records_client_id ON treatment_records(client_id);
CREATE INDEX IF NOT EXISTS idx_treatment_records_date ON treatment_records(date_performed); 