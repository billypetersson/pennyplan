# Changelog

Alla ändringar i projektet dokumenteras här.

---

## [1.1.0] - 2026-03-18

### Ändrat
- PennyPlan-logotypen är nu i stor kursiv text (Google Font: Cookie) utan logomärke/box
- Logotypen centrerad i sidomenyn med mörkgrön färg (`--color-primary-dark`)
- Inter används nu som typsnitt i hela appen via Google Fonts
- Teckensnittsrendering ändrad till `subpixel-antialiased` för skarpare text

---

## [1.0.0] - 2026-03-18

### Lagt till
- Bekräftelsesida (`/auth/confirm`) för e-postverifiering efter registrering med animerad välkomstskärm
- Registreringsformulär på inloggningssidan med flöde för e-postbekräftelse
- Resend.com används som SMTP-leverantör för att skicka bekräftelsemail

### Åtgärdat
- `signUp` skickar nu korrekt `emailRedirectTo` till `/auth/confirm` så att bekräftelselänken leder rätt

---

## [0.9.0] - 2026-03-18

### Lagt till
- Inkomst & Utgifter-diagram på översikten med smooth area chart (kurvor, gradientfyll)
- Filteralternativ: Idag, Senaste veckan, Senaste 14 dagar, Senaste 30 dagar, Denna månad
- Lucide-ikoner i hela appen — alla inline SVG:er och emojis ersatta med lucide-vue-next
- Ny CategoryIcon-komponent som mappar kategorier till Lucide-ikoner

### Ändrat
- Inkomstlinjen i diagrammet visas som prickad linje utan fyllning
- Navigationsikoner i sidomenyn och bottennavigationen använder nu Lucide
- Inställningssidan, modaler och tomma tillstånd använder Lucide-ikoner
- Användarnamn borttaget från sidomenyn
- Ikonerna i navigationen grupperade med marginal till höger

---

## [0.8.0] - 2026-03-17

### Lagt till
- Mörkt läge med sol/måne-toggle
- Sparar vald inställning i localStorage, respekterar systemets preferens som standard
- Toggle synlig i sidomenyn (desktop) och i bottennavigationen (mobil)

---

## [0.7.0] - 2026-03-17

### Lagt till
- Snabbfilter på Översikt: 1 dag, 1 vecka, 14 dagar, 30 dagar (ersätter månadsväljaren)
- Summakort och kategoriöversikt uppdateras dynamiskt baserat på valt intervall

### Ändrat
- Månadsväljaren på Översikt borttagen till förmån för relativa tidsintervall
- Inställningar borttaget från navigationsmenyn, nu åtkomligt via kugghjulet i sidomenyn (desktop)
- Profilsektion med initialer, e-post och utloggning tillagd längst ned i sidomenyn

---

## [0.6.0] - 2026-03-17

### Lagt till
- Sparmål-widget på Översikt-sidan med progressbar, belopp, procent och dagar kvar
- Om flera sparmål finns visas pill-knappar för att välja vilket mål som visas

---

## [0.5.0] - 2026-03-17

### Lagt till
- **PDF-export** per månad via knapp i Översikt-headern
- Exporterad PDF innehåller: summakort (inkomster/utgifter/saldo), utgifter per kategori, fasta kostnader och transaktionslista
- Transaktioner färgkodas i PDF (grönt för inkomst, rött för utgift)
- Filnamnet baseras på månadens namn, t.ex. `pennyplan_mars_2026.pdf`

---

## [0.4.0] - 2026-03-17

### Lagt till
- Ny sida **Fasta kostnader** (`/fasta-kostnader`) för återkommande utgifter som försäkringar, prenumerationer och hyra
- Fasta kostnader-formulär med fält för namn, belopp, kategori (6 typer), faktureringsintervall (månadsvis/kvartalsvis/årsvis) och valfri förfallodag
- Pinia-store för fasta kostnader med CRUD mot Supabase (`fixed_costs`-tabell)
- Summakort på Fasta kostnader-sidan som visar total per månad och per år
- Tabellvy för fasta kostnader med en rad per post
- Sortering på alla kolumner (namn, kategori, belopp, intervall, förfallodag)
- Zebra-randig tabell (varannan rad mörkare)
- Fasta kostnader visas som en egen rad i **Utgifter per kategori** på Översikt
- Alla kategorirader i Utgifter per kategori är nu klickbara och expanderar för att visa enskilda poster
- Knapparna **Lägg till transaktion** och **Skanna kvitto** tillagda längst upp på Översikt-sidan
- Nav-länk **Fasta** tillagd i bottom navigation
- Mindee API för OCR scanning

### Ändrat
- Kategoriöversikten på Översikt stödjer nu flera expanderade rader samtidigt
- Transaktioner i expanderad kategorivy visar notering eller datum som etikett

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
