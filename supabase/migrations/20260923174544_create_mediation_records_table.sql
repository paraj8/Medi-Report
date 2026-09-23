/*
# Create mediation_records table (single-tenant, no auth)

## Purpose
Stores mediation case records for the Legal Mediation Collector app.
This is a single-tenant app with no sign-in screen, so all data is
intentionally shared and accessible to the anon-key frontend.

## New Tables
- `mediation_records`
  - `id` (text, primary key) — client-generated unique record ID
  - `mediation_case_part` (text) — text portion of mediation case number
  - `mediation_case_year` (text) — year portion of mediation case number
  - `name_of_court` (text) — court name
  - `case_no_prefix` (text) — case type prefix
  - `case_no_number` (text) — case number
  - `case_no_year` (text) — case year
  - `reff_date` (text) — reference date in ISO format (yyyy-mm-dd)
  - `first_party` (text) — first party name
  - `second_party` (text) — second party name
  - `mediation_dates` (jsonb) — array of ISO date strings
  - `decision` (text) — mediation outcome
  - `remu` (text) — remuneration amount
  - `created_at` (timestamptz, default now()) — record creation timestamp

## Security
- RLS enabled on `mediation_records`.
- Full CRUD access for both `anon` and `authenticated` roles since this
  is a single-tenant app with intentionally shared/public data.
*/

CREATE TABLE IF NOT EXISTS mediation_records (
  id text PRIMARY KEY,
  mediation_case_part text NOT NULL DEFAULT '',
  mediation_case_year text NOT NULL DEFAULT '',
  name_of_court text NOT NULL DEFAULT '',
  case_no_prefix text NOT NULL DEFAULT '',
  case_no_number text NOT NULL DEFAULT '',
  case_no_year text NOT NULL DEFAULT '',
  reff_date text NOT NULL DEFAULT '',
  first_party text NOT NULL DEFAULT '',
  second_party text NOT NULL DEFAULT '',
  mediation_dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  decision text NOT NULL DEFAULT '',
  remu text NOT NULL DEFAULT '0',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mediation_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_mediation_records" ON mediation_records;
CREATE POLICY "anon_select_mediation_records"
  ON mediation_records FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_mediation_records" ON mediation_records;
CREATE POLICY "anon_insert_mediation_records"
  ON mediation_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_mediation_records" ON mediation_records;
CREATE POLICY "anon_update_mediation_records"
  ON mediation_records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_mediation_records" ON mediation_records;
CREATE POLICY "anon_delete_mediation_records"
  ON mediation_records FOR DELETE
  TO anon, authenticated USING (true);
