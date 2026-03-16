Här är en **förbättrad och GitHub-vänlig `README.md`**. Den använder tydliga sektioner, badges, emojis, struktur och layout som brukar se bra ut på GitHub-repon. Den är också lite mer “produktlik”, vilket gör projektet mer professionellt om andra hittar det.

---

# README.md

```markdown
# 💰 PennyPlan

![Vue](https://img.shields.io/badge/Vue.js-Frontend-42b883)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)
![License](https://img.shields.io/badge/license-MIT-blue)

**PennyPlan** is a simple and modern budgeting app that helps users understand and control their personal finances.

The goal is to make budgeting **clear, fast, and motivating** — without feeling like complex financial software.

---

# ✨ Features

### 📊 Dashboard
Quick overview of your finances:

- Monthly income
- Monthly expenses
- Remaining balance
- Budget overview
- Savings goal progress

---

### 💳 Transactions

Users can:

- Add income or expenses
- Select category
- Add notes
- Track transactions by month

---

### 📂 Budget

Users can:

- Set monthly budgets per category
- Track spending vs budget
- See visual budget status

---

### 🎯 Savings Goals

Create goals such as:

- Emergency fund
- Vacation
- New car
- Equipment

Track progress toward a target amount.

---

# 🧱 Tech Stack

## Frontend

- **Vue.js**
- **HTML**
- **CSS**
- JavaScript / TypeScript

Focus:

- mobile-friendly UI
- fast interactions
- clean dashboard experience

---

## Backend

Powered by **Supabase**

Supabase provides:

- PostgreSQL database
- Authentication
- API access
- Row Level Security
- Realtime capabilities (future)

---

# 🔐 Authentication

Authentication is handled with **Supabase Auth**.

Supported login method:

- Email / Password

Supabase manages:

- sessions
- JWT tokens
- user identity

All data is protected using **Row Level Security (RLS)**.

---

# 🗄️ Database Model

### User

```

id
name
email
currency
createdAt

```

---

### Category

```

id
name
type (income / expense)
icon
color

```

---

### Transaction

```

id
userId
categoryId
type
amount
date
note
createdAt

```

---

### BudgetLimit

```

id
userId
categoryId
month
amount

```

---

### SavingsGoal

```

id
userId
title
targetAmount
currentAmount
targetDate
createdAt

```

---

# 📁 Project Structure

```

/frontend
/components
/pages
/services
/store
/styles

/supabase
/migrations
/policies

/docs
claude.md

````

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/your-repo/pennyplan.git
````

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Start development server

```bash
npm run dev
```

---

# ⚙️ Supabase Setup

1. Create a project at:

[https://supabase.com](https://supabase.com)

2. Enable:

* Authentication
* Row Level Security

3. Create tables:

* transactions
* categories
* budgets
* savings_goals

4. Add environment variables:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

in `.env`.

---

# 🛣 Roadmap

### Version 1 (MVP)

* Dashboard
* Transactions
* Budget tracking
* Savings goals

---

### Version 2

* Recurring transactions
* Financial insights
* Export to Excel/PDF

---

### Version 3

* Bank integrations
* AI-based budget suggestions
* Shared household budgets

---

# 🎨 UX Principles

The application should be:

* Simple
* Fast
* Mobile friendly
* Easy to understand

Users should be able to **register a transaction in seconds**.

---

# 📖 Documentation

Project documentation:

```
/docs/claude.md
```

Contains:

* product concept
* architecture ideas
* roadmap
* development guidelines

---

# 📜 License

MIT License

```

---

💡 **Tips:**  
På GitHub blir README extra snygg om du även lägger till:

- `docs/` folder
- `screenshots/` folder
- `CONTRIBUTING.md`
- `CHANGELOG.md`

---

Om du vill kan jag också göra en **extremt snygg GitHub README** med:

- preview-bilder
- arkitekturdiagram
- feature-cards
- UI mockups

Den typen som ser ut som ett **riktigt startup-repo**.
```
