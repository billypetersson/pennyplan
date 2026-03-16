# Claude.md

## Project

**Working Name:** PennyPlan
**Type:** Budget application for individuals
**Goal:** Help users gain simple and clear control over income, expenses, monthly budgets, and savings goals without the application feeling heavy or complicated.

**Design Support:** Use frontend-design skill for UI/UX, component structure, and visual direction in the frontend work.

**Language:** App language in Swedish, currency is SEK.

---

## Product Idea

PennyPlan is a simple and modern budgeting application for individuals who want to:

* register income and expenses
* track their monthly budget per category
* see how much money remains to spend
* set savings goals and follow their progress

The first version focuses on **simplicity, clarity, and quick financial overview**.

---

## Target Audience

### Primary audience

* individuals currently using Excel, notes, or no budgeting system
* users who want better control of everyday finances without complicated financial software

### Secondary audience

* people who want to start saving more consistently
* young adults and families who want better insight into monthly spending

---

## Problems the App Solves

Many people struggle to:

* get a quick overview of their finances
* understand where their money actually goes
* stay within their monthly budget
* track savings goals in a motivating way

The app should therefore make it easy to:

* see the overall financial situation on one screen
* understand spending per category
* react early before the budget is exceeded
* connect everyday spending with clear savings goals

---

## MVP (Version 1)

### Features

1. **Overview / Dashboard**

Displays:

* total income for the current month
* total expenses for the current month
* remaining spendable balance
* quick overview per category
* savings goal status

2. **Transactions**

Users can:

* create income or expense entries
* define amount, date, category, and note
* view a transaction list
* filter transactions by month

3. **Budget**

Users can:

* set monthly budgets per category
* compare actual spending vs budget
* receive warnings when approaching or exceeding budget

4. **Savings Goals**

Users can:

* create savings goals (for example emergency fund, trip, or new car)
* define a target amount
* track progress toward the goal

5. **Settings**

Includes:

* currency
* optional custom start day of the month
* basic user profile settings

---

## Not Included in MVP

The following features are intentionally postponed:

* bank integrations via Open Banking
* automatic transaction categorization
* receipt scanning
* shared household budgets
* export to PDF or Excel
* push notifications
* AI‑based financial insights
* recurring transactions

---

## Proposed Pages

* **Dashboard**
* **Transactions**
* **Budget**
* **Savings Goals**
* **Settings**

---

## Data Model

### User

* id
* name
* email
* currency
* createdAt

### Category

* id
* name
* type (`income` or `expense`)
* icon
* color

### Transaction

* id
* userId
* categoryId
* type (`income` or `expense`)
* amount
* date
* note
* createdAt

### BudgetLimit

* id
* userId
* categoryId
* month
* amount

### SavingsGoal

* id
* userId
* title
* targetAmount
* currentAmount
* targetDate (optional)
* createdAt

---

## Business Logic

### Calculations

* **Monthly Income** = sum of all income transactions for the selected month
* **Monthly Expenses** = sum of all expense transactions for the selected month
* **Remaining Balance** = income − expenses
* **Budget Status per Category** = budget limit − total expenses in that category
* **Savings Goal Progress** = currentAmount / targetAmount

### Rules

* amount must be greater than 0
* every transaction must include date and category
* category type must match transaction type
* a user can have multiple budget entries per month but only one per category per month

---

## UX Principles

The application should feel:

* lightweight
* fast
* intuitive
* visually clear

Key design goals:

* important numbers visible immediately
* minimal clicks to register a transaction
* fewer features but clearer flows
* mobile‑friendly design from the start

Design keywords:

* clean
* modern
* calm
* clear
* trustworthy

---

## Technology Stack

### Frontend

* Vue.js
* HTML
* CSS
* JavaScript or TypeScript depending on project setup

Frontend-design skill should be used to help define:

* layout
* UI structure
* component architecture
* design direction

---

### Backend / Platform

Supabase will be used as the backend platform.

Supabase provides:

* PostgreSQL database
* Supabase Authentication for user login (email/password initially)
* session and token management via the Supabase client
* built‑in API access
* Row Level Security for protecting user data

---

## Architecture Idea

* the frontend is built with Vue.js focusing on a clean and mobile‑friendly interface
* Supabase handles authentication, database access, and data storage
* business logic can initially live close to the frontend and later be moved to structured services if needed

---

## Why This Stack

* very fast to build an MVP
* minimal backend maintenance early on
* PostgreSQL provides a strong and flexible data model
* Supabase includes authentication and database in a single platform
* Vue.js works well for clean, responsive UI development

---

## API Ideas

### Transactions

`GET /api/transactions?month=2026-03`

`POST /api/transactions`

`PUT /api/transactions/{id}`

`DELETE /api/transactions/{id}`

---

### Budgets

`GET /api/budgets?month=2026-03`

`POST /api/budgets`

`PUT /api/budgets/{id}`

---

### Goals

`GET /api/goals`

`POST /api/goals`

`PUT /api/goals/{id}`

---

### Dashboard

`GET /api/dashboard?month=2026-03`

---

## Prioritized Roadmap

### Phase 1

* basic UI
* create and display transactions
* categories
* dashboard

### Phase 2

* budget per category
* visualization of budget status
* savings goals

### Phase 3

* improved financial analysis
* recurring transactions
* export features

### Phase 4

* bank integrations
* smart financial recommendations
* shared household budgets

---

## Name Suggestions

Possible names for the application:

* PennyPlan
* Budgetly
* Kollkassan
* Spendwise
* Månadskollen
* Sparspår
* CashNest
* Översikt

### Recommendation

**PennyPlan** is a strong working name because it:

* is easy to remember
* communicates finance and planning
* works internationally
* fits both MVP and future premium product direction

---

## Next Steps

1. Decide on the final product name
2. Use frontend-design skill to design layout and UI structure
3. Set up the Vue project with HTML and CSS structure
4. Create the Supabase project with tables, authentication, and policies
5. Build the dashboard and transaction flow first
6. Add budgeting and savings goals once the core flow works

---

## Vision

> A budgeting app that makes personal finance simple, clear, and motivating — without making users feel like they are using complex financial software.
