import type { BorrowerProfile } from "../types/borrower";

export interface DemoBorrower {
  id: "priya" | "ravi" | "anita";
  name: string;
  description: string;
  profile: BorrowerProfile;
}

export const demoBorrowers: DemoBorrower[] = [
  {
    id: "priya",
    name: "Priya",
    description:
      "Salaried software engineer seeking ₹8L for a wedding.",
    profile: {
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
      emergencySavings: 150000,
      pastBounces: 0,
      existingDebtBalance: 0,
      existingDebtRate: 0,
      hasIncomeProof: true,
    },
  },

  {
    id: "ravi",
    name: "Ravi",
    description:
      "Self-employed kirana owner seeking ₹15L for stock and delivery.",
    profile: {
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
      pastBounces: 0,
      existingDebtBalance: 0,
      existingDebtRate: 0,
    },
  },

  {
    id: "anita",
    name: "Anita",
    description:
      "Informal delivery rider seeking ₹1.5L for an electric scooter.",
    profile: {
      age: 35,
      incomeType: "informal",
      monthlyIncome: {
        min: 26000,
        max: 30000,
      },
      incomeStability: "low",
      loanType: "two_wheeler",
      loanPurpose:
        "Electric scooter to increase delivery runs",
      amountWanted: 150000,
      existingEmi: 0,
      existingDebtBalance: 35000,
      existingDebtRate: 30,
      existingLoanCount: 3,
      householdExpenses: 20000,
      creditScore: null,
      pastBounces: 1,
      emergencySavings: 0,
      hasIncomeProof: false,
    },
  },
];