-- Add type column to certificates table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'certificates' 
        AND column_name = 'type'
    ) THEN
        ALTER TABLE certificates ADD COLUMN type text NOT NULL DEFAULT 'event';
    END IF;
END $$;

-- Add check constraint to ensure type is one of the allowed values
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'certificates_type_check'
    ) THEN
        ALTER TABLE certificates ADD CONSTRAINT certificates_type_check 
            CHECK (type IN ('event', 'course'));
    END IF;
END $$; 