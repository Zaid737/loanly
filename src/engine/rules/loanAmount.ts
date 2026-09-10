import type {
  BorrowerProfile,
  Range,
} from "../../types/borrower";

import {
  calculateLoanFromEmi,
  roundToNearestThousand,
} from "./calculations";

import {
  calculateAffordability,
} from "./affordability";

import {
  calculateFairRate,
} from "./rates";

const DEFAULT_TENURE = 60;

export interface LoanAmountResult {
  lenderAmount: Range;

  safeAmount: Range;
}

export function calculateLoanAmounts(
  profile: BorrowerProfile
): LoanAmountResult {
  const {
    lenderEmi,
    safeEmi,
  } = calculateAffordability(
    profile
  );

  const rateResult =
    calculateFairRate(profile);

  const rate =
    rateResult.rate;

  /*
   * Lender-style amount:
   * use the lower end of the fair-rate band.
   */
  const lenderAmount =
    calculateLoanFromEmi(
      lenderEmi,
      rate.min,
      DEFAULT_TENURE
    );

  /*
   * Borrower-safe amount:
   * use the upper end of the fair-rate band.
   *
   * This deliberately avoids overstating
   * what the borrower can safely carry.
   */
  const safeAmount =
    calculateLoanFromEmi(
      safeEmi,
      rate.max,
      DEFAULT_TENURE
    );

  return {
    lenderAmount: {
      min:
        roundToNearestThousand(
          lenderAmount * 0.90
        ),

      max:
        roundToNearestThousand(
          lenderAmount
        ),
    },

    safeAmount: {
      min:
        roundToNearestThousand(
          safeAmount * 0.90
        ),

      max:
        roundToNearestThousand(
          safeAmount
        ),
    },
  };
}