# Docker & Containerisierung

Dieses Projekt enthält eine Docker-Konfiguration (`Dockerfile` & `docker-compose.yml`), um Tests in einer isolierten Umgebung auszuführen.

## 1. Was ist Docker?

Docker ist eine Technologie, um Anwendungen und ihre gesamte Umgebung in "Container" zu verpacken.

### Der Vergleich: Ein Laptop im Laptop
Stell dir vor, du könntest einen brandneuen, sauber installierten Computer (Linux) einfach als Datei verschicken.
*   **Ohne Docker:** Jeder Entwickler muss Node.js, Browser und Abhängigkeiten selbst auf seinem Gerät installieren. Versionen unterscheiden sich, Konfigurationen weichen ab ("Works on my machine").
*   **Mit Docker:** Wir definieren **einmal** den perfekten Zustand in einem "Image". Egal wer dieses Image startet, er bekommt exakt dieselbe Umgebung – bit für bit identisch. Es ist wie eine leichte virtuelle Maschine, die in Sekunden startet.

## 2. Warum nutzen wir es für Tests?

Tests sind empfindlich gegenüber Umgebungsunterschieden.
Ein Test, der auf macOS erfolgreich ist, kann unter Linux (CI-Server) fehlschlagen, weil:
*   Schriftarten (Fonts) pixelweise anders gerendert werden (Screen Comparison Tests schlagen fehl).
*   Browser-Versionen minimal abweichen.
*   Betriebssystem-spezifische Pfade oder Befehle anders sind.

**Docker garantiert Konsistenz:**
Wenn du die Tests via Docker ausführst, laufen sie in einem **Ubuntu Linux Container**. Das ist exakt das gleiche Betriebssystem, das auch GitHub Actions (CI) verwendet. Du kannst also lokale Probleme ausschließen und die echte CI-Umgebung simulieren.

### Der Unterschied im Bild
![Workflow-Vergleich: Manuell vs. Docker](tests/docker_workflow_comparison.png)

## 3. Wie nutzen wir es?

Voraussetzung: Du hast [Docker Desktop](https://www.docker.com/products/docker-desktop/) installiert.

### Tests starten
Führe diesen Befehl im Terminal aus:

```bash
docker-compose up --build
```

**Was passiert im Hintergrund?**
1.  Docker baut den Container basierend auf dem `Dockerfile` (installiert Linux, Playwright, Browser).
2.  Es kopiert unseren Source-Code in den Container.
3.  Es baut die App (`npm run build`) und führt die Tests aus.

## 4. Die Architektur: "All-in-One"
In diesem Setup befinden sich **Webshop UND Tests im selben Container**.
*   Der Container startet den Webshop intern (`localhost`).
*   Die Tests greifen direkt darauf zu.

**Warum so?**
Dies spiegelt exakt wider, wie automatisierte Pipelines (GitHub Actions) arbeiten: Ein Server lädt den Code, baut die App und testet sie in einem Rutsch. Es ist die einfachste und robusteste Methode für E2E-Tests.

### Ergebnisse ansehen
Damit du die Reports nicht im Container "verlierst", nutzen wir **Volume Mapping**.
Wir haben den Container so konfiguriert, dass er den Report-Ordner direkt auf deine Festplatte spiegelt.

Nach dem Test findest du den Report ganz normal hier:
📂 `tests/playwright-report/index.html`

## 5. Technische Details

### Dockerfile vs. docker-compose.yml – Wozu zwei Dateien?

**`Dockerfile`** (Das Rezept):
Definiert, **wie** der Container aufgebaut wird:
*   Welches Basis-Image (Ubuntu mit Playwright)?
*   Welche Befehle (`npm ci`, `npm run build`)?
*   Was ist der Standard-Befehl beim Start (`CMD`)?

**Nutzen:** Wiederverwendbar. Du kannst das Image einmal bauen und überall deployen (CI, Kollegen, Cloud). Es ist die "Blaupause".

**`docker-compose.yml`** (Die Orchestrierung):
Definiert, **wie** der Container ausgeführt wird:
*   Welche Environment-Variablen (`CI=true`)?
*   Welche Ordner werden gemapped (damit Reports rauskommen)?
*   Welche Ressourcen (RAM, Netzwerk)?

**Nutzen:** Vereinfacht die Bedienung. Ohne Compose müsstest du einen 10-zeiligen `docker run`-Befehl tippen. Mit Compose reicht `docker compose up`.

**Analogie:** Das Dockerfile ist das Kochrezept. Docker Compose ist die Anweisung, wie man den Tisch deckt und serviert.

### WebKit in Docker (Limitation)

WebKit (Safari) ist in Linux-Containern instabil.
Deshalb überspringen wir WebKit automatisch in Docker (`SKIP_WEBKIT=true`).

**Tests laufen trotzdem in:**
*   **Chromium** ✅ (Docker)
*   **Firefox** ✅ (Docker)
*   **WebKit** ✅ (GitHub Actions CI)

Damit ist die Browser-Abdeckung vollständig, ohne dass Docker crasht.
