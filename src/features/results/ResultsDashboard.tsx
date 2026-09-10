import type {
  Assessment,
  OutputType,
} from "../../types/assessment";
import { NegotiationCard } from "./NegotiationCard";
import { Copilot } from "../copilot/Copilot";

interface ResultsDashboardProps {
  assessment: Assessment;
  onRestart: () => void;
}

function formatRupees(
  value: number
): string {
  return `₹${Math.round(value).toLocaleString(
    "en-IN"
  )}`;
}

function formatRate(
  min: number,
  max: number
): string {
  return `${min}% – ${max}%`;
}

function getVerdictTitle(
  verdict: Assessment["verdict"]
): string {
  switch (verdict) {
    case "BORROW":
      return "Borrow";

    case "BORROW_LESS":
      return "Borrow less";

    case "DONT_BORROW":
      return "Don't borrow";
  }
}

function getVerdictDescription(
  verdict: Assessment["verdict"]
): string {
  switch (verdict) {
    case "BORROW":
      return "Your requested borrowing is within the borrower-safe range based on what you told us.";

    case "BORROW_LESS":
      return "You may be able to borrow, but your requested amount is higher than what we think you should comfortably carry.";

    case "DONT_BORROW":
      return "Your current repayment capacity does not leave enough room for another loan.";
  }
}

function getReasons(
  assessment: Assessment,
  output: OutputType
): string[] {
  return assessment.reasons
    .filter(
      (reason) =>
        reason.output === output
    )
    .map(
      (reason) => reason.text
    );
}

export function ResultsDashboard({
  assessment,
  onRestart,
}: ResultsDashboardProps) {
  const decisionReasons =
    getReasons(
      assessment,
      "borrow_decision"
    );

  const rateReasons =
    getReasons(
      assessment,
      "fair_rate"
    );

  const productReasons =
    getReasons(
      assessment,
      "product"
    );

  const confidenceReasons =
    getReasons(
      assessment,
      "confidence"
    );

  return (
    <main className="results-page">
      <header className="results-header">
        <div>
          <p className="eyebrow">
            LOANLY
          </p>

          <h1>
            Your borrowing assessment
          </h1>

          <p className="results-subtitle">
            A borrower-first view of what
            you can afford, what may be
            fair, and what to negotiate.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onRestart}
        >
          Start again
        </button>
      </header>

      {/* VERDICT */}
      <section
        className={`verdict-card ${assessment.verdict.toLowerCase()}`}
      >
        <div>
          <p className="card-label">
            SHOULD YOU BORROW?
          </p>

          <h2>
            {getVerdictTitle(
              assessment.verdict
            )}
          </h2>

          <p>
            {getVerdictDescription(
              assessment.verdict
            )}
          </p>
        </div>

        <div className="confidence-pill">
          {assessment.confidence} confidence
        </div>
      </section>

      {decisionReasons.length > 0 && (
        <section className="reason-box">
          <h3>Why?</h3>

          <ul>
            {decisionReasons.map(
              (reason) => (
                <li key={reason}>
                  {reason}
                </li>
              )
            )}
          </ul>
        </section>
      )}

      {/* BORROWING CAPACITY */}
      <section className="section">
        <div className="section-heading">
          <div>
            <p className="card-label">
              HOW MUCH?
            </p>

            <h2>
              Your borrowing capacity
            </h2>
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card primary">
            <p className="metric-label">
              BORROWER-SAFE AMOUNT
            </p>

            <strong>
              {formatRupees(
                assessment.safeAmount.min
              )}{" "}
              –{" "}
              {formatRupees(
                assessment.safeAmount.max
              )}
            </strong>

            <p>
              This is the range Loanly
              recommends you use when
              deciding how much to borrow.
            </p>
          </article>

          <article className="metric-card">
            <p className="metric-label">
              LENDER-STYLE AMOUNT
            </p>

            <strong>
              {formatRupees(
                assessment.lenderAmount.min
              )}{" "}
              –{" "}
              {formatRupees(
                assessment.lenderAmount.max
              )}
            </strong>

            <p>
              A less conservative estimate
              based on lender-style
              affordability.
            </p>
          </article>
        </div>

        <div className="explanation-card">
          <strong>
            Which number should you use?
          </strong>

          <p>
            Use the borrower-safe amount
            when deciding how much debt
            you personally want to carry.
            The lender-style amount is
            shown only as a comparison.
          </p>
        </div>
      </section>

      {/* RATE */}
      <section className="section">
        <div className="section-heading">
          <p className="card-label">
            WHAT RATE IS FAIR?
          </p>

          <h2>
            Fair interest rate
          </h2>
        </div>

        <div className="metric-grid">
          <article className="metric-card primary">
            <p className="metric-label">
              FAIR RATE BAND
            </p>

            <strong>
              {formatRate(
                assessment.fairRate.min,
                assessment.fairRate.max
              )}
            </strong>

            <p>
              Think in a range, not a single
              "fair" number.
            </p>
          </article>

          <article className="metric-card">
            <p className="metric-label">
              ALL-IN APR
            </p>

            <strong>
              {formatRate(
                assessment.aprRange.min,
                assessment.aprRange.max
              )}
            </strong>

            <p>
              Includes the illustrative
              processing fee assumption.
            </p>
          </article>
        </div>

        {rateReasons.length > 0 && (
          <div className="reason-box">
            <h3>
              What influenced the rate?
            </h3>

            <ul>
              {rateReasons.map(
                (reason) => (
                  <li key={reason}>
                    {reason}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </section>

      {/* EMI */}
      <section className="section">
        <div className="section-heading">
          <p className="card-label">
            WHAT EMI SHOULD YOU AGREE TO?
          </p>

          <h2>
            Monthly repayment
          </h2>
        </div>

        <div className="metric-grid">
          <article className="metric-card primary">
            <p className="metric-label">
              SAFE EMI CEILING
            </p>

            <strong>
              {formatRupees(
                assessment.safeEmi
              )}
              /month
            </strong>

            <p>
              Try to keep the new EMI at
              or below this level.
            </p>
          </article>

          <article className="metric-card">
            <p className="metric-label">
              COMPARISON TENURE
            </p>

            <strong>
              {assessment.recommendedTenure}{" "}
              months
            </strong>

            <p>
              A consistent comparison
              horizon used by Loanly.
            </p>
          </article>

          <article className="metric-card">
            <p className="metric-label">
              STRESS-CASE EMI
            </p>

            <strong>
              {formatRupees(
                assessment.stressEmi
              )}
              /month
            </strong>

            <p>
              Your EMI under Loanly's
              stress scenario.
            </p>
          </article>
        </div>
      </section>

      {/* PRODUCT */}
      <section className="section">
        <div className="section-heading">
          <p className="card-label">
            PRODUCT ROUTE
          </p>

          <h2>
            What type of borrowing?
          </h2>
        </div>

        <div className="product-card">
          <strong>
            {assessment.product ===
            "lap"
              ? "Loan Against Property"
              : assessment.product
                  .replace(
                    "_",
                    " "
                  )
                  .replace(
                    /^\w/,
                    (letter) =>
                      letter.toUpperCase()
                  )}
          </strong>

          {productReasons.length >
            0 && (
            <ul>
              {productReasons.map(
                (reason) => (
                  <li key={reason}>
                    {reason}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </section>

      {/* CONFIDENCE */}
      <section className="section">
        <div className="section-heading">
          <p className="card-label">
            HOW CONFIDENT?
          </p>

          <h2>
            Assessment confidence
          </h2>
        </div>

        <div className="confidence-card">
          <strong>
            {assessment.confidence
              .toUpperCase()}
          </strong>

          <p>
            Confidence reflects how much
            important borrower information
            was available.
          </p>

          {confidenceReasons.length >
            0 && (
            <>
              <h3>
                Information still unknown
              </h3>

              <ul>
                {confidenceReasons.map(
                  (reason) => (
                    <li key={reason}>
                      {reason}
                    </li>
                  )
                )}
              </ul>
            </>
          )}
        </div>
      </section>

      {/* NEGOTIATION CARD */}
            <NegotiationCard
        assessment={assessment}
      />

      <Copilot
        assessment={assessment}
      />

      <footer className="results-footer">
        <p>
          Loanly is a borrower self-assessment
          tool, not a lender credit model.
        </p>
      </footer>
    </main>
  );
}