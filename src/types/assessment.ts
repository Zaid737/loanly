import type { LoanType, Range } from "./borrower";

export type Verdict =
  | "BORROW"
  | "BORROW_LESS"
  | "DONT_BORROW";

export type Confidence =
  | "low"
  | "medium"
  | "high";

export type OutputType =
  | "borrow_decision"
  | "lender_amount"
  | "safe_amount"
  | "fair_rate"
  | "emi"
  | "stress"
  | "product"
  | "confidence";

export interface Reason {
  output: OutputType;
  text: string;
}

export interface Assessment {
  verdict: Verdict;

  lenderAmount: Range;

  safeAmount: Range;

  recommendedAmount: Range;

  fairRate: Range;

  aprRange: Range;

  safeEmi: number;

  stressEmi: number;

  recommendedTenure: number;

  product: LoanType;

  confidence: Confidence;

  reasons: Reason[];
}