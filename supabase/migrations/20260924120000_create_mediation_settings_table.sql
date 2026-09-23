CREATE TABLE IF NOT EXISTS mediation_settings (
  id text PRIMARY KEY,
  filter_month text NOT NULL DEFAULT '',
  filter_year text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mediation_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_mediation_settings" ON mediation_settings;
CREATE POLICY "anon_select_mediation_settings"
  ON mediation_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_mediation_settings" ON mediation_settings;
CREATE POLICY "anon_insert_mediation_settings"
  ON mediation_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_mediation_settings" ON mediation_settings;
CREATE POLICY "anon_update_mediation_settings"
  ON mediation_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);