# TestShop - Dein Test- & Automatisierungs-Spielplatz 🚀

Willkommen im **TestShop**! Dies ist eine moderne E-Commerce Webanwendung (gebaut mit Next.js), an der du Testautomatisierung und das Bauen von Pipelines (CI/CD) üben wirst.

Du wirst hier Schritt für Schritt durch das Setup geführt.

---

## 🛠️ Schritt 1: Vorbereitung (Installation der Tools)

Bevor wir starten können, braucht dein Computer ein paar Werkzeuge.

### 1. IDE (Dein Arbeitsplatz)
Wir empfehlen **Google Antigravity** (oder VS Code) als Entwicklungsumgebung. Dies ist das Programm, in dem du den Code siehst und Befehle ausführst.
*   Lade dir **Google Antigravity** herunter.
*   Alternativ kannst du [VS Code](https://code.visualstudio.com/) nutzen.

### 2. GitHub Account
Du benötigst einen Account bei [GitHub.com](https://github.com/), um den Code herunterzuladen und später deine Lösungen hochzuladen.

### 3. Node.js & NPM (Die "Maschine" der App)
Diese App ist in **TypeScript (Next.js)** geschrieben und benötigt **Node.js**, um ausgeführt zu werden.
*   **Mac Benutzer:**
    Der einfachste Weg ist der Installer von der Website:
    1.  Gehe auf [nodejs.org](https://nodejs.org/).
    2.  Lade die **LTS Version** herunter (z.B. v20.x).
    3.  Führe den Installer aus.
    *   *Profi-Tipp für Mac:* Wenn du `Homebrew` kennst: `brew install node`.
*   **Windows Benutzer:**
    1.  Gehe auf [nodejs.org](https://nodejs.org/), lade die **LTS Version** und installiere sie.

### 4. Git (Das "Speicher"-System)
Damit lädst du den Code herunter und speicherst deine Änderungen.
*   **Mac:** Öffne das Terminal und tippe `git --version`. Wenn nichts kommt, fragt dich der Mac meistens, ob er es installieren soll.
*   **Windows:** Lade [Git for Windows](https://git-scm.com/download/win) herunter und installiere es.

---

## 🚀 Schritt 2: Projekt Einrichten

Öffne **Google Antigravity** (oder deine IDE) und dort das **Terminal**.
Führe nacheinander aus:

1.  **Code herunterladen (Klonen):**
    *(Ersetze `<URL>` mit dem GitHub-Link deines Trainers)*
    ```bash
    git clone <HIER_DIE_GITHUB_URL_EINFÜGEN>
    ```

2.  **In den Ordner gehen & Installieren:**
    ```bash
    cd bqnow-testshop
    npm install
    ```

3.  **App Starten:**
    ```bash
    npm run dev
    ```
    Wenn "Ready" steht, gehe im Browser auf: 👉 [http://localhost:3000](http://localhost:3000)

---

## 🌿 Schritt 3: Dein Arbeitsbereich (WICHTIG!)

Wir arbeiten **nicht** direkt auf dem Haupt-Pfad ("main"), sondern jeder erstellt seinen eigenen Arbeitszweig ("Branch").

1.  **Neuen Branch erstellen:**
    Gib deinem Branch einen eindeutigen Namen (z.B. deinen Namen).
    ```bash
    git checkout -b feature/mein-name-tests
    ```

2.  **Änderungen Speichern & Hochladen:**
    Wenn du Tests geschrieben hast und diese sichern möchtest, nutze diese drei Befehle:

    ```bash
    # 1. Alle Änderungen vormerken
    git add .

    # 2. Speichern mit einer Nachricht
    git commit -m "Meine ersten Tests hinzugefügt"

    # 3. Hochladen zu GitHub
    git push origin feature/mein-name-tests
    ```

---

---

## 📚 Hintergrundwissen (QA Masterclass)

Möchtest du verstehen, **warum** wir das so machen? Wie passt diese Aufgabe in die moderne "Agile" Welt? Was ist die Testpyramide und was bedeutet "Shift Left"?
👉 **Lies dazu unbedingt das [QA Handbuch (QA_HANDBOOK.md)](./QA_HANDBOOK.md).**

---

## 🎯 Deine Aufgabe: Test Consultant

Stelle dir vor, der Product Owner kommt zu dir mit folgendem Anliegen:
>"Wir müssen sicherstellen, dass unsere Kunden reibungslos einkaufen können. Bitte automatisiere den kompletten Bestellprozess, damit wir nicht vor jedem Release manuell testen müssen."

Deine Aufgabe ist es, eine **robuste und wartbare** Testlösung (E2E) zu implementieren.

### Fachliche Anforderungen (Test Cases)

**Szenario 1: Der glückliche Kunde (Happy Path)**
Simuliere folgenden Ablauf:
1.  Ein Nutzer loggt sich erfolgreich ein.
2.  Er sucht nach einem Produkt (z.B "Watch") und filtert nach einer Kategorie.
3.  Er legt das Produkt in den Warenkorb.
4.  Im Warenkorb erhöht er die Anzahl auf 2 und prüft, ob sich der Gesamtpreis korrekt aktualisiert.
5.  Er geht zur Kasse, gibt Versanddaten ein und schließt die Bestellung erfolgreich ab.

**Szenario 2: Fehlerbehandlung (Edge Case)**
1.  Ein Nutzer legt das Produkt mit der ID `999` in den Warenkorb.
2.  Beim Versuch zu bestellen, soll die Anwendung einen Fehler anzeigen (Server Error).
3.  Verifiziere, dass dieser Fehler korrekt abgefangen/angezeigt wird und die App nicht abstürzt.

### Technische Hinweise & Testdaten

Nutze diese Daten für deine Skripte:
*   **Login**: User `consultant`, Passwort `pwd`
*   **Voucher Codes**: `SAVE10` (10% Rabatt), `TEST20` (20% Rabatt).
*   **Selektoren**: Die App wurde test-freundlich gebaut. Die meisten interaktiven Elemente besitzen ein stabiles `data-testid` Attribut (z.B. `data-testid="login-btn"` oder `data-testid="product-card-1"`). Nutze diese bevorzugt!

### Definition of Done (Qualitätsziele)

Damit deine Arbeit als "Professionelles Engineering" gilt, beachte diese Punkte:

1.  **Automatisierung (Code Quality) 🏗️**:
    *   **Design Pattern**: Nutze das **Page Object Model (POM)** oder ein vergleichbares Pattern. Trenne die Testlogik ("Was will ich testen?") von der technischen Implementierung ("Welchen Button klicke ich?").
    *   **Testdaten-Management**: Baue deine Tests so, dass sie **parameterisierbar** sind (Data-Driven Testing). Der gleiche Testablauf sollte mit verschiedenen Daten (Produkte, User, Gutscheine) laufen können, ohne Code zu duplizieren.
    *   **Umgebungs-Unabhängigkeit**: Schreibe keine festen URLs (wie `localhost:3000`) hard in deinen Test-Code. Nutze Konfigurationsdateien oder Variablen (Base URL), damit deine Tests später per Knopfdruck auch gegen eine Staging- oder Live-Umgebung laufen könnten.

2.  **Pipeline (CI/CD) & Reporting 📊**:
    *   Erstelle eine GitHub Actions Pipeline (`.github/workflows/pipeline.yml`), die bei jedem `git push` läuft.
    *   **Reporting**: Ein fehlgeschlagener Test in der Cloud bringt nichts, wenn man nicht sieht *warum* er fehlgeschlug. Konfiguriere die Pipeline so, dass bei Fehlern **Screenshots, Videos oder Traces** gespeichert werden (als GitHub Artifacts), damit du sie debuggen kannst.

Viel Erfolg! 💻✨
