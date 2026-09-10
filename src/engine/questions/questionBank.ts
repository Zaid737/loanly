import type {
  QuestionDefinition,
} from "./questionTypes";

export const questionBank: QuestionDefinition[] = [
  /*
   * --------------------------------------------------
   * Core questions
   * --------------------------------------------------
   */

  {
    id: "purpose",

    text:
      "What do you need the loan for?",

    required: true,

    affects: [
      "borrow_decision",
      "fair_rate",
      "product",
    ],
  },

  {
    id: "amount",

    text:
      "How much are you looking to borrow?",

    required: true,

    affects: [
      "borrow_decision",
      "lender_amount",
      "safe_amount",
      "emi",
    ],
  },

  {
    id: "loan_type",

    text:
      "What type of loan are you considering?",

    required: true,

    affects: [
      "fair_rate",
      "product",
    ],
  },

  {
    id: "income",

    text:
      "What is your usual monthly take-home income?",

    required: true,

    affects: [
      "lender_amount",
      "safe_amount",
      "emi",
      "stress",
      "confidence",
    ],
  },

  {
    id: "income_stability",

    text:
      "How stable is your monthly income?",

    required: true,

    affects: [
      "safe_amount",
      "emi",
      "stress",
      "fair_rate",
      "confidence",
    ],
  },

  {
    id: "existing_emi",

    text:
      "How much do you currently pay toward loans every month?",

    required: true,

    affects: [
      "safe_amount",
      "emi",
      "stress",
      "confidence",
    ],
  },

  {
    id: "household_expenses",

    text:
      "About how much does your household spend each month, excluding existing EMIs?",

    required: true,

    affects: [
      "safe_amount",
      "emi",
      "stress",
      "confidence",
    ],
  },

  {
    id: "age",

    text:
      "What's your age?",

    required: true,

    affects: [
      "lender_amount",
      "stress",
      "confidence",
    ],
  },

  /*
   * --------------------------------------------------
   * Optional questions
   * --------------------------------------------------
   */

  {
    id: "credit_score",

    text:
      "Do you know your credit score?",

    required: false,

    affects: [
      "fair_rate",
      "confidence",
    ],
  },

  {
    id: "emergency_savings",

    text:
      "How much emergency savings would you have left after taking this loan?",

    required: false,

    affects: [
      "borrow_decision",
      "safe_amount",
      "stress",
      "confidence",
    ],
  },

  {
    id: "loan_history",

    text:
      "Have you had any recent missed or bounced loan payments?",

    required: false,

    affects: [
      "fair_rate",
      "borrow_decision",
      "confidence",
    ],
  },

  /*
   * High-cost debt question.
   */
  {
    id: "existing_debt",

    text:
      "Do you currently have any high-interest loans or app loans? If yes, roughly how much is outstanding and at what rate?",

    required: false,

    affects: [
      "borrow_decision",
      "fair_rate",
      "confidence",
    ],
  },

  /*
   * Self-employed collateral path.
   */
  {
    id: "collateral",

    text:
      "Do you have property or another asset you could use as collateral?",

    required: false,

    appliesWhen: (
      profile
    ) =>
      profile.incomeType ===
        "self_employed" &&
      (profile.amountWanted ??
        0) >= 1_000_000,

    affects: [
      "product",
      "lender_amount",
      "fair_rate",
      "confidence",
    ],
  },

  /*
   * Business/informal income path.
   */
  {
    id: "business_income",

    text:
      "What has your business or variable income looked like over the last 6–12 months?",

    required: false,

    appliesWhen: (
      profile
    ) =>
      profile.incomeType ===
        "self_employed" ||
      profile.incomeType ===
        "informal",

    affects: [
      "lender_amount",
      "safe_amount",
      "fair_rate",
      "confidence",
    ],
  },

  /*
   * Income documentation.
   */
  {
    id: "income_proof",

    text:
      "Do you have documented income such as salary slips, bank statements or ITRs?",

    required: false,

    appliesWhen: (
      profile
    ) =>
      profile.incomeType ===
        "self_employed" ||
      profile.incomeType ===
        "informal",

    affects: [
      "lender_amount",
      "fair_rate",
      "confidence",
    ],
  },
];