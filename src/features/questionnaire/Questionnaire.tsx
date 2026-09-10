import { useMemo, useState } from "react";

import type {
  BorrowerProfile,
  Range,
} from "../../types/borrower";

import type { QuestionId } from "../../engine/questions/questionTypes";

import {
  getNextQuestion,
  getQuestionCount,
} from "../../engine/questions/questionEngine";

import type {
  DemoBorrower,
} from "../../demo/borrowers";

import { DemoScenarios } from "../../components/DemoScenarios";

interface QuestionnaireProps {
  onComplete: (
    profile: BorrowerProfile
  ) => void;

  onDemoSelect?: (
    borrower: DemoBorrower
  ) => void;
}

export function Questionnaire({
  onComplete,
  onDemoSelect,
}: QuestionnaireProps) {
  const [profile, setProfile] =
    useState<BorrowerProfile>({});

  const [answered, setAnswered] =
    useState<QuestionId[]>([]);

  const [showAiIntake, setShowAiIntake] =
    useState(true);

  const question = useMemo(
    () =>
      getNextQuestion(
        profile,
        answered
      ),
    [profile, answered]
  );

const totalQuestions =
  getQuestionCount(
    profile,
    answered
  );

  const totalAvailableQuestions =
  answered.length +
  totalQuestions;

const progress =
  totalAvailableQuestions === 0
    ? 0
    : Math.min(
        100,
        Math.round(
          (answered.length /
            totalAvailableQuestions) *
            100
        )
      );
  /*
   * Maps the fields extracted by AI
   * to the IDs used by the question engine.
   *
   * Example:
   *
   * AI:
   * monthlyIncome
   *
   * Question engine:
   * income
   */
  function getAnsweredQuestionIds(
    aiProfile: BorrowerProfile
  ): QuestionId[] {
    const answeredIds: QuestionId[] =
      [];

    if (
      aiProfile.loanPurpose !==
        undefined &&
      aiProfile.loanPurpose.trim()
        .length > 0
    ) {
      answeredIds.push(
        "purpose"
      );
    }

    if (
      aiProfile.amountWanted !==
      undefined
    ) {
      answeredIds.push(
        "amount"
      );
    }

    if (
      aiProfile.loanType !==
      undefined
    ) {
      answeredIds.push(
        "loan_type"
      );
    }

    if (
      aiProfile.monthlyIncome !==
      undefined
    ) {
      answeredIds.push(
        "income"
      );
    }

    if (
      aiProfile.incomeStability !==
        undefined &&
      aiProfile.incomeStability !==
        "unknown"
    ) {
      answeredIds.push(
        "income_stability"
      );
    }

    if (
      aiProfile.existingEmi !==
      undefined
    ) {
      answeredIds.push(
        "existing_emi"
      );
    }

    if (
      aiProfile.householdExpenses !==
      undefined
    ) {
      answeredIds.push(
        "household_expenses"
      );
    }

    if (
      aiProfile.age !==
      undefined
    ) {
      answeredIds.push(
        "age"
      );
    }

    if (
      aiProfile.creditScore !==
        undefined &&
      aiProfile.creditScore !==
        null
    ) {
      answeredIds.push(
        "credit_score"
      );
    }

    if (
      aiProfile.emergencySavings !==
      undefined
    ) {
      answeredIds.push(
        "emergency_savings"
      );
    }

    if (
      aiProfile.pastBounces !==
      undefined
    ) {
      answeredIds.push(
        "loan_history"
      );
    }

    if (
      aiProfile.existingDebtBalance !==
        undefined &&
      aiProfile.existingDebtRate !==
        undefined
    ) {
      answeredIds.push(
        "existing_debt"
      );
    }

    if (
      aiProfile.collateralValue !==
      undefined
    ) {
      answeredIds.push(
        "collateral"
      );
    }

    if (
      aiProfile.businessIncome !==
      undefined
    ) {
      answeredIds.push(
        "business_income"
      );
    }

    if (
      aiProfile.hasIncomeProof !==
      undefined
    ) {
      answeredIds.push(
        "income_proof"
      );
    }

    return answeredIds;
  }

  function handleAiProfile(
    aiProfile: BorrowerProfile
  ) {
    /*
     * Merge AI-extracted information
     * into the existing borrower profile.
     */
    setProfile(
      (current) => ({
        ...current,
        ...aiProfile,
      })
    );

    /*
     * Mark only the questions for which
     * AI actually found an answer.
     */
    const answeredIds =
      getAnsweredQuestionIds(
        aiProfile
      );

    setAnswered(
      answeredIds
    );

    /*
     * Hide AI intake and continue
     * with only missing questions.
     */
    setShowAiIntake(false);
  }

  function handleManualStart() {
    setShowAiIntake(false);
  }

  if (showAiIntake) {
    return (
      <AiIntake
        onProfile={
          handleAiProfile
        }
        onSkip={
          handleManualStart
        }
        onDemoSelect={
          onDemoSelect
        }
      />
    );
  }

  /*
   * No more questions.
   */
  if (!question) {
    return (
      <main className="questionnaire">
        <section className="question-card">
          <p className="eyebrow">
            LOANLY
          </p>

          <h1>
            Assessment complete
          </h1>

          <p>
            We have enough information
            to assess your borrowing
            situation.
          </p>

          <button
            type="button"
            onClick={() =>
              onComplete(
                profile
              )
            }
          >
            See my assessment
          </button>
        </section>
      </main>
    );
  }

  const questionId =
    question.id;

  function answer(
    updates: Partial<BorrowerProfile>
  ) {
    setProfile(
      (current) => ({
        ...current,
        ...updates,
      })
    );

    setAnswered(
      (current) => [
        ...current,
        questionId,
      ]
    );
  }

  function skip() {
    setAnswered(
      (current) => [
        ...current,
        questionId,
      ]
    );
  }

  return (
    <main className="questionnaire">
      <div className="progress-header">
        <span>
          Question{" "}
          {answered.length + 1} of{" "}
          {totalQuestions}
        </span>

        <span>
          {progress}%
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <section className="question-card">
        <p className="eyebrow">
          LOANLY
        </p>

        <h1>
          {question.text}
        </h1>

        <QuestionInput
          questionId={
            questionId
          }
          onAnswer={answer}
        />

        {!question.required && (
          <button
            type="button"
            className="skip-button"
            onClick={skip}
          >
            I don't know / Skip
          </button>
        )}
      </section>
    </main>
  );
}

/* --------------------------------
   AI INTAKE
-------------------------------- */

interface AiIntakeProps {
  onProfile: (
    profile: BorrowerProfile
  ) => void;

  onSkip: () => void;

  onDemoSelect?: (
    borrower: DemoBorrower
  ) => void;
}

function AiIntake({
  onProfile,
  onSkip,
  onDemoSelect,
}: AiIntakeProps) {
  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function extractProfile() {
    if (
      !message.trim() ||
      loading
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/intake",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              message:
                message.trim(),
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          data.error ||
            "Unable to process your information."
        );
      }

      if (
        !data.facts ||
        typeof data.facts !==
          "object"
      ) {
        throw new Error(
          "AI returned an invalid borrower profile."
        );
      }

      const facts =
        data.facts;

      const profile: BorrowerProfile =
        {
          age:
            facts.age ??
            undefined,

          incomeType:
            facts.incomeType ??
            undefined,

          monthlyIncome:
            facts.monthlyIncome ??
            undefined,

          incomeStability:
            facts.incomeStability ??
            undefined,

          loanType:
            facts.loanType ??
            undefined,

          loanPurpose:
            facts.loanPurpose ??
            undefined,

          amountWanted:
            facts.amountWanted ??
            undefined,

          existingEmi:
            facts.existingEmi ??
            undefined,

          householdExpenses:
            facts.householdExpenses ??
            undefined,

          creditScore:
            facts.creditScore ??
            null,

          emergencySavings:
            facts.emergencySavings ??
            undefined,

          pastBounces:
            facts.pastBounces ??
            undefined,

          existingDebtBalance:
            facts.existingDebtBalance ??
            undefined,

          existingDebtRate:
            facts.existingDebtRate ??
            undefined,

          collateralValue:
            facts.collateralValue ??
            undefined,

          annualDocumentedIncome:
            facts.annualDocumentedIncome ??
            undefined,

          hasIncomeProof:
            facts.hasIncomeProof ??
            undefined,
        };

      onProfile(
        profile
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function useDemo(
    borrower: DemoBorrower
  ) {
    if (
      onDemoSelect
    ) {
      onDemoSelect(
        borrower
      );
    }
  }

  return (
    <main className="questionnaire">
      <section className="question-card ai-intake-card">
        <p className="eyebrow">
          LOANLY AI
        </p>

        <h1>
          Tell us about your
          borrowing situation
        </h1>

        <p>
          Describe your situation in
          your own words. Loanly will
          extract what you tell us and
          only ask for information that
          is still missing.
        </p>

        <textarea
          className="ai-intake-textarea"
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          placeholder={
            "Example: I'm 29, a software engineer earning ₹1.1 lakh per month. I already pay ₹14,000 for my car loan and spend around ₹28,000 a month on household expenses. My credit score is 780. I have ₹1.5 lakh in savings and want ₹8 lakh for my wedding."
          }
          rows={8}
        />

        {error && (
          <div className="ai-error">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={
            !message.trim() ||
            loading
          }
          onClick={
            extractProfile
          }
        >
          {loading
            ? "Understanding your situation..."
            : "Build my assessment →"}
        </button>

        <div className="ai-intake-divider">
          <span>
            OR
          </span>
        </div>

        {onDemoSelect && (
          <div>
            <p className="demo-inline-label">
              Try a demo borrower
            </p>

            <DemoScenarios
              onSelect={
                useDemo
              }
            />
          </div>
        )}

        <button
          type="button"
          className="skip-button"
          onClick={onSkip}
        >
          I'd rather answer questions
        </button>
      </section>
    </main>
  );
}

/* --------------------------------
   MANUAL QUESTIONS
-------------------------------- */

interface QuestionInputProps {
  questionId: QuestionId;

  onAnswer: (
    updates: Partial<BorrowerProfile>
  ) => void;
}

function QuestionInput({
  questionId,
  onAnswer,
}: QuestionInputProps) {
  const [value, setValue] =
    useState("");

  const [minValue, setMinValue] =
    useState("");

  const [maxValue, setMaxValue] =
    useState("");

  const [rateValue, setRateValue] =
    useState("");

  function submitRange(
    field:
      | "income"
      | "business_income"
  ) {
    const min =
      Number(minValue);

    const max =
      Number(maxValue);

    if (
      min <= 0 ||
      max <= 0 ||
      min > max
    ) {
      return;
    }

    const range: Range = {
      min,
      max,
    };

    if (
      field === "income"
    ) {
      onAnswer({
        monthlyIncome:
          range,
      });
    } else {
      onAnswer({
        businessIncome:
          range,
      });
    }
  }

  function submitNumber() {
    const number =
      Number(value);

    if (
      !Number.isFinite(
        number
      ) ||
      number < 0
    ) {
      return;
    }

    switch (questionId) {
      case "age":
        onAnswer({
          age: number,
        });
        return;

      case "amount":
        onAnswer({
          amountWanted:
            number,
        });
        return;

      case "existing_emi":
        onAnswer({
          existingEmi:
            number,
        });
        return;

      case "household_expenses":
        onAnswer({
          householdExpenses:
            number,
        });
        return;

      case "credit_score":
        onAnswer({
          creditScore:
            number,
        });
        return;

      case "emergency_savings":
        onAnswer({
          emergencySavings:
            number,
        });
        return;

      case "collateral":
        onAnswer({
          collateralValue:
            number,
        });
        return;

      default:
        return;
    }
  }

  if (
    questionId === "purpose"
  ) {
    return (
      <div className="input-group">
        <textarea
          placeholder="e.g. wedding, business expansion, education..."
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
        />

        <button
          type="button"
          disabled={
            !value.trim()
          }
          onClick={() =>
            onAnswer({
              loanPurpose:
                value.trim(),
            })
          }
        >
          Continue
        </button>
      </div>
    );
  }

  if (
    questionId === "amount"
  ) {
    return (
      <div className="input-group">
        <input
          type="number"
          min="0"
          placeholder="₹8,00,000"
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
        />

        <button
          type="button"
          disabled={!value}
          onClick={
            submitNumber
          }
        >
          Continue
        </button>
      </div>
    );
  }

  if (
    questionId === "income"
  ) {
    return (
      <div className="input-group">
        <label>
          Minimum monthly income
        </label>

        <input
          type="number"
          min="0"
          placeholder="₹40,000"
          value={minValue}
          onChange={(event) =>
            setMinValue(
              event.target.value
            )
          }
        />

        <label>
          Maximum monthly income
        </label>

        <input
          type="number"
          min="0"
          placeholder="₹80,000"
          value={maxValue}
          onChange={(event) =>
            setMaxValue(
              event.target.value
            )
          }
        />

        <button
          type="button"
          disabled={
            !minValue ||
            !maxValue
          }
          onClick={() =>
            submitRange(
              "income"
            )
          }
        >
          Continue
        </button>
      </div>
    );
  }

  if (
    questionId ===
    "business_income"
  ) {
    return (
      <div className="input-group">
        <label>
          Lowest monthly business income
        </label>

        <input
          type="number"
          min="0"
          placeholder="₹40,000"
          value={minValue}
          onChange={(event) =>
            setMinValue(
              event.target.value
            )
          }
        />

        <label>
          Highest monthly business income
        </label>

        <input
          type="number"
          min="0"
          placeholder="₹80,000"
          value={maxValue}
          onChange={(event) =>
            setMaxValue(
              event.target.value
            )
          }
        />

        <button
          type="button"
          disabled={
            !minValue ||
            !maxValue
          }
          onClick={() =>
            submitRange(
              "business_income"
            )
          }
        >
          Continue
        </button>
      </div>
    );
  }

  if (
    questionId ===
    "income_stability"
  ) {
    return (
      <div className="choice-grid">
        <button
          type="button"
          onClick={() =>
            onAnswer({
              incomeStability:
                "high",
            })
          }
        >
          Very stable
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              incomeStability:
                "medium",
            })
          }
        >
          Somewhat variable
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              incomeStability:
                "low",
            })
          }
        >
          Highly variable
        </button>
      </div>
    );
  }

  if (
    questionId ===
    "loan_type"
  ) {
    return (
      <div className="choice-grid">
        <button
          type="button"
          onClick={() =>
            onAnswer({
              loanType:
                "personal",
            })
          }
        >
          Personal loan
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              loanType:
                "business",
            })
          }
        >
          Business loan
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              loanType: "home",
            })
          }
        >
          Home loan
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              loanType:
                "lap",
            })
          }
        >
          Loan Against Property
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              loanType:
                "gold",
            })
          }
        >
          Gold loan
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              loanType:
                "two_wheeler",
            })
          }
        >
          Two-wheeler loan
        </button>
      </div>
    );
  }

  if (
    questionId ===
    "loan_history"
  ) {
    return (
      <div className="choice-grid">
        <button
          type="button"
          onClick={() =>
            onAnswer({
              pastBounces: 0,
            })
          }
        >
          No
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              pastBounces: 1,
            })
          }
        >
          Yes
        </button>
      </div>
    );
  }

  if (
    questionId ===
    "existing_debt"
  ) {
    return (
      <div className="input-group">
        <label>
          Outstanding amount
        </label>

        <input
          type="number"
          min="0"
          placeholder="₹35,000"
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
        />

        <label>
          Interest rate
        </label>

        <input
          type="number"
          min="0"
          step="0.1"
          placeholder="30%"
          value={rateValue}
          onChange={(event) =>
            setRateValue(
              event.target.value
            )
          }
        />

        <button
          type="button"
          disabled={
            !value ||
            !rateValue
          }
          onClick={() =>
            onAnswer({
              existingDebtBalance:
                Number(value),

              existingDebtRate:
                Number(
                  rateValue
                ),
            })
          }
        >
          Continue
        </button>
      </div>
    );
  }

  if (
    questionId ===
    "collateral"
  ) {
    return (
      <div className="input-group">
        <label>
          Approximate collateral value
        </label>

        <input
          type="number"
          min="0"
          placeholder="₹45,00,000"
          value={value}
          onChange={(event) =>
            setValue(
              event.target.value
            )
          }
        />

        <button
          type="button"
          disabled={!value}
          onClick={
            submitNumber
          }
        >
          Continue
        </button>
      </div>
    );
  }

  if (
    questionId ===
    "income_proof"
  ) {
    return (
      <div className="choice-grid">
        <button
          type="button"
          onClick={() =>
            onAnswer({
              hasIncomeProof:
                true,
            })
          }
        >
          Yes
        </button>

        <button
          type="button"
          onClick={() =>
            onAnswer({
              hasIncomeProof:
                false,
            })
          }
        >
          No
        </button>
      </div>
    );
  }

  return (
    <div className="input-group">
      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) =>
          setValue(
            event.target.value
          )
        }
        placeholder="Enter amount"
      />

      <button
        type="button"
        disabled={!value}
        onClick={
          submitNumber
        }
      >
        Continue
      </button>
    </div>
  );
}