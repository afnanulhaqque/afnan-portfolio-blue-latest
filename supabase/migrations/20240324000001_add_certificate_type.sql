-- Add type column to certificates table
ALTER TABLE certificates ADD COLUMN type text NOT NULL DEFAULT 'event';

-- Add check constraint to ensure type is one of the allowed values
ALTER TABLE certificates ADD CONSTRAINT certificates_type_check 
  CHECK (type IN ('event', 'course')); 