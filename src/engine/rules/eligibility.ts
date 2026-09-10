import type { BorrowerProfile } from "../../types/borrower";
import type { Verdict } from "../../types/assessment";

export interface EligibilityResult {
  verdict: Verdict;
  reasons: string[];
}

export function determineVerdict(
  profile: BorrowerProfile,
  safeAmount: number
): EligibilityResult {
  const wanted = profile.amountWanted ?? 0;

  const existingEmi =
    profile.existingEmi ?? 0;

  const income =
    profile.monthlyIncome?.min ?? 0;

  const existingDebtBalance =
    profile.existingDebtBalance ?? 0;

  const existingDebtRate =
    profile.existingDebtRate ?? 0;

  const pastBounces =
    profile.pastBounces ?? 0;

  /*
   * 1. No repayment capacity.
   */
  if (safeAmount <= 0) {
    return {
      verdict: "DONT_BORROW",
      reasons: [
        "Your current income, expenses and existing obligations leave little or no room for another EMI.",
      ],
    };
  }

  /*
   * 2. High-cost debt + recent bounced payment.
   *
   * This is our strongest negative signal.
   */
  if (
    existingDebtBalance > 0 &&
    existingDebtRate >= 30 &&
    pastBounces > 0
  ) {
    return {
      verdict: "DONT_BORROW",
      reasons: [
        "You already have high-cost debt and a recent bounced payment, so adding another loan could make the existing repayment problem worse.",
      ],
    };
  }

  /*
   * 3. High-cost existing debt.
   */
  if (
    existingDebtBalance > 0 &&
    existingDebtRate >= 30
  ) {
    return {
      verdict: "BORROW_LESS",
      reasons: [
        "You already have high-cost debt, so adding another loan could increase your overall borrowing cost and repayment burden.",
      ],
    };
  }

  /*
   * 4. Recent missed/bounced payment.
   */
  if (pastBounces > 0) {
    return {
      verdict: "BORROW_LESS",
      reasons: [
        "You have a recent missed or bounced payment, so taking on additional debt carries higher repayment risk.",
      ],
    };
  }

  /*
   * 5. Existing EMI already consumes 50%+ of income.
   */
  if (
    income > 0 &&
    existingEmi / income >= 0.50
  ) {
    return {
      verdict: "DONT_BORROW",
      reasons: [
        "Your existing loan EMIs already consume a large share of your income.",
      ],
    };
  }

  /*
   * 6. Requested amount is substantially above
   * borrower-safe capacity.
   */
  if (
    wanted > safeAmount * 1.25
  ) {
    return {
      verdict: "BORROW_LESS",
      reasons: [
        "The amount you want is substantially above what Loanly estimates you can safely repay.",
      ],
    };
  }

  /*
   * 7. Requested amount exceeds safe amount.
   */
  if (wanted > safeAmount) {
    return {
      verdict: "BORROW_LESS",
      reasons: [
        "Your requested amount is above the borrower-safe range, so borrowing less would leave more repayment headroom.",
      ],
    };
  }

  /*
   * 8. Low income stability.
   */
  if (
    profile.incomeStability === "low"
  ) {
    return {
      verdict: "BORROW_LESS",
      reasons: [
        "Your income varies significantly, so keeping the new loan smaller provides more repayment headroom.",
      ],
    };
  }

  /*
   * 9. Otherwise, borrowing is within the
   * current borrower-safe range.
   */
  return {
    verdict: "BORROW",
    reasons: [
      "The requested amount is within the borrower-safe repayment range based on the information provided.",
    ],
  };
}