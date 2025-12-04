-- Update guest_data table to support multiple guests
-- Drop the single guest constraint
ALTER TABLE guest_data DROP CONSTRAINT IF EXISTS single_guest_row;

-- Make id auto-increment
ALTER TABLE guest_data ALTER COLUMN id DROP DEFAULT;
CREATE SEQUENCE IF NOT EXISTS guest_data_id_seq;
ALTER TABLE guest_data ALTER COLUMN id SET DEFAULT nextval('guest_data_id_seq');
SELECT setval('guest_data_id_seq', (SELECT COALESCE(MAX(id), 0) FROM guest_data));

-- Add check constraint to prevent past check-out dates
ALTER TABLE guest_data ADD CONSTRAINT check_out_not_past 
  CHECK (check_out >= CURRENT_DATE);

-- Delete the default guest entry (id=1) if it exists
DELETE FROM guest_data WHERE id = 1;
