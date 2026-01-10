# Docker & Containerisierung: Lokale CI-Simulation

## Einleitung
Dieses Projekt nutzt Docker, um eine **identische Testumgebung** für alle Beteiligten zu schaffen. Es eliminiert das Problem "Bei mir funktioniert es" (Works on my machine), indem es die exakte Linux-Umgebung simuliert, in der auch unsere CI/CD-Pipelines laufen.

---

## 1. Quick Start (Schnellstart)

Wenn du Docker Desktop installiert hast, reicht ein einziger Befehl, um die gesamte Suite in einer isolierten Umgebung zu testen:

```bash
docker compose up --build
```
*Dieser Befehl baut das Image neu (falls nötig), startet die Web-Applikation und führt alle E2E-Tests in Chromium und Firefox aus.*

---

## 2. Workflow: Vom Test zum Ergebnis

Da der Docker-Container auf Geschwindigkeit und Portabilität optimiert ist, erzeugt er lediglich die **Rohdaten**. Das Anschauen der Berichte erfolgt im Anschluss bequem auf deinem Host-Rechner (Mac/Windows).

### Die ideale Reihenfolge:

1.  **Tests starten:**
    ```bash
    docker compose up --build
    ```
2.  **Berichte generieren (lokal):**
    Nach Abschluss des Containers liegen die Ergebnisse in `tests/reporting/`. Wandle diese nun in eine visuelle Darstellung um:
    ```bash
    npm run report:generate
    ```
3.  **Analyse:**
    Öffne das Dashboard, um die Ergebnisse im Detail zu prüfen:
    ```bash
    npm run report:open
    ```

---

## 3. Die Architektur: Warum Docker?

### Konsistenz ist der Schlüssel
Ein Test, der lokal auf macOS grün ist, kann in der Pipeline (Linux) fehlschlagen (z.B. wegen unterschiedlichem Font-Rendering oder Browser-Builds). Docker garantiert:
*   **Identisches OS:** Ubuntu Linux im Container entspricht dem OS der GitHub Actions.
*   **Isolierung:** Die Web-App und die Tests laufen im selben "Mini-Computer" (Container).
*   **Schlanke Ausführung:** Der Container konzentriert sich auf die reine Berechnung (`npm run test:e2e`). Schwerfällige Prozesse wie das Generieren von Allure-Reports oder Archivierung werden an den Host (deinen Rechner) oder die CI-Infrastruktur (Jenkins/GitHub) delegiert.

---

## 4. Technische Details (Hintergründe)

### Das Konzept: Ein vorkonfigurierter Test-PC
Um zu verstehen, was hier passiert, hilft die Vorstellung eines **virtuellen Laptops**:

1.  **Das Dockerfile (Das Kochrezept):** 
    Stell dir vor, du schreibst eine Liste: "Kauf einen leeren Laptop, installiere Linux, installiere Node.js, lade die Playwright-Browser herunter und kopiere meinen Programmcode auf den Schreibtisch." Das Dockerfile ist genau diese Schritt-für-Schritt-Anleitung.
    
2.  **Das Image (Der fertige Laptop im Karton):** 
    Wenn man das "Rezept" ausführt (Build-Prozess), entsteht ein **Image**. Das ist wie der fertig konfigurierte Laptop, der originalverpackt im Regal steht. Er ist bereit, aber er arbeitet noch nicht.
    
3.  **Der Container (Der eingeschaltete Laptop):** 
    Wenn du `docker compose up` tippst, "packst du den Laptop aus und schaltest ihn ein". Jetzt wird der Code ausgeführt, die Browser starten und die Tests laufen.

**Der Vorteil:** Jeder in deinem Team packt exakt denselben "Laptop" aus. Es gibt keine Unterschiede bei den Versionen oder Einstellungen.

### Die Dateien im Detail
Regelt, wie der Container mit deinem Rechner interagiert:
*   **Volumes:** Spiegelt den Ordner `tests/reporting/` vom Container auf deine Festplatte. So gehen Ergebnisse nicht verloren, wenn der Container gestoppt wird.
*   **Environment:** Setzt Parameter wie `CI=true` und `SKIP_WEBKIT=true`.

### WebKit (Safari) Limitation
Unter Linux-Containern ist WebKit (Safari) oft instabil. Um Fehlalarme zu vermeiden, überspringen wir WebKit in Docker.
*   **Lokal (Mac):** Alle 3 Browser (Chrome, Firefox, Safari)
*   **Docker:** 2 Browser (Chrome, Firefox)
*   **GitHub Actions:** Alle 3 Browser (da die CI-Runner optimiert sind)

---

## 5. Troubleshooting (Problemlösung)

Falls der Build-Prozess hängen bleibt oder alte Teststände anzeigt:

**Cache leeren:**
```bash
docker builder prune -f
docker compose build --no-cache
```

**Container manuell stoppen:**
```bash
docker compose down
```
