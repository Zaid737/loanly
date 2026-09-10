import type { Assessment } from "../../types/assessment";

interface NegotiationCardProps {
  assessment: Assessment;
}

function formatRupees(
  value: number
): string {
  return `₹${Math.round(value).toLocaleString(
    "en-IN"
  )}`;
}

export function NegotiationCard({
  assessment,
}: NegotiationCardProps) {
  return (
    <section className="negotiation-card">
      <div className="negotiation-header">
        <div>
          <p className="card-label">
            TAKE THIS TO THE LENDER
          </p>

          <h2>
            My Loanly negotiation card
          </h2>
        </div>

        <span className="loanly-mark">
          LOANLY
        </span>
      </div>

      <div className="negotiation-grid">
        <div>
          <span>
            MAXIMUM EMI I'M COMFORTABLE WITH
          </span>

          <strong>
            {formatRupees(
              assessment.safeEmi
            )}
            /month
          </strong>
        </div>

        <div>
          <span>
            BORROWER-SAFE LOAN RANGE
          </span>

          <strong>
            {formatRupees(
              assessment.safeAmount.min
            )}{" "}
            –{" "}
            {formatRupees(
              assessment.safeAmount.max
            )}
          </strong>
        </div>

        <div>
          <span>
            FAIR INTEREST RATE
          </span>

          <strong>
            {assessment.fairRate.min}% –{" "}
            {assessment.fairRate.max}%
          </strong>
        </div>

        <div>
          <span>
            ALL-IN APR
          </span>

          <strong>
            {assessment.aprRange.min}% –{" "}
            {assessment.aprRange.max}%
          </strong>
        </div>
      </div>

      <div className="negotiation-divider" />

      <div className="negotiation-ask">
        <h3>
          Ask the lender
        </h3>

        <ul>
          <li>
            What is the final interest
            rate and is it fixed or
            floating?
          </li>

          <li>
            What is the total processing
            fee and every other upfront
            charge?
          </li>

          <li>
            What is the actual amount
            that will reach my bank
            account after fees?
          </li>

          <li>
            What will my EMI be for the
            proposed tenure?
          </li>

          <li>
            Are there foreclosure,
            prepayment or other
            penalty charges?
          </li>
        </ul>
      </div>

      <div className="negotiation-bottom">
        <strong>
          My rule:
        </strong>

        <span>
          Don't negotiate only on the
          headline interest rate. Compare
          the EMI, fees and total borrowing
          cost.
        </span>
      </div>
    </section>
  );
}