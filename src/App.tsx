import { useState } from "react";

import {
  Questionnaire,
} from "./features/questionnaire/Questionnaire";

import {
  ResultsDashboard,
} from "./features/results/ResultsDashboard";

import type {
  BorrowerProfile,
} from "./types/borrower";

import type {
  Assessment,
} from "./types/assessment";

import {
  runAssessment,
} from "./engine/assessment";

import type {
  DemoBorrower,
} from "./demo/borrowers";

function App() {
  const [assessment, setAssessment] =
    useState<Assessment | null>(
      null
    );

  function handleComplete(
    profile: BorrowerProfile
  ) {
    const result =
      runAssessment(profile);

    setAssessment(result);
  }

  function handleDemoSelect(
    borrower: DemoBorrower
  ) {
    const result =
      runAssessment(
        borrower.profile
      );

    setAssessment(result);
  }

  function restart() {
    setAssessment(null);
  }

  if (assessment) {
    return (
      <ResultsDashboard
        assessment={assessment}
        onRestart={restart}
      />
    );
  }

  return (
    <Questionnaire
      onComplete={
        handleComplete
      }
      onDemoSelect={
        handleDemoSelect
      }
    />
  );
}

export default App;