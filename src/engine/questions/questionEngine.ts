import type {
  BorrowerProfile,
} from "../../types/borrower";

import type {
  QuestionDefinition,
  QuestionId,
} from "./questionTypes";

import {
  questionBank,
} from "./questionBank";

export function getNextQuestion(
  profile: BorrowerProfile,
  answered: QuestionId[]
): QuestionDefinition | null {
  const available =
    questionBank.filter(
      (question) => {
        if (
          answered.includes(
            question.id
          )
        ) {
          return false;
        }

        if (
          question.appliesWhen &&
          !question.appliesWhen(
            profile
          )
        ) {
          return false;
        }

        return true;
      }
    );

  /*
   * Required questions are asked first.
   * These are the core inputs needed
   * to produce a meaningful assessment.
   */
  const requiredQuestion =
    available.find(
      (question) =>
        question.required
    );

  if (
    requiredQuestion
  ) {
    return requiredQuestion;
  }

  /*
   * Once required information is
   * available, ask optional questions
   * in order of decision value.
   */
  const priority: QuestionId[] = [
    "loan_history",
    "credit_score",
    "existing_debt",
    "emergency_savings",
    "collateral",
    "business_income",
    "income_proof",
  ];

  for (
    const id of priority
  ) {
    const question =
      available.find(
        (item) =>
          item.id === id
      );

    if (question) {
      return question;
    }
  }

  return null;
}

export function getQuestionCount(
  profile: BorrowerProfile,
  answered: QuestionId[] = []
): number {
  return questionBank.filter(
    (question) => {
      if (
        answered.includes(
          question.id
        )
      ) {
        return false;
      }

      if (
        question.appliesWhen
      ) {
        return question.appliesWhen(
          profile
        );
      }

      return true;
    }
  ).length;
}