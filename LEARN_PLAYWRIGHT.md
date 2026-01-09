# 🎭 Playwright Masterclass: Vom Skript zum Framework

Willkommen im **Showcase-Branch für Playwright**! 👋
Dieser Branch (`showcase/playwright`) ist nicht nur eine Lösung, sondern eine **Blaupause für professionelle Testautomatisierung**.

Dieses Dokument erklärt dir Schritt für Schritt, **warum** wir den Code so aufgebaut haben. Es ist dein Guide, um von "Ich schreibe Tests" zu "Ich baue Testing-Architekturen" zu kommen.

---

## 🏗️ Stufe 1: Das Fundament (Warum diese Tools?)

Wir haben uns hier bewusst für einen modernen Stack entschieden:

1.  **Playwright (statt Selenium/Cypress):**
    *   *Warum?* Es ist rasend schnell, testet alle modernen Browser (Chromium, Firefox, WebKit) und hat "Auto-Waiting" (nie wieder instabile `sleep(1000)`!).
    *   *Feature:* Der **Trace Viewer** zeigt dir bei Fehlern einen kompletten "Film" inkl. Netzwerk-Requests.

2.  **TypeScript:**
    *   *Warum?* Tests sind Code. Ohne Typensicherheit (`string`, `number`) passieren dumme Fehler. TypeScript hilft uns, Fehler schon beim Schreiben zu finden (z.B. falsche Parameter beim Login).

---

## 🛠️ Stufe 1.5: Komfort (Der automatische WebServer)

Vielleicht hast du dich gefragt: *"Muss ich `npm run dev` in einem extra Fenster starten?"*
**Antwort: Nein!**

In der `playwright.config.ts` haben wir das für dich konfiguriert:
```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```
Das bedeutet:
1.  Playwright checkt: Läuft auf Port 3000 schon was?
2.  Wenn **ja** (du entwickelst gerade): Nutzt er es.
3.  Wenn **nein** (CI Pipeline oder frischer Start): Fährt Playwright die App automatisch hoch, wartet bis sie "Ready" ist, testet, und fährt sie wieder runter.

Das ist "Developer Experience" (DX) vom Feinsten.

---

## 🧱 Stufe 2: Ordnung halten (Page Object Model)

**Problem:** Anfänger schreiben oft Tests so:
```javascript
// ❌ Schlechter Stil (Spaghetti Code)
test('Login', async ({ page }) => {
  await page.fill('#user', 'admin');
  await page.click('.btn-primary');
  await page.fill('#search', 'Laptop');
  await page.click('.product-1');
});
```
Wenn sich die ID von `#user` auf `#username` ändert, musst du **50 Tests reparieren**. Ein Albtraum! 😱

**Lösung: Page Object Model (POM)**
Wir kapseln die technischen Details in Klassen (`tests/pages/`).
Der Test sagt nur noch *WAS* er will, die Page Class weiß *WIE* es geht.

👉 **Schau dir an:** `tests/pages/LoginPage.ts`
```typescript
// ✅ Guter Stil
await loginPage.login('admin', 'pwd');
```
Ändert sich der Selektor, ändern wir nur **eine Zeile** in der `LoginPage.ts`. Alle Tests bleiben grün.

---

## 🎯 Stufe 3: Stabile Selektoren (Resilience)

**Problem:** Tests schlagen fehl, weil sich das Layout ändert (`div > div > button`).
**Lösung:** Wir nutzen Attribute, die sich nicht ändern.

1.  **`getByTestId`**: Beste Wahl. Wir haben im Code `data-testid="login-btn"` vergeben. Das ist ein Vertrag zwischen Entwickler und Tester.
2.  **`getByRole`**: Zweitbeste Wahl. Prüft auch Barrierefreiheit (z.B. `getByRole('button', { name: 'Suchen' })`).

👉 **Lerneffekt:** Vermeide XPath und CSS-Ketten. Nutze semantische Selektoren.

---

## 🚀 Stufe 4: Wiederholungen töten (Fixtures)

**Problem:** In jedem Test steht am Anfang:
```typescript
const loginPage = new LoginPage(page);
await loginPage.goto();
...
```
Das ist langweilig und bläht den Code auf.

**Lösung: Custom Fixtures (`tests/fixtures/base-test.ts`)**
Wir haben das `test`-Objekt von Playwright erweitert.
*   Wir injizieren die Page Objects (`shopPage`, `cartPage`) direkt in den Test.
*   Wir haben sogar eine **Auto-Login** Fixture (`loggedInPage`), die den Login erledigt, *bevor der Test überhaupt startet*.

👉 **Ergebnis:** Schau dir `tests/e2e/happy-path.spec.ts` an. Er ist extrem kurz und sauber!

---

## 🔐 Stufe 5: Production Ready (Daten & Environments)

Profi-Tests dürfen keine Geheimnisse enthalten!

1.  **Keine Passwörter im Code!**
    Wir nutzen `.env` Dateien. Lokal (`.env.local`) steht das Passwort, aber im Git steht nur der Platzhalter. Playwright lädt das via `dotenv` in der `playwright.config.ts`.

2.  **Dynamische Daten (Faker)**
    Bestellt nicht immer als "Max Mustermann". Wir nutzen `@faker-js/faker`, um bei jedem Testlauf einen neuen Namen und Email zu generieren. Das findet Fehler, die bei statischen Daten verborgen bleiben.
    👉 **Schau dir an:** `tests/data/test-data.ts` und den Checkout im Happy Path.

3.  **URL Config**
    Wegen `baseURL: process.env.BASE_URL` in der Config können wir denselben Test gegen `localhost`, `staging` oder `production` laufen lassen, ohne eine Zeile Code zu ändern.


---

## ⚡ Stufe 6: Geschwindigkeit durch Parallelisierung

Einer der größten Vorteile von Playwright ist die Geschwindigkeit. Das erreichen wir durch **Parallelisierung**.

**Wie funktioniert das?**
Schau in `playwright.config.ts`:
```typescript
fullyParallel: true,
workers: process.env.CI ? 2 : undefined, 
```
Playwright startet mehrere "Worker" Prozesse gleichzeitig. Wenn du 4 CPU-Kerne hast, laufen 4 Tests gleichzeitig!

**Die Gefahr ("Flaky Tests"):**
Wenn Test A und Test B gleichzeitig im Shop einkaufen und denselben User nutzen, könnten sie sich den Warenkorb gegenseitig löschen! 💥

**Unsere Lösung (Isolation):**
Playwright nutzt **`BrowserContext`**. Jeder Test bekommt einen **frischen, isolierten Browser** (wie ein privates Inkognito-Fenster).
*   Test A hat seinen eigenen LocalStorage & Cookies.
*   Test B hat seinen eigenen LocalStorage & Cookies.
*   *Ergebnis:* Sie wissen nichts voneinander und stören sich nicht. Wir können sicher parallel testen!

---

## 🌍 Stufe 7: Environments (Umgebungs-Unabhängigkeit)

Ein professioneller Test muss flexibel sein. Wir wollen denselben Testcode ausführen:
1.  Lokal auf deinem Laptop (`localhost:3000`)
2.  Auf einer Testumgebung (`staging.testshop.com`) vor dem Release.
3.  Auf der echten Seite (`testshop.com`) als Monitor.

**Umsetzung im Framework:**
Wir haben das **fest verdrahtete** `http://localhost:3000` aus den Tests verbannt.
Stattdessen nutzen wir Umgebungsvariablen (`.env`).

In `playwright.config.ts`:
```typescript
// Wir laden .env Dateien für lokale Secrets
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Wir nutzen die Variable oder einen Fallback
baseURL: process.env.BASE_URL || 'http://localhost:3000',
```

**Der Vorteil:**
Du kannst jetzt in der CI-Pipeline (GitHub Actions) einfach eine Variable setzen, und der Test läuft gegen eine ganz andere URL, ohne dass du den Code ändern musst!

---

## 🤖 Stufe 8: CI/CD Pipeline


Ein Test, den niemand ausführt, ist wertlos.
Wir haben `.github/workflows/playwright.yml` angelegt.
*   Bei jedem **Git Push** startet GitHub einen Server.
*   Installiert Playwright.
*   Führt die Tests aus.
*   Lädt bei Fehlern ein Video/Trace hoch.

---

## 🐛 Stufe 9: Debugging wie ein Profi

Tests schlagen fehl. Das ist ihr Job. Die Frage ist: Wie schnell findest du den Fehler?
Playwright bietet hier Tools, von denen Selenium-Nutzer nur träumen:

### 1. Der UI Mode (Time Travel) 🕹️
Führe diesen Befehl aus:
```bash
npx playwright test --ui
```
Es öffnet sich ein Fenster, in dem du:
*   Jeden Test einzeln starten kannst.
*   **Time Travel:** Du kannst mit der Maus durch die Zeitleiste fahren und siehst exakt, wie die Seite vor und nach jedem Klick aussah.
*   Du kannst "Pick Locator" nutzen, um Selektoren direkt im Browser zu finden.

### 2. Der Trace Viewer (Die Blackbox) 📼
In der CI Pipeline sieht man den Browser nicht. Aber wenn ein Test fehlschlägt, speichert Playwright einen **Trace**.
Das ist eine Datei, die alles enthält: Screenshots, Netzwerk-Calls, Konsolen-Logs.
Du kannst diesen Trace herunterladen und auf [trace.playwright.dev](https://trace.playwright.dev) ansehen. Es ist wie ein Video-Beweis mit Röntgenblick.

---

## ✅ Zusammenfassung

Du hast jetzt ein Framework, das:
1.  **Wartbar** ist (Dank POM).
2.  **Stabil** ist (Dank TestIDs).
3.  **Effizient** ist (Dank Fixtures).
4.  **Sicher** ist (Dank .env).

**Nächster Schritt:** Klone diesen Branch und versuche, einen Test für das "Löschen aus dem Warenkorb" zu schreiben. Nutze dabei die existierenden Patterns!

Viel Erfolg! 🚀
