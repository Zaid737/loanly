import {
  useState,
} from "react";

import type {
  Assessment,
} from "../../types/assessment";

interface CopilotProps {
  assessment: Assessment;
}

interface Message {
  role:
    | "user"
    | "assistant";

  content: string;
}

export function Copilot({
  assessment,
}: CopilotProps) {
  const [
    messages,
    setMessages,
  ] = useState<Message[]>([]);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function askCopilot(
    question?: string
  ) {
    const message =
      question ??
      input.trim();

    if (
      !message ||
      loading
    ) {
      return;
    }

    setInput("");

    setMessages(
      (current) => [
        ...current,
        {
          role: "user",
          content: message,
        },
      ]
    );

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/copilot",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              message,
              assessment,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "AI request failed"
        );
      }

      setMessages(
        (current) => [
          ...current,
          {
            role: "assistant",
            content:
              data.answer,
          },
        ]
      );
    } catch {
      setMessages(
        (current) => [
          ...current,
          {
            role: "assistant",
            content:
              "I couldn't reach the Loanly Copilot right now. Your deterministic assessment is still available above.",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="copilot-card">
      <div className="copilot-header">
        <div>
          <p className="card-label">
            LOANLY COPILOT
          </p>

          <h2>
            Ask before you borrow
          </h2>

          <p>
            Ask about your rate, EMI,
            loan amount, fees, or what
            to negotiate with the lender.
          </p>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="copilot-suggestions">
          <button
            type="button"
            onClick={() =>
              askCopilot(
                "Is this a fair borrowing situation for me?"
              )
            }
          >
            Is this fair for me?
          </button>

          <button
            type="button"
            onClick={() =>
              askCopilot(
                "What should I negotiate with the lender?"
              )
            }
          >
            What should I negotiate?
          </button>

          <button
            type="button"
            onClick={() =>
              askCopilot(
                "What should I ask the lender before signing?"
              )
            }
          >
            What should I ask?
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="copilot-messages">
          {messages.map(
            (message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`copilot-message ${message.role}`}
              >
                <span>
                  {message.role ===
                  "user"
                    ? "You"
                    : "Loanly"}
                </span>

                <p>
                  {message.content}
                </p>
              </div>
            )
          )}

          {loading && (
            <div className="copilot-message assistant">
              <span>
                Loanly
              </span>

              <p>
                Thinking...
              </p>
            </div>
          )}
        </div>
      )}

      <form
        className="copilot-input"
        onSubmit={(event) => {
          event.preventDefault();

          void askCopilot();
        }}
      >
        <input
          value={input}
          onChange={(event) =>
            setInput(
              event.target.value
            )
          }
          placeholder="e.g. The lender offered me 16%. Is that fair?"
        />

        <button
          type="submit"
          disabled={
            !input.trim() ||
            loading
          }
        >
          Ask
        </button>
      </form>
    </section>
  );
}