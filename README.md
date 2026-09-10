# Loanly

### Borrow smarter. Know your numbers before you borrow.

Loanly is a borrower-first loan copilot for Indian borrowers. It helps answer four practical questions before taking a loan:

- **Should I borrow at all?**
- **How much can I realistically afford?**
- **What interest rate is reasonable for me?**
- **What EMI should I be comfortable with?**

It also generates a simple **Negotiation Card** to help borrowers compare and negotiate lender offers.

---

## What Loanly does

Loanly takes the borrower's information and produces four main outputs.

### 1. Borrowing decision

One of:

- **Borrow**
- **Borrow Less**
- **Don't Borrow**

Each decision comes with a plain-English reason instead of just a score.

### 2. Loan amount

Loanly shows two ranges:

- **Borrower-safe amount** — a more conservative amount the borrower should be comfortable carrying.
- **Lender-style amount** — a less conservative affordability estimate for comparison.

The borrower-safe amount is the one Loanly recommends using for decision-making.

### 3. Fair rate + APR

Loanly provides a **rate range** instead of pretending there is one universally fair rate.

It also estimates the **all-in APR**, including the assumed processing fee, so borrowers can compare more than just the headline interest rate.

### 4. EMI + stress test

Loanly calculates:

- Safe monthly EMI
- Comparison tenure
- Stress-case EMI
- Whether the loan remains affordable under the stress scenario

---

## How it works

The main design principle is:

> **AI interprets → TypeScript rules decide → AI explains**

The AI understands natural-language borrower responses and converts them into structured facts.

The actual financial assessment is deterministic and handled by TypeScript.

```text
Borrower
   ↓
AI intake / Questionnaire
   ↓
Structured borrower profile
   ↓
TypeScript assessment engine
   ├── Affordability
   ├── Eligibility
   ├── Loan amount
   ├── Fair rate
   ├── APR
   ├── Stress test
   ├── Product routing
   └── Confidence
   ↓
Results
   ↓
Negotiation Card
```

This keeps the important financial decisions transparent, testable, and independent of LLM output.

---

## Tech stack

- **React**
- **TypeScript**
- **Vite**
- **Zod**
- **Node.js**
- **OpenAI API**
- **CSS**

There is no database or authentication layer. The project is designed as a borrower self-assessment tool rather than a production lending platform.

---

## Running locally

### Requirements

- Node.js 22+
- npm
- OpenAI API key for AI intake and copilot features

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.6-luna
```

### 3. Start the frontend

```bash
npm run dev
```

The Vite app will normally run at:

```text
http://localhost:5173
```

### 4. Start the AI server

In another terminal:

```bash
npm run server
```

The AI server runs at:

```text
http://localhost:8787
```

---

## Testing

Run the assessment tests:

```bash
npm run test:run
```

Build the production bundle:

```bash
npm run build
```

---

## Demo borrowers

The project includes the three borrowers from the challenge.

### Priya

Salaried software engineer in Bengaluru.

- Income: ₹1.1L/month
- Existing EMI: ₹14K
- Credit score: 780
- Requested amount: ₹8L
- Purpose: Wedding

### Ravi

Self-employed kirana business owner in Mysuru.

- Income: ₹40K–₹80K/month
- Documented annual income: ₹4.2L
- Property: ~₹45L
- Requested amount: ₹15L
- Purpose: Stock + delivery vehicle

Loanly should surface a **secured Loan Against Property route** for this profile.

### Anita

Informal delivery rider and tailor in Hubballi.

- Income: ₹26K–₹30K/month
- Existing high-cost debt
- Recent bounced payment
- Requested amount: ₹1.5L
- Purpose: Electric scooter

The combination of high-cost debt and a recent bounce is intended to produce a **Don't Borrow** outcome.

---

## Rules and assumptions

All important lending rules and assumptions are documented in:

```text
RULES.md
```

This includes:

- FOIR assumptions
- Cash-flow buffer
- Income treatment
- Rate bands
- Credit-score adjustments
- High-cost debt rules
- Bounce-payment rules
- APR assumptions
- Stress testing
- Product routing
- Confidence scoring

The rules clearly distinguish between **Loanly product judgements** and external or regulatory guidance.

---

## Project structure

```text
loanly/
├── src/
│   ├── components/
│   ├── demo/
│   ├── engine/
│   │   ├── questions/
│   │   └── rules/
│   ├── features/
│   │   ├── copilot/
│   │   ├── questionnaire/
│   │   └── results/
│   └── types/
├── server/
│   └── index.mjs
├── public/
├── RULES.md
├── README.md
└── package.json
```

---

## Important limitation

Loanly is **not a credit approval system**.

It does not:

- Pull credit bureau data
- Verify income or documents
- Guarantee loan approval
- Guarantee a lender's interest rate
- Replace lender underwriting

It is designed to help a borrower understand their borrowing position and negotiate more confidently.

---

## What I would build next

If this were taken beyond the challenge, I would focus on:

1. Better handling of incomplete or uncertain borrower information.
2. More lender and product-specific rate and fee data.
3. More detailed tenure and total-cost comparisons.
4. Stronger validation around income and existing obligations.
5. More comprehensive automated rule and edge-case testing.

The core principle would remain:

> **Make lending judgement understandable to the borrower and executable by a machine.**
>
> Then run:

git add README.md
git commit -m "Improve project documentation"
git push
