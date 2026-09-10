/**
 * Pure financial calculations.
 *
 * These functions do not make lending decisions.
 * Decision rules live in separate rule files.
 */

export function calculateMaxEmi(
  monthlyIncome: number,
  existingEmi: number,
  householdExpenses: number,
  foir: number,
  minimumBuffer: number
): number {
  if (monthlyIncome <= 0) {
    return 0;
  }

  const foirBasedCapacity =
    monthlyIncome * foir -
    existingEmi;

  const cashFlowBasedCapacity =
    monthlyIncome -
    existingEmi -
    householdExpenses -
    minimumBuffer;

  return Math.max(
    0,
    Math.min(
      foirBasedCapacity,
      cashFlowBasedCapacity
    )
  );
}

export function calculateEmi(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (
    principal <= 0 ||
    tenureMonths <= 0
  ) {
    return 0;
  }

  const monthlyRate =
    annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return (
      principal / tenureMonths
    );
  }

  const factor = Math.pow(
    1 + monthlyRate,
    tenureMonths
  );

  return (
    principal *
    monthlyRate *
    factor /
    (factor - 1)
  );
}

export function calculateLoanFromEmi(
  emi: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (
    emi <= 0 ||
    tenureMonths <= 0
  ) {
    return 0;
  }

  const monthlyRate =
    annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return (
      emi * tenureMonths
    );
  }

  const factor = Math.pow(
    1 + monthlyRate,
    tenureMonths
  );

  return (
    emi *
    (factor - 1) /
    (monthlyRate * factor)
  );
}

export function calculateTotalRepayment(
  emi: number,
  tenureMonths: number
): number {
  if (
    emi <= 0 ||
    tenureMonths <= 0
  ) {
    return 0;
  }

  return (
    emi * tenureMonths
  );
}

export function calculateTotalInterest(
  principal: number,
  emi: number,
  tenureMonths: number
): number {
  const totalRepayment =
    calculateTotalRepayment(
      emi,
      tenureMonths
    );

  return Math.max(
    0,
    totalRepayment - principal
  );
}

export function calculateProcessingFee(
  principal: number,
  processingFeeRate: number
): number {
  if (
    principal <= 0 ||
    processingFeeRate < 0
  ) {
    return 0;
  }

  return (
    principal *
    processingFeeRate /
    100
  );
}

/**
 * Calculates effective annual borrowing cost
 * using the net amount received after processing fee.
 *
 * This is an approximate borrower-comparison APR,
 * not a regulatory APR implementation.
 */
export function calculateEffectiveApr(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  processingFeeRate: number
): number {
  if (
    principal <= 0 ||
    tenureMonths <= 0
  ) {
    return 0;
  }

  const emi =
    calculateEmi(
      principal,
      annualRate,
      tenureMonths
    );

  const fee =
    calculateProcessingFee(
      principal,
      processingFeeRate
    );

  const netDisbursement =
    principal - fee;

  if (netDisbursement <= 0) {
    return 0;
  }

  /*
   * Binary search for monthly IRR.
   */
  let low = 0;
  let high = 1;

  for (
    let iteration = 0;
    iteration < 100;
    iteration++
  ) {
    const monthlyRate =
      (low + high) / 2;

    let presentValue = 0;

    for (
      let month = 1;
      month <= tenureMonths;
      month++
    ) {
      presentValue +=
        emi /
        Math.pow(
          1 + monthlyRate,
          month
        );
    }

    if (
      presentValue >
      netDisbursement
    ) {
      low = monthlyRate;
    } else {
      high = monthlyRate;
    }
  }

  const monthlyIrr =
    (low + high) / 2;

  return (
    Math.pow(
      1 + monthlyIrr,
      12
    ) -
    1
  ) * 100;
}

export function calculateTotalBorrowingCost(
  principal: number,
  emi: number,
  tenureMonths: number,
  processingFeeRate: number
): number {
  const interest =
    calculateTotalInterest(
      principal,
      emi,
      tenureMonths
    );

  const processingFee =
    calculateProcessingFee(
      principal,
      processingFeeRate
    );

  return (
    interest +
    processingFee
  );
}

export function calculateStressEmi(
  principal: number,
  annualRate: number,
  rateIncrease: number,
  tenureMonths: number
): number {
  return calculateEmi(
    principal,
    annualRate + rateIncrease,
    tenureMonths
  );
}

export function calculateStressIncome(
  monthlyIncome: number,
  incomeReduction: number
): number {
  if (monthlyIncome <= 0) {
    return 0;
  }

  return Math.max(
    0,
    monthlyIncome *
      (1 - incomeReduction / 100)
  );
}

export function createRange(
  value: number,
  lowerPercentage: number,
  upperPercentage = 0
): {
  min: number;
  max: number;
} {
  return {
    min: Math.max(
      0,
      Math.round(
        value *
          (1 -
            lowerPercentage /
              100)
      )
    ),

    max: Math.max(
      0,
      Math.round(
        value *
          (1 +
            upperPercentage /
              100)
      )
    ),
  };
}

export function roundToNearestThousand(
  value: number
): number {
  return (
    Math.round(value / 1000) *
    1000
  );
}

export function clamp(
  value: number,
  min: number,
  max: number
): number {
  return Math.min(
    max,
    Math.max(min, value)
  );
}