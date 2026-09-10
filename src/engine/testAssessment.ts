import type { BorrowerProfile } from "../types/borrower";
import { runAssessment } from "./assessment";

const borrowers: Record<string, BorrowerProfile> = {
  Priya: {
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
  },

  Ravi: {
    age: 42,
    incomeType: "self_employed",
    monthlyIncome: {
      min: 40000,
      max: 80000,
    },
    incomeStability: "medium",
    loanType: "business",
    loanPurpose:
      "Second stock line and delivery vehicle",
    amountWanted: 1500000,
    existingEmi: 0,
    householdExpenses: 30000,
    creditScore: null,
    collateralValue: 4500000,
  },

  Anita: {
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
    existingEmi: 3500,
    householdExpenses: 20000,
    creditScore: null,
    pastBounces: 1,
  },
};

for (const [name, profile] of Object.entries(
  borrowers
)) {
  console.log(`\n===== ${name} =====`);

  console.log(
    JSON.stringify(
      runAssessment(profile),
      null,
      2
    )
  );
}