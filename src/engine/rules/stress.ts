import type { BorrowerProfile } from "../../types/borrower";

import {
  calculateEmi,
  calculateMaxEmi,
  calculateStressEmi,
  calculateStressIncome,
} from "./calculations";

import {
  getAssessmentIncome,
  SAFE_FOIR,
  MINIMUM_BUFFER,
} from "./affordability";

export type StressType =
  | "income_drop"
  | "rate_rise";

export interface StressResult {
  type: StressType;
  label: string;
  description: string;
  stressedIncome?: number;
  stressedRate?: number;
  currentEmi: number;
  stressedEmi: number;
  remainsAffordable: boolean;
}

const INCOME_DROP = 20;
const RATE_RISE = 2;

export function calculateStress(
  profile: BorrowerProfile,
  principal: number,
  rate: number,
  tenureMonths: number
): StressResult {
  /*
   * Use the exact same income estimate
   * used by the affordability engine.
   */
  const income =
    getAssessmentIncome(profile);

  const existingEmi =
    profile.existingEmi ?? 0;

  const householdExpenses =
    profile.householdExpenses ?? 0;

  const currentEmi =
    calculateEmi(
      principal,
      rate,
      tenureMonths
    );

  /*
   * Variable/informal income gets an
   * income-drop stress test.
   */
  if (
    profile.incomeType ===
      "informal" ||
    profile.incomeStability ===
      "low"
  ) {
    const stressedIncome =
      calculateStressIncome(
        income,
        INCOME_DROP
      );

    const stressedCapacity =
      calculateMaxEmi(
        stressedIncome,
        existingEmi,
        householdExpenses,
        SAFE_FOIR,
        MINIMUM_BUFFER
      );

    return {
      type: "income_drop",

      label:
        "If your income drops by 20%",

      description:
        "We test whether the proposed EMI remains affordable if your assessment income temporarily falls by 20%.",

      stressedIncome,

      currentEmi,

      stressedEmi:
        currentEmi,

      remainsAffordable:
        currentEmi <=
        stressedCapacity,
    };
  }

  /*
   * More stable borrowers get a rate-rise
   * stress scenario.
   */
  const stressedRate =
    rate + RATE_RISE;

  const stressedEmi =
    calculateStressEmi(
      principal,
      rate,
      RATE_RISE,
      tenureMonths
    );

  const safeEmiCapacity =
    calculateMaxEmi(
      income,
      existingEmi,
      householdExpenses,
      SAFE_FOIR,
      MINIMUM_BUFFER
    );

  return {
    type: "rate_rise",

    label:
      "If your interest rate rises by 2%",

    description:
      "We test how much your EMI could increase if the borrowing rate moves 2 percentage points higher.",

    stressedRate,

    currentEmi,

    stressedEmi,

    remainsAffordable:
      stressedEmi <=
      safeEmiCapacity,
  };
}