export type IncomeType =
  | "salaried"
  | "self_employed"
  | "informal";

export type LoanType =
  | "personal"
  | "home"
  | "lap"
  | "gold"
  | "two_wheeler"
  | "business";

export type IncomeStability =
  | "high"
  | "medium"
  | "low"
  | "unknown";

export interface Range {
  min: number;
  max: number;
}

export interface BorrowerProfile {
  age?: number;

  incomeType?: IncomeType;

  monthlyIncome?: Range;

  incomeStability?: IncomeStability;

  loanType?: LoanType;

  loanPurpose?: string;

  amountWanted?: number;

  existingEmi?: number;

  existingDebtBalance?: number;

  existingDebtRate?: number;

  existingLoanCount?: number;

  householdExpenses?: number;

  creditScore?: number | null;

  variableIncome?: number;

  collateralValue?: number;

  emergencySavings?: number;

  pastBounces?: number;

  cardUtilization?: number;

  businessIncome?: Range;

  // ADD THESE
  annualDocumentedIncome?: number;

  hasIncomeProof?: boolean;

  coApplicantIncome?: number;
}