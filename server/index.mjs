import http from "node:http";
import OpenAI from "openai";

const PORT = 8787;

const model =
  process.env.OPENAI_MODEL || "gpt-5.6-luna";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function sendJson(
  res,
  statusCode,
  data
) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin":
      "http://localhost:5173",
  });

  res.end(
    JSON.stringify(data)
  );
}

function readJson(req) {
  return new Promise(
    (resolve, reject) => {
      let body = "";

      req.on(
        "data",
        (chunk) => {
          body += chunk;
        }
      );

      req.on(
        "end",
        () => {
          try {
            resolve(
              JSON.parse(body)
            );
          } catch {
            reject(
              new Error(
                "Invalid JSON"
              )
            );
          }
        }
      );

      req.on(
        "error",
        reject
      );
    }
  );
}

const INTAKE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    age: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    incomeType: {
      anyOf: [
        {
          type: "string",
          enum: [
            "salaried",
            "self_employed",
            "informal",
          ],
        },
        { type: "null" },
      ],
    },

    monthlyIncome: {
      anyOf: [
        {
          type: "object",
          additionalProperties: false,
          properties: {
            min: {
              type: "number",
            },
            max: {
              type: "number",
            },
          },
          required: [
            "min",
            "max",
          ],
        },
        { type: "null" },
      ],
    },

    incomeStability: {
      anyOf: [
        {
          type: "string",
          enum: [
            "high",
            "medium",
            "low",
            "unknown",
          ],
        },
        { type: "null" },
      ],
    },

    loanType: {
      anyOf: [
        {
          type: "string",
          enum: [
            "personal",
            "home",
            "lap",
            "gold",
            "two_wheeler",
            "business",
          ],
        },
        { type: "null" },
      ],
    },

    loanPurpose: {
      anyOf: [
        { type: "string" },
        { type: "null" },
      ],
    },

    amountWanted: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    existingEmi: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    householdExpenses: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    creditScore: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    emergencySavings: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    pastBounces: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    existingDebtBalance: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    existingDebtRate: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    collateralValue: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    annualDocumentedIncome: {
      anyOf: [
        { type: "number" },
        { type: "null" },
      ],
    },

    hasIncomeProof: {
      anyOf: [
        { type: "boolean" },
        { type: "null" },
      ],
    },
  },

  required: [
    "age",
    "incomeType",
    "monthlyIncome",
    "incomeStability",
    "loanType",
    "loanPurpose",
    "amountWanted",
    "existingEmi",
    "householdExpenses",
    "creditScore",
    "emergencySavings",
    "pastBounces",
    "existingDebtBalance",
    "existingDebtRate",
    "collateralValue",
    "annualDocumentedIncome",
    "hasIncomeProof",
  ],
};

const SYSTEM_PROMPT = `
You extract borrower facts from natural language.

Your job is ONLY to extract facts.

Do NOT decide:
- whether the borrower should borrow
- how much the borrower should borrow
- fair interest rate
- EMI
- eligibility
- affordability

Those decisions are handled separately by Loanly's deterministic TypeScript rules.

Only extract information explicitly stated by the borrower.

Never invent missing values.

Unknown values must be null.

For income ranges:

"40-80k"
means:
{
  "min": 40000,
  "max": 80000
}

For a single known income:

"1.1 lakh"
means:
{
  "min": 110000,
  "max": 110000
}

For "around 50k", use:

{
  "min": 50000,
  "max": 50000
}

Convert Indian currency expressions:

1 lakh = 100000
1.5 lakh = 150000
10 lakh = 1000000
1 crore = 10000000

Income types:

salaried
self_employed
informal

Examples:

"software engineer at an MNC"
=> salaried

"kirana shop owner"
=> self_employed

"delivery rider paid through apps"
=> informal

Income stability:

high
medium
low
unknown

Loan types:

personal
home
lap
gold
two_wheeler
business

Examples:

"wedding"
=> personal

"house"
=> home

"loan against my property"
=> lap

"gold loan"
=> gold

"bike/scooter"
=> two_wheeler

"business expansion"
=> business

If the user says they have a car loan of ₹14,000 per month,
that is existingEmi = 14000.

If the user says they have no existing EMI,
existingEmi = 0.

If the user explicitly says they have no missed or bounced
payments, pastBounces = 0.

If the user says one recent payment bounced,
pastBounces = 1.

If the user says they have high-interest debt,
extract the outstanding balance and rate when available.

If a value is not mentioned, return null.

Do not infer household expenses from income.

Do not infer credit score.

Do not infer emergency savings.

Do not infer collateral value.

Do not infer income proof unless explicitly mentioned.

Return only the structured JSON object.
`;

async function handleCopilot(
  req,
  res
) {
  const body =
    await readJson(req);

  const message =
    body.message;

  const assessment =
    body.assessment;

  if (
    typeof message !==
      "string" ||
    !message.trim()
  ) {
    return sendJson(
      res,
      400,
      {
        error:
          "Message is required.",
      }
    );
  }

  const response =
    await client.responses.create(
      {
        model,
        store: false,

        input: [
          {
            role: "system",
            content: `
You are Loanly, a borrower-first
loan assessment assistant.

You explain an assessment produced
by deterministic TypeScript rules.

Never override or recalculate the
assessment.

Never invent financial facts.

Use the assessment numbers as the
source of truth.

Give practical borrower-focused
answers.

Explain trade-offs clearly.

Assessment:
${JSON.stringify(
  assessment,
  null,
  2
)}
          `,
          },
          {
            role: "user",
            content:
              message.trim(),
          },
        ],
      }
    );

  return sendJson(
    res,
    200,
    {
      answer:
        response.output_text,
    }
  );
}

async function handleIntake(
  req,
  res
) {
  const body =
    await readJson(req);

  const message =
    body.message;

  if (
    typeof message !==
      "string" ||
    !message.trim()
  ) {
    return sendJson(
      res,
      400,
      {
        error:
          "Message is required.",
      }
    );
  }

  const response =
    await client.responses.create(
      {
        model,
        store: false,

        input: [
          {
            role: "system",
            content:
              SYSTEM_PROMPT,
          },
          {
            role: "user",
            content:
              message.trim(),
          },
        ],

        text: {
          format: {
            type: "json_schema",
            name: "borrower_facts",
            strict: true,
            schema:
              INTAKE_SCHEMA,
          },
        },
      }
    );

  const facts =
    JSON.parse(
      response.output_text
    );

  return sendJson(
    res,
    200,
    {
      facts,
    }
  );
}

const server =
  http.createServer(
    async (req, res) => {
      if (
        req.method ===
        "OPTIONS"
      ) {
        res.writeHead(204, {
          "Access-Control-Allow-Origin":
            "http://localhost:5173",
          "Access-Control-Allow-Methods":
            "POST, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type",
        });

        res.end();

        return;
      }

      try {
        if (
          req.method === "POST" &&
          req.url ===
            "/api/copilot"
        ) {
          await handleCopilot(
            req,
            res
          );

          return;
        }

        if (
          req.method === "POST" &&
          req.url ===
            "/api/intake"
        ) {
          await handleIntake(
            req,
            res
          );

          return;
        }

        sendJson(
          res,
          404,
          {
            error:
              "Route not found.",
          }
        );
      } catch (error) {
        console.error(
          "Loanly AI error:",
          error
        );

        sendJson(
          res,
          500,
          {
            error:
              "Loanly AI could not process the request.",
          }
        );
      }
    }
  );

server.listen(
  PORT,
  () => {
    console.log(
      `Loanly AI server running on http://localhost:${PORT}`
    );
  }
);