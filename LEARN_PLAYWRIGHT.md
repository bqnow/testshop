# 🎭 Playwright Framework Dokumentation

Willkommen im **Showcase-Branch für Playwright**.
Dieser Branch (`showcase/playwright`) demonstriert eine Referenzimplementierung für moderne Testautomatisierung.

Dieses Dokument erläutert die Architektur-Entscheidungen und Patterns, die verwendet wurden, um eine skalierbare und wartbare Testlösung aufzubauen.

---

## 🏗️ Stufe 1: Der Technologie-Stack

Die Wahl fiel bewusst auf einen modernen Stack:

1.  **Playwright (vs. Selenium/Cypress):**
    *   **Performance:** Parallele Ausführung und geringer Overhead.
    *   **Stabilität:** "Auto-Waiting"-Mechanismus reduziert Flakiness (keine manuellen `sleeps` notwendig).
    *   **Analyse:** Integrierter **Trace Viewer** für detaillierte Fehleranalyse.

2.  **TypeScript:**
    *   **Typsicherheit:** Tests profitieren stark von Typisierung, da Fehler (z.B. falsche Parameter) bereits zur Entwicklungszeit erkannt werden.

---

## 🛠️ Stufe 1.5: Automatisierter WebServer

Für die Ausführung der Tests ist kein manueller Start der Anwendung notwendig.

In der `playwright.config.ts` ist der WebServer konfiguriert:
```typescript
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```
**Funktionsweise:**
Playwright prüft, ob der Port 3000 aktiv ist. Falls nicht, wird die Anwendung automatisch gestartet, die Tests ausgeführt und der Server danach beendet. Dies vereinfacht den Workflow (DX - Developer Experience) erheblich.

---

## 🧱 Stufe 2: Architektur (Page Object Model)

**Problemstellung:**
Unstrukturierte Testskripte mischen Testlogik mit technischen Selektoren (z.B. `#user`, `.btn`). Ändert sich ein Selektor, müssen potenziell hunderte Tests angepasst werden.

**Lösung: Page Object Model (POM)**
Technische Details werden in separaten Klassen (`tests/pages/`) gekapselt. Der Test beschreibt die fachliche Intention, die Page Class implementiert die technische Ausführung.

👉 **Beispiel:** `tests/pages/LoginPage.ts`
```typescript
// Im Test:
await loginPage.login('admin', 'pwd');
```
Bei Änderungen am Login-Formular muss lediglich die `LoginPage`-Klasse angepasst werden; die Tests bleiben unberührt.

---

## 🎯 Stufe 3: Selektoren-Strategie (Stabilität)

**Problemstellung:**
Tests schlagen oft fehl, weil Layout-Änderungen (CSS/HTML) die Selektoren ungültig machen.

**Lösung:**
Verwendung stabiler, semantischer Attribute.

1.  **`getByTestId`**: Bevorzugte Methode. Selektiert Elemente anhand dedizierter Test-Attribute (`data-testid`). Dies entkoppelt Tests vom Design.
2.  **`getByRole`**: Prüft zusätzlich die Zugänglichkeit (Accessibility/Semantik), z.B. `getByRole('button', { name: 'Suchen' })`.

**Best Practice:** Vermeidung von XPath und instabilen CSS-Pfaden.

---

## 🚀 Stufe 4: Wiederverwendbarkeit (Fixtures)

**Problemstellung:**
Wiederkehrender Boilerplate-Code (Initialisierung von Page Objects, Login-Prozeduren) erschwert die Lesbarkeit.

**Lösung: Custom Fixtures (`tests/fixtures/base-test.ts`)**
Das `test`-Objekt von Playwright wurde erweitert:
*   **Dependency Injection:** Page Objects (`shopPage`, `cartPage`) werden direkt in den Test injiziert.
*   **Auto-Login:** Die Fixture `loggedInPage` führt die Authentifizierung automatisch vor Testbeginn durch.

👉 **Ergebnis:** Siehe `tests/e2e/happy-path.spec.ts` für einen rein fachlichen, kompakten Testablauf.

---

## 🔐 Stufe 5: Production Readiness (Daten & Environments)

Ein professionelles Framework muss sicher und umgebungsunabhängig sein.

1.  **Secrets Management:**
    Sensible Daten (Passwörter) werden nicht im Code gespeichert. Es werden `.env`-Dateien verwendet. Playwright lädt diese mittels `dotenv`.

2.  **Dynamische Daten (Faker)**
    Um Caching-Effekte zu vermeiden und reale Szenarien zu simulieren, werden Nutzerdaten (Name, Email) mittels `@faker-js/faker` dynamisch generiert.
    Dies geschieht direkt im Test, um bei jedem Durchlauf neue Werte zu erhalten.
    👉 **Referenz:** Siehe `tests/e2e/happy-path.spec.ts` (Checkout-Schritt).

3.  **Environment Konfiguration:**
    Durch `baseURL: process.env.BASE_URL` in der Konfiguration ist der Testcode agnostisch gegenüber der Zielumgebung (Localhost, Staging, Production).

---

## ⚡ Stufe 6: Performance durch Parallelisierung

Playwright nutzt Parallelisierung für maximale Geschwindigkeit.

**Konfiguration (`playwright.config.ts`):**
```typescript
fullyParallel: true,
workers: process.env.CI ? 2 : undefined, 
```

**Konzept der Isolation:**
Playwright verwendet **`BrowserContexts`**. Jeder Test läuft in einem isolierten Kontext (vergleichbar mit einem Inkognito-Fenster).
*   Jeder Test besitzt eigenen LocalStorage und Cookies.
*   Tests beeinflussen sich gegenseitig nicht (keine "Side Effects").
Dies ermöglicht eine sichere, parallele Ausführung.

---

## 🌍 Stufe 7: Environments (Flexibilität)

Derselbe Testcode kann gegen verschiedene Umgebungen ausgeführt werden:
1.  Lokal (`localhost:3000`)
2.  Staging (`staging.testshop.com`)
3.  Production (`testshop.com`)

**Implementierung:**
Harte URLs wurden entfernt. Stattdessen werden Umgebungsvariablen genutzt:
```typescript
// Fallback auf localhost, wenn BASE_URL nicht gesetzt ist
baseURL: process.env.BASE_URL || 'http://localhost:3000',
```
In der CI-Pipeline kann die Ziel-URL somit dynamisch gesteuert werden.

---

## 🤖 Stufe 8: CI/CD Pipeline

Automatisierung ist der Schlüssel zur Qualitätssicherung.
Der Workflow `.github/workflows/playwright.yml` definiert:
*   Automatischer Start bei jedem Git Push.
*   Installation der Abhängigkeiten und Browser.
*   Ausführung der Tests.
*   Archivierung der Test-Reports (Video/Traces) im Fehlerfall.

---

## 🐛 Stufe 9: Debugging & Analyse

Effiziente Fehleranalyse ist essentiell. Playwright bietet hierfür fortschrittliche Werkzeuge:

### 1. UI Mode (Time Travel)
Befehl: `npx playwright test --ui`
*   Ermöglicht das zeilenweise Debuggen ("Stepping").
*   **Time Travel:** Visuelle Darstellung des DOM-Zustands vor und nach jeder Aktion.
*   **Locator Picker:** Integriertes Tool zum Finden valider Selektoren.

### 2. Trace Viewer
Bei Fehlern in der CI/CD-Pipeline speichert Playwright einen **Trace** (Zip-Datei).
Dieser enthält Screenshots, DOM-Snapshots, Netzwerk-Logs und Konsolenausgaben für den gesamten Testlauf. Analyse unter: [trace.playwright.dev](https://trace.playwright.dev).

---

## ✅ Zusammenfassung

Dieses Framework erfüllt folgende Qualitätskriterien:
1.  **Wartbarkeit** (durch POM).
2.  **Stabilität** (durch robuste Selektoren).
3.  **Effizienz** (durch Fixtures und Parallelisierung).
4.  **Sicherheit & Flexibilität** (durch Environment-Variablen).

**Empfohlener nächster Schritt:** Klonen des Branches und Implementierung eines weiteren Testfalls (z.B. "Löschen aus dem Warenkorb") unter Verwendung der bestehenden Patterns.
