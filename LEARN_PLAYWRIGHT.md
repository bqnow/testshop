# Playwright Framework Dokumentation

## Einleitung
Willkommen im Showcase-Branch `showcase/playwright`.
Dieses Projekt demonstriert eine Referenzarchitektur für skalierbare, wartbare und robuste E2E-Tests. Ziel ist es, Best Practices zu vermitteln, die über einfaches "Skripting" hinausgehen und "Enterprise-Ready" sind.

---

## 1. Fundament & Setup

Playwright wurde als Test-Runner gewählt, es hat entscheidende Vorteile gegenüber älteren Tools (wie Selenium):
*   **Auto-Waiting:** Playwright wartet automatisch, bis Elemente klickbar sind. Instabile `sleep()` Befehle entfallen.
*   **Browser-Engine:** Es steuert Chromium, Firefox und WebKit nativ, was extrem schnelle Ausführungszeiten ermöglicht.
*   **Trace Viewer:** Bietet im Fehlerfall eine vollständige Aufzeichnung (Video, DOM, Netzwerk) zur Analyse.

### Automatisierter WebServer
Die `playwright.config.ts` ist so konfiguriert, dass sie den lokalen Serverstatus prüft:
*   Wird lokal getestet, startet Playwright automatisch die App (`npm run dev`), falls sie nicht läuft.
*   Wird gegen Staging/Prod getestet, wird dieser Schritt übersprungen.
Dies reduziert manuelle Schritte.

---

## 2. Architektur & Wartbarkeit

Ein robustes Framework steht und fällt mit seiner Struktur. Spaghetti-Code in Tests führt zu hohen Wartungskosten.

### 2.1 Das Page Object Model (POM)
Das "Page Object Model" ist ein Design-Pattern, das hilft, Tests lesbar und wartbar zu halten.
Die Grundidee ist einfach: Jede Seite der App (z.B. Login-Seite, Warenkorb) wird durch eine eigene Klasse repräsentiert. Diese Klasse enthält alle Selektoren und Aktionen für diese Seite.
Der Test selbst kümmert sich nur noch um den Ablauf, nicht mehr darum, ob ein Button `#submit` oder `.btn-primary` heißt.

**Vorteil:** Ändert sich das Design der Login-Seite, muss nur die `LoginPage`-Klasse an einer Stelle angepasst werden, nicht jeder einzelne Test.

### 2.2 Selektoren-Strategie (Stabilität)
Um Tests gegen Design-Änderungen abzuhärten, nutzen wir:
1.  **Explizite Test-IDs (`data-testid`):** Diese Attribute sind stabil und ändern sich nicht beim Redesign.
2.  **Semantische Rollen (`getByRole`):** Prüft Buttons und Links so, wie ein Screenreader sie sieht.
*Vermeide instabile Pfade wie XPath oder CSS-Ketten (`div > div > button`).*

### 2.3 Fixtures (Dependency Injection)
Anstatt Page Objects in jedem Test neu zu instanziieren (`const login = new LoginPage...`), nutzen wir Playwrights Fixture-System (`tests/fixtures/base-test.ts`).
Die benötigten Pages werden dem Test einfach als Argument übergeben. Das reduziert Boilerplate-Code drastisch und ermöglicht zentrale Setup-Logik (z.B. automatischer Login vor dem Test).

---

## 3. Skalierung & Enterprise Features

Für den professionellen Einsatz in großen Teams sind folgende Aspekte implementiert:

### 3.1 Environments (Staging, QA, Prod)
Tests dürfen keine hardcodierten URLs enthalten (`http://localhost`).
Wir nutzen Umgebungsvariablen (`BASE_URL`), die über NPM Scripts gesteuert werden. In der `package.json` finden sich Shortcuts:
*   `npm run test:e2e` (Lokal)
*   `npm run test:qa` (QA Umgebung)
*   `npm run test:prod` (Live Umgebung)

### 3.2 Parallelisierung (Performance)
Playwright führt Tests standardmäßig parallel aus (Default: lokal Anzahl der CPU-Kerne, auf CI konfigurierbar).
**Sicherheit:** Jeder Test läuft in einem isolierten `BrowserContext` (wie ein eigenes Inkognito-Fenster). Lokale Daten (LocalStorage, Cookies) werden nicht geteilt. Tests können sich somit nicht gegenseitig beeinflussen, was "Flaky Tests" verhindert.

### 3.3 Testdaten & Sicherheit
*   **Secrets:** Passwörter liegen niemals im Code, sondern in `.env` Dateien (lokal) oder Secrets-Managern (CI).
*   **Dynamische Daten:** Um Caching-Effekte zu umgehen und Validierungen zu stressen, werden Nutzerdaten (Name, Email) bei jedem Lauf mittels `@faker-js/faker` zufällig neu generiert. Dies erhöht die Testabdeckung signifikant.

---

## 4. Automatisierung (CI/CD)

Die Datei `.github/workflows/playwright.yml` definiert die Pipeline für GitHub Actions.
Sie stellt sicher, dass Änderungen am Code automatisch verifiziert werden.

**Der Workflow im Detail:**
1.  **Trigger:** Startet bei jedem `push` auf Branches und bei `pull_request`.
2.  **Environment:** Setzt einen Ubuntu-Container auf und installiert Node.js.
3.  **Setup:** Installiert Projektabhängigkeiten und Playwright-Browser.
4.  **Test:** Führt `npm run test:e2e` aus.
5.  **Artifacts:** Lädt im Fehlerfall den HTML Report (inkl. Traces & Videos) hoch, damit man den Fehler analysieren kann.

### Debugging
Sollte ein Test in der Pipeline fehlschlagen, kann der **Trace** heruntergeladen und auf [trace.playwright.dev](https://trace.playwright.dev) analysiert werden. Dies ermöglicht eine "Zeitreise" durch den Testablauf, um den exakten Fehlerzeitpunkt zu finden.
