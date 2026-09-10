import type {
  BorrowerProfile,
} from "../../types/borrower";

export type QuestionId =
  | "purpose"
  | "amount"
  | "loan_type"
  | "income"
  | "income_stability"
  | "existing_emi"
  | "household_expenses"
  | "credit_score"
  | "age"
  | "emergency_savings"
  | "collateral"
  | "loan_history"
  | "business_income"
  | "existing_debt"
  | "income_proof";

export type OutputType =
  | "borrow_decision"
  | "lender_amount"
  | "safe_amount"
  | "fair_rate"
  | "emi"
  | "stress"
  | "product"
  | "confidence";

export interface QuestionDefinition {
  id: QuestionId;

  text: string;

  required: boolean;

  appliesWhen?: (
    profile: BorrowerProfile
  ) => boolean;

  affects: OutputType[];
}