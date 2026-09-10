import { describe, expect, it } from "vitest";
import type { BorrowerProfile } from "../types/borrower";
import { runAssessment } from "./assessment";

const priya: BorrowerProfile = {
  age: 29,
  incomeType: "salaried",

  monthlyIncome: {
    min: 110000,
    max: 110000,
  },

  incomeStability: "high",

  loanType: "personal",

  loanPurpose: "Wedding",

  amountWanted: 800000,

  existingEmi: 14000,

  householdExpenses: 28000,

  creditScore: 780,
};

const ravi: BorrowerProfile = {
  age: 42,
  incomeType: "self_employed",

  monthlyIncome: {
    min: 40000,
    max: 80000,
  },

  businessIncome: {
    min: 40000,
    max: 80000,
  },

  annualDocumentedIncome: 420000,

  hasIncomeProof: true,

  incomeStability: "medium",

  loanType: "business",

  loanPurpose:
    "Second stock line and delivery vehicle",

  amountWanted: 1500000,

  existingEmi: 0,

  householdExpenses: 30000,

  creditScore: null,

  collateralValue: 4500000,
};

const anita: BorrowerProfile = {
  age: 35,
  incomeType: "informal",

  monthlyIncome: {
    min: 26000,
    max: 30000,
  },

  incomeStability: "low",

  loanType: "two_wheeler",

  loanPurpose: "Electric scooter",

  amountWanted: 150000,

  existingEmi: 35000,

  householdExpenses: 20000,

  creditScore: null,

  pastBounces: 1,
};

describe("Loanly assessment engine", () => {
  it("assesses Priya", () => {
    const result = runAssessment(priya);

    expect(result.product).toBe("personal");

    expect(result.fairRate.min).toBeGreaterThan(0);

    expect(result.fairRate.max).toBeGreaterThanOrEqual(
      result.fairRate.min
    );

    expect(result.safeEmi).toBeGreaterThan(0);

    expect(result.safeAmount.max).toBeGreaterThan(0);
  });

  it("routes Ravi toward a secured product", () => {
    const result = runAssessment(ravi);

    expect(result.product).toBe("lap");

    expect(result.fairRate.max).toBeGreaterThan(
      result.fairRate.min
    );

    expect(result.safeAmount.max).toBeGreaterThan(0);
  });

  it("recognizes Anita's high-risk borrowing situation", () => {
    const result = runAssessment(anita);

    expect([
      "DONT_BORROW",
      "BORROW_LESS",
    ]).toContain(result.verdict);

    expect(result.stressEmi).toBeGreaterThan(0);
  });
});