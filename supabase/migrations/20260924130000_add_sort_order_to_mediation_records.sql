ALTER TABLE mediation_records
ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

WITH ordered_records AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC, id ASC) - 1 AS sort_order
  FROM mediation_records
)
UPDATE mediation_records
SET sort_order = ordered_records.sort_order
FROM ordered_records
WHERE mediation_records.id = ordered_records.id;