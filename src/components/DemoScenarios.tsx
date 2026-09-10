import {
  demoBorrowers,
  type DemoBorrower,
} from "../demo/borrowers";

interface DemoScenariosProps {
  onSelect: (
    borrower: DemoBorrower
  ) => void;
}

export function DemoScenarios({
  onSelect,
}: DemoScenariosProps) {
  return (
    <section className="demo-section">
      <div>
        <p className="eyebrow">
          DEMO MODE
        </p>

        <h2>
          Try a borrower scenario
        </h2>

        <p className="demo-description">
          Use these three scenarios to
          see how Loanly changes its
          recommendation based on the
          borrower's situation.
        </p>
      </div>

      <div className="demo-grid">
        {demoBorrowers.map(
          (borrower) => (
            <button
              key={borrower.id}
              type="button"
              className="demo-card"
              onClick={() =>
                onSelect(borrower)
              }
            >
              <strong>
                {borrower.name}
              </strong>

              <span>
                {borrower.description}
              </span>

              <small>
                Try scenario →
              </small>
            </button>
          )
        )}
      </div>
    </section>
  );
}