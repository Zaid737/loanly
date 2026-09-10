import type { BorrowerProfile } from "../../types/borrower";
import { calculateMaxEmi } from "./calculations";

export const NORMAL_FOIR = 0.50;
export const SAFE_FOIR = 0.40;
export const MINIMUM_BUFFER = 15_000;

export function getAssessmentIncome(
  profile: BorrowerProfile
): number {
  const income =
    profile.monthlyIncome;

  if (!income) {
    return 0;
  }

  if (
    profile.incomeType ===
    "salaried"
  ) {
    return income.min;
  }

  /*
   * Variable income is not treated as
   * guaranteed at the maximum.
   *
   * 30% weight on the low end and
   * 70% on the high end gives a
   * usable assessment estimate while
   * preserving the reported range.
   */
  return (
    income.min * 0.30 +
    income.max * 0.70
  );
}

export interface AffordabilityResult {
  lenderEmi: number;
  safeEmi: number;
  monthlyIncome: number;
  householdExpenses: number;
  existingEmi: number;
}

export function calculateAffordability(
  profile: BorrowerProfile
): AffordabilityResult {
  const monthlyIncome =
    getAssessmentIncome(profile);

  const existingEmi =
    profile.existingEmi ?? 0;

  const householdExpenses =
    profile.householdExpenses ?? 0;

  const lenderEmi =
    calculateMaxEmi(
      monthlyIncome,
      existingEmi,
      householdExpenses,
      NORMAL_FOIR,
      MINIMUM_BUFFER
    );

  const safeEmi =
    calculateMaxEmi(
      monthlyIncome,
      existingEmi,
      householdExpenses,
      SAFE_FOIR,
      MINIMUM_BUFFER
    );

  return {
    lenderEmi,
    safeEmi,
    monthlyIncome,
    householdExpenses,
    existingEmi,
  };
}