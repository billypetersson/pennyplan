# README.md

```markdown
# PennyPlan

PennyPlan är en enkel och modern budgetapp som hjälper användare att få kontroll över sin privatekonomi.

Appen gör det möjligt att:
- registrera inkomster och utgifter
- följa sin budget per kategori
- se hur mycket pengar som finns kvar varje månad
- sätta upp sparmål och följa sin progress

Fokus ligger på **enkelhet, tydlighet och snabb överblick**.

---

# Vision

Målet är att skapa en budgetapp som gör privatekonomi **enkel och motiverande**, utan att kännas som ett komplext ekonomisystem.

Appen ska:
- vara snabb att använda
- fungera bra på mobil
- ge tydlig ekonomisk överblick

---

# Tech Stack

## Frontend
- Vue.js
- HTML
- CSS
- JavaScript / TypeScript

Frontend utvecklas med fokus på:
- mobilvänlig design
- tydliga dashboards
- snabb registrering av transaktioner

Frontend-design skill används för att skapa en konsekvent och tydlig UI-struktur.

---

## Backend / Plattform

Supabase används som backend.

Supabase tillhandahåller:

- PostgreSQL databas
- Authentication
- API-access
- Row Level Security
- möjlighet till realtime-funktioner i framtiden

---

## Authentication

Authentication hanteras via **Supabase Auth**.

Initialt används:

- Email / Password login

Supabase hanterar:

- användarregistrering
- sessioner
- tokens
- säker autentisering

All användardata skyddas via **Row Level Security (RLS)** i databasen.

---

# Kärnfunktioner (MVP)

## Dashboard
Visar:

- månadens inkomster
- månadens utgifter
- kvar att spendera
- budgetstatus
- sparmål

---

## Transaktioner

Användaren kan:

- registrera inkomster
- registrera utgifter
- välja kategori
- ange datum
- lägga till anteckning

---

## Budget

Användaren kan:

- sätta månadsbudget per kategori
- se hur mycket som spenderats
- få visuell status över budget

---

## Sparmål

Användaren kan:

- skapa sparmål
- ange målbelopp
- följa progression

Exempel:

- buffert
- resa
- ny bil

---

# Datamodell

## User
```

id
name
email
currency
createdAt

```

## Category
```

id
name
type (income / expense)
icon
color

```

## Transaction
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

## BudgetLimit
```

id
userId
categoryId
month
amount

```

## SavingsGoal
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

# Projektstruktur (förslag)

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

# Installation

### 1. Klona projektet

```bash
git clone https://github.com/your-repo/pennyplan.git
````

---

### 2. Installera dependencies

```bash
npm install
```

---

### 3. Starta utvecklingsserver

```bash
npm run dev
```

---

# Supabase Setup

1. Skapa ett projekt på:

[https://supabase.com](https://supabase.com)

2. Skapa följande tabeller:

* transactions
* categories
* budgets
* savings_goals

3. Aktivera:

* authentication
* row level security

4. Lägg in projektets:

```
SUPABASE_URL
SUPABASE_ANON_KEY
```

i `.env` filen.

---

# Roadmap

## Version 1

* Dashboard
* Transaktioner
* Budget per kategori
* Sparmål

## Version 2

* återkommande transaktioner
* bättre statistik
* export till Excel/PDF

## Version 3

* bankintegration
* AI-baserade budgetrekommendationer
* delad hushållsbudget

---

# UX Principer

Appen ska vara:

* enkel
* snabb
* tydlig
* mobilvänlig

Så få klick som möjligt ska krävas för att registrera en transaktion.

---

# License

MIT License

```

---

Om du vill kan jag också hjälpa dig skapa:

- **en riktigt bra mappstruktur för Vue + Supabase**
- **SQL-schema för Supabase**
- **RLS policies (väldigt viktigt för säkerhet)**
- **första Vue-komponenterna för Dashboard och Transactions**

Det gör att du kan gå från **idé → fungerande app på ~1–2 timmar**.
```
