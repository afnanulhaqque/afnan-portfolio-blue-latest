-- Add awarded_by column to achievements table
ALTER TABLE public.achievements 
ADD COLUMN IF NOT EXISTS awarded_by text;

-- Update existing rows to have a default value
UPDATE public.achievements 
SET awarded_by = 'Self' 
WHERE awarded_by IS NULL; 