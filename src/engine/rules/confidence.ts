import type { BorrowerProfile } from "../../types/borrower";

import type {
  Confidence,
} from "../../types/assessment";

interface ConfidenceResult {
  level: Confidence;

  score: number;

  reasons: string[];
}

export function calculateConfidence(
  profile: BorrowerProfile
): ConfidenceResult {
  let score = 0;

  const reasons: string[] = [];

  /*
   * Core affordability inputs.
   */
  if (
    profile.monthlyIncome
  ) {
    score += 2;
  } else {
    reasons.push(
      "Monthly income is unknown."
    );
  }

  if (
    profile.existingEmi !==
    undefined
  ) {
    score += 2;
  } else {
    reasons.push(
      "Existing EMI obligations are unknown."
    );
  }

  if (
    profile.householdExpenses !==
    undefined
  ) {
    score += 2;
  } else {
    reasons.push(
      "Household expenses are unknown."
    );
  }

  /*
   * Income characteristics.
   */
  if (
    profile.incomeType
  ) {
    score += 1;
  } else {
    reasons.push(
      "Income type is unknown."
    );
  }

  if (
    profile.incomeStability &&
    profile.incomeStability !==
      "unknown"
  ) {
    score += 1;
  } else {
    reasons.push(
      "Income stability is unknown."
    );
  }

  /*
   * Credit.
   */
  if (
    profile.creditScore !==
      null &&
    profile.creditScore !==
      undefined
  ) {
    score += 1;
  } else {
    reasons.push(
      "Credit score is unknown, so rate confidence is lower."
    );
  }

  /*
   * Basic borrower information.
   */
  if (
    profile.age !== undefined
  ) {
    score += 1;
  } else {
    reasons.push(
      "Age is unknown."
    );
  }

  if (
    profile.loanType
  ) {
    score += 1;
  } else {
    reasons.push(
      "Loan type is unknown."
    );
  }

  if (
    profile.amountWanted !==
    undefined
  ) {
    score += 1;
  } else {
    reasons.push(
      "Requested loan amount is unknown."
    );
  }

  /*
   * Additional risk information.
   */
  if (
    profile.emergencySavings !==
    undefined
  ) {
    score += 1;
  } else {
    reasons.push(
      "Emergency savings are unknown."
    );
  }

  if (
    profile.pastBounces !==
    undefined
  ) {
    score += 1;
  } else {
    reasons.push(
      "Recent payment history is unknown."
    );
  }

  if (
    profile.existingDebtBalance !==
    undefined
  ) {
    score += 1;
  }

  if (
    profile.existingDebtRate !==
    undefined
  ) {
    score += 1;
  }

  /*
   * Self-employed borrowers.
   */
  if (
    profile.incomeType ===
    "self_employed"
  ) {
    if (
      profile.collateralValue !==
      undefined
    ) {
      score += 1;
    } else {
      reasons.push(
        "Collateral information is unknown for a self-employed borrower."
      );
    }

    if (
      profile.annualDocumentedIncome !==
      undefined
    ) {
      score += 1;
    } else {
      reasons.push(
        "Documented annual income is unknown."
      );
    }
  }

  let level: Confidence;

  if (score <= 5) {
    level = "low";
  } else if (score <= 10) {
    level = "medium";
  } else {
    level = "high";
  }

  return {
    level,
    score,
    reasons,
  };
}