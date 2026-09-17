export interface MediationRecord {
  id: string;
  // 1. Mediation Case No.
  mediationCasePart: string; // Field 1A — text before slash
  mediationCaseYear: string; // Field 1B — year dropdown
  // 2. Decision
  decision: string;
  // 3. Case No.
  caseNoPrefix: string; // Field 3A — dropdown
  caseNoNumber: string; // Field 3B — text
  caseNoYear: string; // Field 3C — year dropdown
  // Reff. Date (Reference Date)
  reffDate: string;
  // 4. First Party
  firstParty: string;
  // 5. Second Party
  secondParty: string;
  // Date(s) of Mediation
  mediationDates: string[];
  // 6. Name of Court
  nameOfCourt: string;
  // 7. Remu
  remu: string;
  createdAt: string;
}

export type RecordErrors = Partial<Record<keyof MediationRecord, string>>;
