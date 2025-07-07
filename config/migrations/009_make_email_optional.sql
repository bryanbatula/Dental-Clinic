-- Make email field optional in clients table

ALTER TABLE clients 
ALTER COLUMN email DROP NOT NULL;

-- Update comment to reflect the change
COMMENT ON COLUMN clients.email IS 'Optional email address of the client'; 