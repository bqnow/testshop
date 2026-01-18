# 📘 QA Masterclass: Architektur & Mindset

Ziel ist die Vermittlung des "Big Picture" von moderner Webentwicklung, Git-Workflows und Teststrategien (Testpyramide, Shift Left).

---

## 🏗️ Teil 1: Die Anatomie einer modernen App

Qualitätssicherung findet nicht nur an der Oberfläche statt. Das Verständnis der Anwendungsstruktur ist essenziell, um Fehlerursachen zu identifizieren und die Testbarkeit sicherzustellen.

### 1. Der Bauplan (`package.json`)
Jedes moderne JavaScript/Node.js Projekt wird über diese Datei gesteuert. Sie ist das Herzstück.
*   **dependencies**: Die Liste der benötigten Bibliotheken. Hier ist ersichtlich, dass die Anwendung auf `next` (Next.js) und `react` basiert.
*   **scripts**: Die Definition der ausführbaren Befehle. Der Aufruf von `npm run dev` führt das hinterlegte Kommando (z.B. `next dev`) aus.
*   **Expertentipp:** Ein Blick in diese Datei verrät die genutzten Technologien, bevor die erste Zeile Code analysiert wird.

### 2. Git & GitHub: Das Sicherheitsnetz 🛡️

Git fungiert als **Versionsverwaltung** für Dateien. Es ermöglicht die Dokumentation jedes Zustands ("Commit").

*   **Git** (lokal): Speichert lokale Änderungen ab. Bei Fehlern ist eine Rückkehr zu vorherigen Zuständen jederzeit möglich.
*   **GitHub** (Cloud): Plattform zum Teilen und Verwalten von Code innerhalb des Teams.

**Der Workflow:**
![Git Workflow](./public/git-workflow.png)

1.  **`git add`**: Vormerken von Änderungen (Staging).
2.  **`git commit`**: Finales Speichern des Zustands mit einer aussagekräftigen Nachricht.
3.  **`git push`**: Übertragen der lokalen Änderungen nach GitHub.

Die `.gitignore` Datei dient dazu, unerwünschte oder sensible Daten von der Versionsverwaltung auszuschließen.

### 3. Der Filter (`.gitignore`)
Bestimmte Dateien und Ordner werden bewusst nicht auf GitHub hochgeladen:
*   **Abhängigkeiten** (`node_modules`): Diese sind sehr umfangreich und können jederzeit per `npm install` neu generiert werden.
*   **Secrets** (`.env`): Passwörter und API-Keys dürfen aus Sicherheitsgründen **niemals** hochgeladen werden.
*   **Build-Artefakte** (`.next`, `test-results`): Temporäre Dateien des Build- oder Testprozesses.

### 4. Die Layer-Architektur
Die Anwendung (`src/`) folgt einer klaren Struktur. Dieses Verständnis hilft bei der Konzeption effektiver Tests.

*   **UI Layer (View)** -> `src/components` & `src/app`
*   **Service Layer (Logic)** -> `src/services` (`productService.ts`): Hier erfolgt die Datenverarbeitung und Logik.
*   **Data Layer (Model)** -> `src/lib/data.ts`: Die Datenquelle der Anwendung.

---

## 🔄 Teil 2: Agile QA & Shift Left

In agilen Projekten findet Qualitätssicherung **kontinuierlich** statt. Das Prinzip **"Shift Left"** besagt, dass Tests so früh wie möglich im Entwicklungsprozess durchgeführt werden.

### Der Agile QA Workflow

1.  **Requirement (Anforderung):** Prüfung der User Story auf Testbarkeit und Vollständigkeit (Edge Cases, Test-IDs), bevor die Entwicklung beginnt.
2.  **Implementation (Entwicklung):** Parallele Erstellung der automatisierten Tests.
3.  **Pull Request & Review:** Automatisierte Ausführung der Tests als Voraussetzung für das Mergen von Code in den Hauptzweig (`main`).

---

## 🔼 Teil 3: Die Testpyramide

Die Teststrategie sollte ausgewogen sein, um Geschwindigkeit und Stabilität zu gewährleisten.

![Test Pyramid](./public/test-pyramid.png)

**Die Ebenen (von unten nach oben):**

1.  **Unit Tests (Basis):** Schnelle Tests einzelner Funktionen durch die Entwicklung.
2.  **Integration Tests (Mitte):** Überprüfung des Zusammenspiels mehrerer Komponenten.
3.  **E2E (End-to-End) Tests (Spitze):** Simulation kompletter User-Flows im Browser.

---

## 🛠️ Teil 4: Modernes "Test Engineering"

Testautomatisierung ist Softwareentwicklung und folgt entsprechenden Qualitätsregeln (Clean Code).

### Page Object Model (POM)
Trennung von Testlogik und technischer Implementierung. Seiten werden durch Klassen repräsentiert, was die Wartbarkeit bei UI-Änderungen signifikant erhöht.

### Testdaten Management
Nutzung von Variablen und Konfigurationsdateien statt statischer Werte, um Tests flexibel und umgebungsunabhängig zu gestalten.

### Reporting
Konfiguration von Traces, Videos und Screenshots, insbesondere für fehlgeschlagene Tests in der CI/CD-Pipeline, um die Fehleranalyse zu erleichtern.

---

## 🎯 Teil 4.1: Die Kunst der Selektoren

Wahl stabiler Identifikatoren zur Vermeidung von "flaky" Tests:

1.  🥇 **User-Facing Attributes (`Role`, `Label`, `Text`):** Simuliert die Sicht des Endanwenders und fördert die Barrierefreiheit.
2.  🥈 **Test IDs (`data-testid`):** Eigens für Testzwecke implementierte, robuste Attribute.
3.  ☠️ **No-Go (XPath / CSS Spaghetti):** Vermeidung von Pfaden, die bei geringfügigen DOM-Änderungen brechen.

---

## 🚀 Teil 5: Die Pipeline (CI/CD)

Automatisierung der Qualitätssicherung durch CI/CD-Systeme.

### Definitionen
1.  **CI (Continuous Integration):** Kontinuierliche Prüfung von Code-Uploads auf Build-Fähigkeit und Test-Erfolg ("Fail Fast").
2.  **CD (Continuous Delivery):** Automatisierte Bereitstellung auf Testsystemen bei erfolgreichen Tests.

### Phasen einer Pipeline
1.  **Trigger:** Der Upload (`git push`) startet den Prozess.
2.  **Build Job:** Validierung der Code-Syntax.
3.  **Test Job:** Ausführung der automatisierten Tests.
4.  **Artifacts:** Speicherung von Beweismaterial (Screenshots, Traces) bei Fehlern.

### Verantwortlichkeit in der QS
In einer CD-Welt fungiert die Qualitätssicherung als **Gatekeeper**. Durch unsere **Gated Pipeline** (Build -> Test -> Deploy) sind stabile und aussagekräftige Tests die zwingende Voraussetzung für jedes Live-Release.

---