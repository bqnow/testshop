# Playwright Framework Dokumentation

## Einleitung
Willkommen im Showcase-Branch `showcase/playwright`.
Dieses Projekt demonstriert eine Referenzarchitektur für skalierbare, wartbare und robuste E2E-Tests.

---

## 1. Basisarchitektur & Framework-Konfiguration

Die Wahl von Playwright als primäres E2E-Test-Framework basiert auf strategischen Vorteilen gegenüber Legacy-Tools:
*   **Auto-Waiting:** Playwright antizipiert die Interaktionsbereitschaft von Elementen. Die Notwendigkeit instabiler `sleep()`-Anweisungen wird vollständig eliminiert.
*   **Engine-Native Steuerung:** Chromium, Firefox und WebKit werden nativ angesteuert, was eine extrem performante Testausführung ermöglicht.
*   **Trace Viewer:** Ermöglicht im Fehlerfall eine lückenlose forensische Analyse durch die Aufzeichnung von DOM-Snapshots, Netzwerkverkehr und Video-Sequenzen.

### Ausführungsmodi (Headed vs. Headless)
Standardmäßig operiert das Framework im **Headless-Modus**, um eine maximale Ausführungsgeschwindigkeit zu erreichen. Die Sichtbarkeit kann jedoch für Debugging-Zwecke flexibel gesteuert werden:
*   **Headless (Standard / CI-Ready):** `npm run test:e2e`
*   **Headed (Interaktive Analyse):** `HEADLESS=false npm run test:e2e`

---

## 2. Architektur & Wartbarkeit

### Automatisierter WebServer
Die `tests/playwright.config.ts` ist so konfiguriert, dass sie den lokalen Serverstatus prüft:
*   Wird lokal getestet, startet Playwright automatisch die App (`npm run dev`), falls sie nicht läuft.
*   Wird gegen Remote-Umgebungen (QA, Staging) getestet, wird dieser Schritt übersprungen.
Dies reduziert manuelle Schritte.

### 2.1 Das Page Object Model (POM)
Das Page Object Model ist ein essenzielles Design-Pattern zur Gewährleistung der Wartbarkeit und Lesbarkeit.
Jede logische Einheit der Applikation (z.B. LoginPage, ShoppingCart) wird durch eine dedizierte Klasse repräsentiert. Diese abstrahiert die technischen Selektoren und stellt fachliche Methoden (Aktionen) bereit. Der Testcode bleibt somit rein deklarativ und fokussiert sich auf die Geschäftsprozesse.

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

### 3.1 Environments (Lokal, QA, Staging)
Tests dürfen keine hardcodierten URLs enthalten (`http://localhost`).
Wir nutzen Umgebungsvariablen (`BASE_URL`), die über NPM Scripts gesteuert werden.
Die Konfigurationsdateien hierfür liegen in `tests/config/` (z.B. `.env.qa`).

In der `package.json` finden sich Shortcuts:
*   **`npm run test:full-cycle`** (Empfohlen: Führt Tests aus, rettet Historie, generiert Allure Report & Archiv)
*   `npm run test:e2e` (Standard-Lauf lokal)
*   `npm run test:qa` (QA Umgebung - nutzt `tests/config/.env.qa`)
*   `npm run test:staging` (Staging Umgebung - nutzt `tests/config/.env.staging`)
*   `npm run test:prod` (Produktionsumgebung - nutzt `tests/config/.env.prod`)

### 3.2 Parallelisierung (Performance)
Playwright führt Tests standardmäßig parallel aus (Default: lokal Anzahl der CPU-Kerne, auf CI konfigurierbar).
**Sicherheit:** Jeder Test läuft in einem isolierten `BrowserContext` (wie ein eigenes Inkognito-Fenster). Lokale Daten (LocalStorage, Cookies) werden nicht geteilt. Tests können sich somit nicht gegenseitig beeinflussen, was "Flaky Tests" verhindert.

### 3.3 Testdaten & Sicherheit
*   **Secrets:** Passwörter liegen niemals im Code. Sie werden in `tests/config/test-config.ts` zentral verwaltet und laden sich aus der passenden `.env` Datei im Ordner `tests/config/` (je nach `TEST_ENV` Variable).
*   **Agnostische Tests:** Die Credentials sind konfigurierbar, sodass der selbe Testcode gegen QA und Staging laufen kann.
*   **Dynamische Daten:** Um Caching-Effekte zu umgehen und Validierungen zu stressen, werden Nutzerdaten (Name, Email) bei jedem Lauf mittels `@faker-js/faker` zufällig neu generiert. Dies erhöht die Testabdeckung signifikant.

### 3.4 Data-Driven Testing
Anstatt Tests für verschiedene Eingaben (z.B. ungültige Email, falsche PLZ) zu kopieren, trennen wir Daten von Logik.
Wir definieren ein Array von Testfällen und iterieren darüber (`for..of`).
Playwright generiert daraus zur Laufzeit dynamische Tests.
👉 **Referenz:** Siehe `tests/e2e/checkout-validation.spec.ts`.

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

---

## 5. Reporting & Analyse

Wir nutzen ein duales Reporting-System, um sowohl Management-Übersichten als auch tiefes technisches Debugging zu ermöglichen. Alle Reports liegen zentral in `tests/reporting/`.

### 5.1 Allure Reporting (Management & Trends)
Allure bietet eine visuell ansprechende Aufbereitung der Testergebnisse inklusive Historie.
*   **History/Trends:** Erkenntnisse über Teststabilität über Zeit.
*   **Archiv:** Jeder Lauf wird zeitgestempelt in `tests/reporting/archive/` gesichert.
*   **Befehle:**
    *   `npm run report:generate`: Baut den aktuellen Report.
    *   `npm run report:open`: Öffnet das Dashboard.
    *   `npm run report:archive`: Archiviert den aktuellen Stand manuell.

### 5.2 Playwright HTML Report (Deep Debugging)
Der native Report ist direkt mit dem **Trace Viewer** verknüpft. Sobald ein Test fehlschlägt, kannst du hier Screenshots, Videos und Netzwerk-Logs pro Klick einsehen.
*   📂 Pfad: `tests/reporting/playwright/index.html`

### 5.3 Der Full-Cycle Workflow
Für eine umfassende Validierung inklusive Trend-Analyse wird der Befehl `npm run test:full-cycle` empfohlen. Dieser orchestrale Workflow automatisiert folgende Schritte:
`Datenpersistenz sichern` ➡️ `Testausführung` ➡️ `Berichtgenerierung` ➡️ `Archivierung` ➡️ `Auto-Open`.

#### Datenpersistenz & Trend-Analyse (History Preservation)
Allure operiert standardmäßig zustandslos. Um eine kontinuierliche Trend-Analyse über mehrere Testläufe hinweg zu ermöglichen, werden die historischen Daten aus dem letzten Bericht (`allure-report/history`) vor der Neugenerierung in das aktuelle Ergebnisverzeichnis (`allure-results/history`) transferiert. Dieser Prozess garantiert die Sichtbarkeit von Regressions-Trends.

---

## 6. Umgebungsanalyse: Varianten der Testausführung

| Feature | Lokal (Mac) | Docker (Local) | GitHub Actions (CI) |
| :--- | :--- | :--- | :--- |
| **Browser** | Chromium, Firefox, **WebKit** | Chromium, Firefox (WebKit skipped) | Chromium, Firefox (WebKit skipped) |
| **Performance** | Sehr hoch (nativ) | Hoch (Container-Overhead) | Mittel (Cloud-Ressourcen) |
| **History/Trend** | Ja (permanent auf Festplatte) | Ja (via Volume Mount) | **Nein** (Flüchtig / ZIP-Download) |
| **Debug-Tools** | UI Modus, Live-Fenster | Logs & Video-Files | Trace Viewer & Video-Artifacts |

**Wann was nutzen?**
*   **Lokal:** Während der Entwicklung für schnelles Feedback und WebKit-Tests.
*   **Docker:** Vor dem Push, um sicherzustellen, dass alles in einer sauberen Linux-Umgebung (identisch zur CI) läuft.
*   **CI:** Automatisierte Qualitätskontrolle bei jedem Pull Request.

---

## 7. Cloud-Skalierung (Enterprise Readiness)

Für globale Verfügbarkeitstests oder Cross-Browser-Checks auf echten Geräten (z.B. Safari auf iOS) ist das Framework für Cloud-Anbieter wie **BrowserStack** vorbereitet.

### Funktionsweise
Statt Browser lokal zu starten, verbindet sich Playwright via WebSocket (`connectOptions`) mit einem Remote-Grid. Dies ermöglicht:
*   **Massive Parallelisierung:** 100+ Tests gleichzeitig in der Cloud.
*   **Reale Endgeräte:** Testen auf physischen iPhones, iPads und verschiedenen Windows/macOS-Versionen.
*   **Integration:** Die Anbindung erfolgt dynamisch in der `playwright.config.ts`. Sobald `BROWSERSTACK_USERNAME` in der `.env` gesetzt ist, wird das Cloud-Projekt aktiviert.

*Hinweis: Für lokale Tests gegen Cloud-Browser ist ein Tunnel (z.B. BrowserStack Local) erforderlich, damit der Cloud-Server den lokalen `localhost:3000` erreichen kann.*
