import type {
  BorrowerProfile,
  LoanType,
} from "../../types/borrower";

export function routeProduct(
  profile: BorrowerProfile
): LoanType {
  /*
   * Large self-employed borrowing with collateral
   * should be evaluated as secured borrowing.
   *
   * This is particularly important for Ravi's scenario.
   */
  if (
    profile.incomeType ===
      "self_employed" &&
    (profile.collateralValue ?? 0) >
      0 &&
    (profile.amountWanted ?? 0) >=
      1_000_000
  ) {
    return "lap";
  }

  /*
   * Otherwise respect the borrower's
   * requested loan type.
   */
  if (profile.loanType) {
    return profile.loanType;
  }

  return "personal";
}