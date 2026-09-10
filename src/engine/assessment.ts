import type {
  BorrowerProfile,
} from "../types/borrower";

import type {
  Assessment,
  Reason,
} from "../types/assessment";

import {
  calculateAffordability,
} from "./rules/affordability";

import {
  calculateLoanAmounts,
} from "./rules/loanAmount";

import {
  calculateFairRate,
} from "./rules/rates";

import {
  calculateApr,
} from "./rules/apr";

import {
  calculateStress,
} from "./rules/stress";

import {
  calculateConfidence,
} from "./rules/confidence";

import {
  routeProduct,
} from "./rules/productRouting";

import {
  determineVerdict,
} from "./rules/eligibility";



const DEFAULT_TENURE = 60;
const PROCESSING_FEE_RATE = 2;

export function runAssessment(
  profile: BorrowerProfile
): Assessment {
  /*
   * Product routing happens before rate
   * and amount calculations because the
   * product affects pricing.
   */
  const product =
    routeProduct(profile);

  const productProfile: BorrowerProfile = {
    ...profile,
    loanType: product,
  };

  const affordability =
    calculateAffordability(
      productProfile
    );

  const fairRateResult =
    calculateFairRate(
      productProfile
    );

  const fairRate =
    fairRateResult.rate;

  const loanAmounts =
    calculateLoanAmounts(
      productProfile
    );

  const requestedAmount =
    profile.amountWanted ?? 0;

  /*
   * Decide the borrower verdict using
   * the safe amount.
   */
  const eligibility =
    determineVerdict(
      productProfile,
      loanAmounts.safeAmount.max
    );

  /*
   * Calculate the amount we actually
   * want to use for the borrower-facing
   * EMI comparison.
   *
   * If the borrower wants less than the
   * safe maximum, use their requested
   * amount.
   *
   * If they want more, cap the comparison
   * at the safe amount.
   */
  const comparisonPrincipal =
    requestedAmount > 0
      ? Math.min(
          requestedAmount,
          loanAmounts.safeAmount.max
        )
      : loanAmounts.safeAmount.max;

  const representativeRate =
    (fairRate.min +
      fairRate.max) /
    2;

  /*
   * EMI is calculated using the
   * representative fair rate.
   */
 

  /*
   * APR is calculated against the
   * same borrower-facing principal.
   */
  const aprResult =
    calculateApr(
      comparisonPrincipal,
      fairRate,
      DEFAULT_TENURE,
      PROCESSING_FEE_RATE
    );

  /*
   * Stress the same principal used
   * for the EMI comparison.
   */
  const stressResult =
    calculateStress(
      productProfile,
      comparisonPrincipal,
      representativeRate,
      DEFAULT_TENURE
    );

  const confidenceResult =
    calculateConfidence(
      productProfile
    );

  const reasons: Reason[] = [];

  /*
   * Borrow decision
   */
  for (
    const reason of
      eligibility.reasons
  ) {
    reasons.push({
      output:
        "borrow_decision",
      text: reason,
    });
  }

  /*
   * Safe amount
   */
  reasons.push({
    output: "safe_amount",
    text:
      "The borrower-safe range uses a conservative 40% FOIR, existing EMIs, household expenses and a ₹15,000 monthly cash-flow buffer.",
  });

  /*
   * Lender-style amount
   */
  reasons.push({
    output:
      "lender_amount",
    text:
      "The lender-style range uses a 50% FOIR, making it a less conservative affordability estimate than the borrower-safe range.",
  });

  /*
   * Fair rate
   */
  for (
    const reason of
      fairRateResult.reasons
  ) {
    reasons.push({
      output: "fair_rate",
      text: reason,
    });
  }

  /*
   * EMI
   */
  reasons.push({
    output: "emi",
    text:
      `The comparison EMI is based on ₹${Math.round(
        comparisonPrincipal
      ).toLocaleString(
        "en-IN"
      )} over ${DEFAULT_TENURE} months at the midpoint of the fair-rate band.`,
  });

  /*
   * Stress
   */
  reasons.push({
    output: "stress",
    text:
      stressResult.description,
  });

  /*
   * Product
   */
  if (
    product === "lap"
  ) {
    reasons.push({
      output: "product",
      text:
        "Because you are self-employed, have meaningful collateral and are seeking a large loan, Loanly routes the assessment toward a secured Loan Against Property route.",
    });
  } else {
    reasons.push({
      output: "product",
      text:
        `Loanly is assessing this as a ${product.replace(
          "_",
          " "
        )} loan.`,
    });
  }

  /*
   * Confidence
   */
  for (
    const reason of
      confidenceResult.reasons
  ) {
    reasons.push({
      output:
        "confidence",
      text: reason,
    });
  }

  /*
   * Recommended amount is the lower
   * of requested and safe amount.
   */
  let recommendedMin = 0;
  let recommendedMax = 0;

  if (
    requestedAmount > 0
  ) {
    recommendedMin =
      Math.min(
        requestedAmount,
        loanAmounts.safeAmount.min
      );

    recommendedMax =
      Math.min(
        requestedAmount,
        loanAmounts.safeAmount.max
      );

    if (
      recommendedMin >
      recommendedMax
    ) {
      recommendedMin =
        recommendedMax;
    }
  } else {
    recommendedMin =
      loanAmounts.safeAmount.min;

    recommendedMax =
      loanAmounts.safeAmount.max;
  }

  return {
    verdict:
      eligibility.verdict,

    lenderAmount:
      loanAmounts.lenderAmount,

    safeAmount:
      loanAmounts.safeAmount,

    recommendedAmount: {
      min:
        recommendedMin,
      max:
        recommendedMax,
    },

    fairRate,

    aprRange:
      aprResult.apr,

    /*
     * Keep the explicit safe EMI ceiling
     * as the main affordability number.
     */
    safeEmi:
      Math.round(
        affordability.safeEmi
      ),

    stressEmi:
      Math.round(
        stressResult.stressedEmi
      ),

    recommendedTenure:
      DEFAULT_TENURE,

    product,

    confidence:
      confidenceResult.level,

    reasons,
  };
}