import type {
  BorrowerProfile,
  LoanType,
  Range,
} from "../../types/borrower";

interface RateBand {
  rate: Range;
  reasons: string[];
}

const BASE_RATES: Record<
  LoanType,
  Range
> = {
  personal: {
    min: 10.5,
    max: 18,
  },

  home: {
    min: 8.5,
    max: 11,
  },

  lap: {
    min: 9,
    max: 13,
  },

  gold: {
    min: 9,
    max: 15,
  },

  two_wheeler: {
    min: 10,
    max: 18,
  },

  business: {
    min: 10,
    max: 18,
  },
};

export function calculateFairRate(
  profile: BorrowerProfile
): RateBand {
  const loanType =
    profile.loanType ?? "personal";

  const base =
    BASE_RATES[loanType];

  let min = base.min;
  let max = base.max;

  const reasons: string[] = [];

  const score =
    profile.creditScore;

  /*
   * Credit score adjustment.
   */
  if (
    score !== null &&
    score !== undefined
  ) {
    if (score >= 750) {
      min -= 1;
      max -= 1;

      reasons.push(
        "Your credit score is strong, which supports better pricing."
      );
    } else if (score >= 700) {
      min -= 0.25;
      max -= 0.25;

      reasons.push(
        "Your credit score is reasonably strong."
      );
    } else if (score < 650) {
      min += 1.5;
      max += 2;

      reasons.push(
        "A lower credit score generally increases pricing risk."
      );
    }
  } else {
    max += 1;

    reasons.push(
      "Your credit score is unknown, so the fair-rate range is wider."
    );
  }

  /*
   * Income stability.
   */
  switch (
    profile.incomeStability
  ) {
    case "high":
      max -= 0.5;

      reasons.push(
        "Stable income supports stronger repayment confidence."
      );
      break;

    case "medium":
      reasons.push(
        "Your income has some variability, so the middle of the rate band is more realistic."
      );
      break;

    case "low":
      min += 1;
      max += 2;

      reasons.push(
        "Variable income increases repayment uncertainty."
      );
      break;

    default:
      max += 1;

      reasons.push(
        "Income stability is unknown, so the rate range is wider."
      );
  }

  /*
   * Recent bounced payments.
   */
  if (
    (profile.pastBounces ?? 0) > 0
  ) {
    min += 1;
    max += 2;

    reasons.push(
      "Recent missed or bounced payments increase perceived repayment risk."
    );
  }

  /*
   * High-cost existing debt.
   */
  if (
    (profile.existingDebtRate ?? 0) >= 30 &&
    (profile.existingDebtBalance ?? 0) > 0
  ) {
    min += 1;
    max += 2;

    reasons.push(
      "Existing high-cost debt increases the overall cost and repayment risk of taking another loan."
    );
  }

  /*
   * Collateral-backed lending.
   */
  if (
    loanType === "lap" ||
    loanType === "gold"
  ) {
    min -= 0.25;
    max -= 0.5;

    reasons.push(
      "Collateral-backed lending generally supports lower pricing than unsecured borrowing."
    );
  }

  min = Math.max(
    1,
    Number(min.toFixed(2))
  );

  max = Math.max(
    min,
    Number(max.toFixed(2))
  );

  return {
    rate: {
      min,
      max,
    },
    reasons,
  };
}