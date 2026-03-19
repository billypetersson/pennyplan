# Changelog

Alla ändringar i projektet dokumenteras här.

---

## [2.1.0] - 2026-03-19

### Lagt till
- Onboarding-flöde för nya användare (6 steg): välkommen, valuta/tema, lön, budget, sparmål, klart
- Varje steg är valfritt att hoppa över — användaren blockeras aldrig
- Smooth slide-transition mellan steg med riktningskänsla (framåt/bakåt)
- "Starta om introduktion"-knapp i inställningar för att köra onboarding igen
- Onboarding visas endast för nya konton — befintliga användare påverkas inte
- Fakturaläge i kvittoscanners — välj Kvitto eller Faktura, extraherar rätt fält (förfallodatum, fakturanummer, leverantör)
- "Idag"-knapp i datumväljaren för att snabbt välja dagens datum
- Knapp för att skanna Kvitto / Faktura på transaktionssidan flyttad till toppen
- Skannaknappen på översikt och transaktioner har fått färggradient för bättre igenkänning

### Åtgärdat
- Befintliga användare omdirigerades felaktigt till onboarding — åtgärdat genom att sätta `onboarding_complete: false` explicit vid registrering
- `fixed_costs`-tabellen saknade `on delete cascade` på `user_id` — orsakade fel vid borttagning av användare
- `fixed_costs`-tabellen saknade definition i `schema.sql`

---

## [1.9.0] - 2026-03-19

### Lagt till
- Radera konto-knapp med bekräftelsepopup — all data raderas permanent via Supabase RPC `delete_user`
- "SÄKERT?!"-hover-animation på raderingsknappen som varning innan bekräftelse
- Spara inställningar-knapp — ändringar i valuta och tema förhandsgranskas men sparas explicit
- Temavalet uppdateras direkt vid toggle utan att vänta på sparning

### Åtgärdat
- Belopp med ören visade bara en decimal (34,5 kr) — visas nu korrekt som 34,50 kr; heltal visas utan decimaler

### Förbättrat
- Inställningssidan: alla rader justerade horisontellt — högra kontroller är nu konsekvent högerjusterade med fast bredd
- Inställningssidan: mer luftig topp- och bottenmarginal i varje kort
- Inställningssidan: kompaktare radavstånd mellan alternativ

---

## [1.8.0] - 2026-03-19

### Lagt till
- Anpassad datumväljare (DatePicker) ersätter webbläsarens inbyggda kalender — matchar appens design och fungerar i både ljust och mörkt läge
- Datumväljaren öppnar sig automatiskt uppåt eller nedåt beroende på tillgängligt utrymme, och hamnar alltid inom skärmen
- Valutainställning — välj mellan Svensk krona (SEK, standard) och Euro (EUR) under Inställningar
- Valuta sparas per användare i Supabase och synkas vid inloggning på alla enheter
- Alla belopp i appen följer vald valuta
- Temainställning (ljust/mörkt läge) sparas nu per användare i Supabase — synkas vid inloggning
- Nytt betalningsintervall "Varannan månad" för fasta kostnader — beräknas korrekt i månads- och årssammanställning samt i PDF-exporten
- "Byt lösenord"-flöde direkt från inställningssidan — inloggade användare kan byta lösenord utan e-postlänk

### Åtgärdat
- Dashboard visade transaktioner från kommande månader — filtret begränsas nu korrekt till vald månad
- Navigationen kraschade vid nätverksfel under autentiseringskontroll — hanteras nu med fallback till inloggningssidan
- `addTransaction` och `addCost` kraschade med "Cannot read property id of null" om sessionen löpt ut — null-kontroll tillagd
- Procentberäkning för sparmål kraschade vid målbelopp 0 — division med noll förhindras nu

### Förbättrat
- Inställningssidan omdesignad — färgkodade ikonbehållare, jämnare radavstånd och konsekventa kontroller för alla rader
- Borttagna oanvända sektioner (Data, Om appen) från inställningssidan

---

## [1.5.0] - 2026-03-18

### Lagt till
- **Lönestatus-kort** per månad på Transaktionssidan — visar en tydlig "Lägg till lön"-knapp om ingen lön är registrerad för månaden, annars en grön bekräftelse med beloppet
- Lönen kan bara läggas till en gång per månad via det dedikerade kortet — byter automatiskt till bekräftat läge efter registrering
- Senast registrerade lönbelopp sparas i localStorage och fylls i automatiskt nästa gång knappen används
- Stöd för `type` och `category_id` som prefill-parametrar i TransactionForm

---

## [1.4.0] - 2026-03-18

### Lagt till
- Kvittoskanning — ladda upp en bild av ett kvitto och låt OCR fylla i belopp, datum och butik automatiskt
- Kvittobilderna sparas i Supabase Storage och kopplas till transaktionen
- Kvittoikon visas på transaktioner som har ett kvitto — klicka för att öppna originalbilden
- Lagringspolicyer (RLS) för kvitto-bucket så att användare bara kan se sina egna kvitton

---

## [1.3.0] - 2026-03-18

### Lagt till
- Glömt lösenord-flöde på inloggningssidan med e-postutskick via Supabase
- Ny sida `/auth/reset-password` där användaren anger nytt lösenord efter att ha klickat på återställningslänken
- Skelett-laddningsskärm (shimmer) på Översikt medan data hämtas från databasen — ersätter de vilseledande nollvärdena
- Ny återanvändbar `SkeletonBlock`-komponent med shimmer-animation

### Åtgärdat
- Felmeddelandet vid fel lösenord visade "Inget konto hittades" — ändrat till "Fel e-postadress eller lösenord"
- Validering vid tomt formulär visade webbläsarens inbyggda engelska feltext — ersatt med svenska felmeddelanden
- Återställningslänken hanteras nu korrekt via `PASSWORD_RECOVERY`-händelsen istället för `getSession()` som anropades för tidigt

---

## [1.2.0] - 2026-03-18

### Lagt till
- `AppLogo`-komponent som används konsekvent på alla ställen där logotypen visas (inloggning, bekräftelse, sidomenyn, inställningar)
- Coins-ikon i guld bredvid logotyptexten med studsanimation vid hover
- Subtila hover-animationer på navigationsikoner — varje ikon har en unik animation (puls, glidning, studs, svaj)

### Ändrat
- Logotypteckensnittet bytt till Google Font **Caveat**
- Logotypfärg ändrad till `--color-primary-dark` (mörkgrön)
- Inter används nu som typsnitt i hela appen
- Teckensnittsrendering ändrad till `subpixel-antialiased` för skarpare text

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
