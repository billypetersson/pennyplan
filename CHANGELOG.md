# Changelog

Alla ändringar i projektet dokumenteras här.

---

## [0.2.0] - 2026-03-16

### Lagt till
- Supabase-integration: transactions sparas nu i molnet istället för localStorage
- Inloggning och registrering (`/login`) med e-post och lösenord
- Auth-guard i routern – oinloggade användare skickas till inloggningssidan
- Utloggningsknapp i Inställningar
- SQL-schema (`supabase/schema.sql`) med tabeller för transactions, budget_limits och savings_goals
- Row Level Security (RLS) – varje användare ser bara sin egen data

---

## [0.1.0] - 2026-03-16

### Lagt till
- Projektuppsättning med Vue 3, Vite, Pinia och Vue Router
- Dashboard med månadsöversikt (inkomster, utgifter, kvar att spendera)
- Transaktionssida med lista och formulär för att lägga till inkomster/utgifter
- Fördefinierade kategorier (4 inkomst, 8 utgift) med emoji-ikoner
- Månadsväljare (bläddra bakåt/framåt)
- Kategoriöversikt med progressbars på dashboard
- Mobilanpassad layout med bottom navigation
- Platshållarsidor för Budget och Sparmål (fas 2)
- Inställningssida med appinfo
- Svensk text och SEK-valuta genomgående
