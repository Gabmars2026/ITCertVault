export type CcnaCase = {
  domain: string;
  title: string;
  rootCause: string;
  change: string;
  complaint: string;
  evidence: string;
  fix: string;
};

export const ccnaDomain = (domain: string, rows: Omit<CcnaCase, "domain">[]): CcnaCase[] =>
  rows.map((row) => ({ domain, ...row }));
