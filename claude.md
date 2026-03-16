# Claude.md

## Projekt

**Arbetsnamn:** PennyPlan
**Designstöd:** Använd frontend-design skill för UI/UX, komponentstruktur och visuell riktning i frontend-arbetet
**Typ:** Budgetapp för privatpersoner
**Mål:** Hjälpa användare att få enkel och tydlig kontroll över inkomster, utgifter, månadsbudget och sparmål utan att appen känns tung eller komplicerad.

---

## Produktidé

PennyPlan är en enkel och modern budgetapp för privatpersoner som vill:

* registrera inkomster och utgifter
* följa sin månadsbudget per kategori
* se hur mycket pengar som finns kvar att spendera
* sätta upp sparmål och följa utvecklingen

Fokus i första versionen är **enkelhet, tydlighet och snabb överblick**.

---

## Målgrupp

Primär målgrupp:

* privatpersoner som idag använder Excel, anteckningar eller ingen budget alls
* användare som vill ha bättre koll på vardagsekonomi utan att använda komplicerade ekonomisystem

Sekundär målgrupp:

* personer som vill börja spara mer strukturerat
* unga vuxna och familjer som vill få bättre kontroll över månadens utgifter

---

## Problem som appen löser

Många har svårt att:

* få en snabb överblick över sin ekonomi
* förstå vart pengarna faktiskt tar vägen
* hålla sig inom budget i vardagen
* följa upp sparmål på ett motiverande sätt

Appen ska därför göra det enkelt att:

* se total ekonomi på en sida
* förstå utgifter per kategori
* agera tidigt innan budgeten spricker
* koppla vardagsekonomi till tydliga mål

---

## MVP (version 1)

### Funktioner

1. **Översikt / Dashboard**

   * total inkomst denna månad
   * totala utgifter denna månad
   * kvar att spendera
   * snabb överblick per kategori
   * status för sparmål

2. **Transaktioner**

   * skapa inkomst eller utgift
   * ange belopp, datum, kategori och anteckning
   * lista transaktioner
   * filtrera på månad

3. **Budget**

   * sätt månadsbudget per kategori
   * jämför faktisk spend mot budget
   * visa varningar när användaren närmar sig eller överskrider budget

4. **Sparmål**

   * skapa mål, till exempel buffert, resa eller ny bil
   * ange målbelopp
   * visa hur långt användaren kommit

5. **Inställningar**

   * valuta
   * startdag för månad vid behov
   * grundläggande profilinställningar

---

## Ej i MVP

Funktioner som kan vänta till senare versioner:

* bankkoppling via Open Banking
* automatisk kategorisering
* kvittoskanning
* delad hushållsbudget
* export till PDF/Excel
* pushnotiser
* AI-baserade rekommendationer
* återkommande transaktioner

---

## Förslag på sidor

* **Dashboard**
* **Transaktioner**
* **Budget**
* **Sparmål**
* **Inställningar**

---

## Datamodell

### User

* id
* name
* email
* currency
* createdAt

### Category

* id
* name
* type (`income` eller `expense`)
* icon
* color

### Transaction

* id
* userId
* categoryId
* type (`income` eller `expense`)
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

## Affärslogik

### Beräkningar

* **Månadens inkomster** = summa av alla income-transaktioner för vald månad
* **Månadens utgifter** = summa av alla expense-transaktioner för vald månad
* **Kvar att spendera** = inkomster - utgifter
* **Budgetstatus per kategori** = budgetlimit - summa utgifter i kategorin
* **Sparmålsprogress** = currentAmount / targetAmount

### Regler

* belopp måste vara större än 0
* varje transaktion måste ha datum och kategori
* kategori måste matcha typ av transaktion
* en användare ska kunna ha flera budgetposter per månad men bara en per kategori och månad

---

## UX-principer

* appen ska kännas lätt och snabb
* viktigaste siffrorna ska synas direkt
* så få klick som möjligt för att registrera en transaktion
* färre funktioner men tydligare flöde
* mobilvänlig design från start

Designord:

* ren
* modern
* lugn
* tydlig
* förtroendeingivande

---

## Teknikförslag

### Rekommenderad stack

**Frontend**

* Vue.js
* HTML
* CSS
* JavaScript eller TypeScript beroende på projektets upplägg
* använd frontend-design skill för att ta fram UI-struktur, layout, komponenttänk och designriktning

**Backend / plattform**

* Supabase

  * PostgreSQL databas
  * Supabase Authentication för användarinloggning (email/password till att börja med)
  * hantering av användarsessioner och token via Supabase-klient
  * API via Supabase-klient och policies
  * möjlighet till realtime och storage längre fram

### Arkitekturidé

* frontend byggs i Vue.js med fokus på mobilvänligt och enkelt gränssnitt
* Supabase används som backend för datalagring, autentisering och åtkomst till data
* affärslogik kan initialt ligga nära frontend där det är rimligt, och flyttas till mer strukturerade lager vid behov

### Varför denna stack

* snabb att komma igång med för MVP
* mindre backend-overhead i början
* PostgreSQL i grunden ger stabil datamodell
* Supabase ger auth och databas i samma plattform
* Vue.js passar bra för ett rent och lättnavigerat gränssnitt

## API-idéer

### Transactions

* `GET /api/transactions?month=2026-03`
* `POST /api/transactions`
* `PUT /api/transactions/{id}`
* `DELETE /api/transactions/{id}`

### Budgets

* `GET /api/budgets?month=2026-03`
* `POST /api/budgets`
* `PUT /api/budgets/{id}`

### Goals

* `GET /api/goals`
* `POST /api/goals`
* `PUT /api/goals/{id}`

### Dashboard

* `GET /api/dashboard?month=2026-03`

---

## Prioriterad roadmap

### Fas 1

* grundläggande UI
* skapa och visa transaktioner
* kategorier
* dashboard

### Fas 2

* budget per kategori
* visualisering av budgetstatus
* sparmål

### Fas 3

* förbättrad analys
* återkommande transaktioner
* export

### Fas 4

* bankintegration
* smarta rekommendationer
* delad hushållsbudget

---

## Namnförslag

Här är några möjliga namn för appen:

* **PennyPlan**
* **Budgetly**
* **Kollkassan**
* **Spendwise**
* **Månadskollen**
* **Sparspår**
* **CashNest**
* **Översikt**

### Rekommendation

**PennyPlan** är ett bra arbetsnamn eftersom det:

* är lätt att komma ihåg
* signalerar ekonomi + planering
* fungerar internationellt
* passar både MVP och framtida premiumkänsla

---

## Nästa steg

1. Bestäm slutligt namn
2. Använd frontend-design skill för att ta fram layout, designriktning och komponentstruktur
3. Sätt upp Vue-projektet med HTML och CSS-struktur
4. Sätt upp Supabase-projekt med tabeller, Supabase Authentication (users), och row level security policies
5. Bygg dashboard och transaktionsflöde först
6. Lägg till budget och sparmål efter att grundflödet fungerar

---

## Kort vision

> En budgetapp som gör privatekonomi enkel, tydlig och motiverande — utan att användaren behöver känna att de jobbar i ett ekonomisystem.
