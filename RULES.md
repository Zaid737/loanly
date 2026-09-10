# Loanly — Rules & Decision Logic

> Loanly is a borrower self-assessment tool, not a lender credit model.
>
> The goal is not to predict whether a bank will approve a loan.
> The goal is to help a borrower understand what they can comfortably
> afford, what amount may be reasonable, what rate is worth negotiating,
> and what questions to ask the lender.

---

## 1. Design philosophy

Loanly follows a simple rule:

**AI interprets. TypeScript decides. AI explains.**

The AI can understand natural-language answers such as:

> "I earn around ₹60–80k a month and already have a ₹10k EMI."

It converts that into structured borrower information.

The actual financial assessment is then performed by deterministic
TypeScript rules.

The AI does **not** decide:

- Borrow / Don't borrow
- Safe loan amount
- Safe EMI
- Fair interest rate
- APR
- Stress-test result
- Product recommendation

This keeps the important financial decisions inspectable and
repeatable.

---

# 2. What Loanly is trying to answer

Loanly focuses on four borrower questions:

1. **Should I borrow at all?**
2. **How much can I realistically carry?**
3. **What rate should I consider fair?**
4. **What EMI should I agree to?**

The final output also includes a one-screen negotiation card that the
borrower can use when comparing lender offers.

---

# 3. Borrower-safe vs lender-style amount

Loanly deliberately shows two numbers.

### Borrower-safe amount

This is the amount Loanly recommends the borrower use when deciding how
much debt they personally want to carry.

It is based on a more conservative affordability limit.

### Lender-style amount

This is a less conservative affordability estimate.

It is useful because a lender may be willing to sanction more than the
borrower would ideally want to carry.

### Which one should the borrower use?

**Use the borrower-safe amount.**

The lender-style amount is shown for comparison, not as a
recommendation.

The underlying idea is:

> "A lender saying yes does not automatically mean the loan is
> comfortable for you."

---

# 4. Income treatment

## Salaried income

For a salaried borrower, Loanly uses the lower end of the reported
monthly income range.

For example:

```text
₹1,00,000 – ₹1,10,000