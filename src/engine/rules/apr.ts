import {
  calculateEmi,
  calculateEffectiveApr,
  calculateProcessingFee,
  calculateTotalInterest,
} from "./calculations";

import type { Range } from "../../types/borrower";

export interface AprResult {
  apr: Range;

  processingFee: number;

  totalInterest: Range;

  totalCost: Range;
}

export function calculateApr(
  principal: number,
  rate: Range,
  tenureMonths: number,
  processingFeeRate: number
): AprResult {
  if (
    principal <= 0 ||
    tenureMonths <= 0
  ) {
    return {
      apr: {
        min: 0,
        max: 0,
      },

      processingFee: 0,

      totalInterest: {
        min: 0,
        max: 0,
      },

      totalCost: {
        min: 0,
        max: 0,
      },
    };
  }

  const minEmi =
    calculateEmi(
      principal,
      rate.min,
      tenureMonths
    );

  const maxEmi =
    calculateEmi(
      principal,
      rate.max,
      tenureMonths
    );

  const minInterest =
    calculateTotalInterest(
      principal,
      minEmi,
      tenureMonths
    );

  const maxInterest =
    calculateTotalInterest(
      principal,
      maxEmi,
      tenureMonths
    );

  const processingFee =
    calculateProcessingFee(
      principal,
      processingFeeRate
    );

  const minApr =
    calculateEffectiveApr(
      principal,
      rate.min,
      tenureMonths,
      processingFeeRate
    );

  const maxApr =
    calculateEffectiveApr(
      principal,
      rate.max,
      tenureMonths,
      processingFeeRate
    );

  return {
    apr: {
      min: Number(
        minApr.toFixed(2)
      ),

      max: Number(
        maxApr.toFixed(2)
      ),
    },

    processingFee,

    totalInterest: {
      min: Math.round(
        minInterest
      ),

      max: Math.round(
        maxInterest
      ),
    },

    totalCost: {
      min: Math.round(
        minInterest +
          processingFee
      ),

      max: Math.round(
        maxInterest +
          processingFee
      ),
    },
  };
}