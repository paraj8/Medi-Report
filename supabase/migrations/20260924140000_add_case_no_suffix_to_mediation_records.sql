ALTER TABLE mediation_records
ADD COLUMN IF NOT EXISTS case_no_suffix text NOT NULL DEFAULT '';