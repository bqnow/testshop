# Playwright Framework Dokumentation

## Einleitung
Willkommen im Showcase-Branch `showcase/playwright`. Dieses Projekt bietet eine industrietaugliche Referenzarchitektur für skalierbare, wartbare und robuste End-to-End-Tests (E2E).

---

## 1. Quick Start (Schnelleinstieg)

Für den sofortigen Start sind folgende Schritte erforderlich:

1.  **Abhängigkeiten installieren:**
    ```bash
    npm install
    npx playwright install --with-deps
    ```
2.  **Tests ausführen (lokal):**
    ```bash
    npm run test:e2e
    ```
3.  **Vollständiger Zyklus (inkl. Reports):**
    ```bash
    npm run test:full-cycle
    ```

---

## 2. Framework-Konfiguration & Modi

Die Wahl von Playwright basiert auf wegweisenden Features für moderne Web-Applikationen:
*   **Auto-Waiting:** Automatische Prüfung der Interaktionsbereitschaft (Klickbarkeit, Sichtbarkeit).
*   **Engine-Native Steuerung:** Direkte Kommunikation mit Chromium, Firefox und WebKit.
*   **Forensik:** Detaillierter **Trace Viewer** für die Analyse von Fehlern (DOM, Netzwerk, Screenshots).

### Ausführungsmodi (Headed vs. Headless)
Standardmäßig operiert das Framework im **Headless-Modus** (ohne sichtbares Fenster), was ideal für Performance und CI/CD ist. Zur interaktiven Analyse kann der Modus umgeschaltet werden:
*   **Headless (Standard):** `npm run test:e2e`
*   **Headed (Sichtbar):** `HEADLESS=false npm run test:e2e`

---

## 3. Workflow & Script-Referenz

Das Framework bietet spezialisierte Befehle für jede Phase der Entwicklung:

### 3.1 Orchestrierter Workflow
*   **`npm run test:full-cycle`**: Führt den kompletten Test-Zyklus aus. Er sichert die Historie, startet die Tests, generiert den Allure-Bericht, archiviert die Ergebnisse und öffnet das Dashboard.

### 3.2 Test-Targets
*   **`npm run test:e2e`**: Lokaler Testlauf gegen `localhost`.
*   **`npm run test:qa` / `:staging` / `:prod`**: Ausführung gegen dedizierte Umgebungen mittels spezifischer Konfigurationsdateien in `tests/config/`.

### 3.3 Reporting-Spezialbefehle
*   **`npm run report:history`**: Manuelle Sicherung der Trend-Daten (notwendig vor Neugenerierung für Graphen-Kontinuität).
*   **`npm run report:generate`**: Erstellung des statischen Allure-Berichts aus Rohdaten.
*   **`npm run report:open`**: Startet das lokale Web-Dashboard.
*   **`npm run report:archive`**: Zeitgestempeltes Backup in `tests/reporting/archive/`.
*   **`npm run report:clean`**: Vollständiges Löschen aller temporären Berichtsdaten.

---

## 4. Architektur & Best Practices

### 4.1 Page Object Model (POM)
Das POM-Pattern trennt Testlogik von technischer Implementierung. Jede Seite wird durch eine Klasse repräsentiert, was Redundanz minimiert und Wartbarkeit bei Design-Änderungen maximiert.

### 4.2 Robuste Selektoren
Wir priorisieren stabile Identifikatoren:
1.  **`data-testid`**: Speziell für Tests reservierte Attribute.
2.  **User-Rollen (`getByRole`)**: Testet die Applikation aus Sicht eines Endanwenders (Barrierefreiheit).

### 4.3 Dependency Injection (Fixtures)
Über `tests/fixtures/base-test.ts` werden Page Objects automatisch in die Test-Suiten injiziert. Dies reduziert Boilerplate-Code und ermöglicht ein zentrales Setup-Management.

---

## 5. Enterprise Features

### 5.1 Umgebungsmanagement (Multi-Env)
Über Umgebungsvariablen (`BASE_URL`) wird gesteuert, gegen welche Instanz getestet wird. Zugangsdaten und Secrets werden sicher über `tests/config/test-config.ts` bezogen.

### 5.2 Testdaten (Data-Driven)
Wir nutzen `@faker-js/faker` für synthetische Testdaten und iterative Testschleifen (`for..of`), um verschiedene Validierungsszenarien mit minimalem Code-Aufwand abzudecken.

---

## 6. Infrastruktur & Skalierung

### 6.1 Docker & Isolation
Das Mitliefern eines Docker-Setups garantiert eine "Bit-identische" Umgebung zwischen lokalem Rechner und CI/CD-Server. Details finden Sie in der [DOCKER.md](../DOCKER.md).

### 6.2 CI/CD Pipeline
GitHub Actions führt die Tests bei jedem Code-Push aus. Ergebnisse werden als `reporting-artifacts` hochgeladen und können zur Fehleranalyse (Traces/Videos) heruntergeladen werden.

### 6.3 Cloud-Grid (BrowserStack)
Vorbereitet für massive Skalierung auf echten Geräten. Aktivierung erfolgt einfach durch Hinterlegen der Credentials (`BROWSERSTACK_USERNAME`) in der `.env`.

---

## 7. Reporting-Übersicht

Wir nutzen ein duales System in `tests/reporting/`:
1.  **Allure Report:** Hochwertige Dashboards mit Trend-Analyse über Zeit (ideal für Kommunikation mit Stakeholdern).
2.  **Playwright HTML Report:** Technisches Detail-Reporting inklusive Trace-Viewer (direkter Fokus auf Bugfixing).
