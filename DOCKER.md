# Docker & Containerisierung: Application Deployment

Diese Dokumentation erläutert das Konzept und die technische Umsetzung der Containerisierung für die **TestShop** Applikation.

---

## 1. Warum Docker? (Das Konzept)

In der Softwareentwicklung und Qualitätssicherung ist die Konsistenz der Umgebung entscheidend. Docker löst das Problem "Works on my machine", indem es die Anwendung in einen isolierten Container kapselt.

### Die Analogie: Das vorkonfigurierte System
Zur Veranschaulichung dient der Vergleich mit einem physischen System:
*   **Dockerfile (Das Rezept):** Eine Schritt-für-Schritt-Anleitung zur Installation von Betriebssystem, Laufzeitumgebung (Node.js) und Quellcode.
*   **Image (Das versiegelte System):** Das Ergebnis des Build-Prozesses – ein fertiges, unveränderliches Abbild der fertig konfigurierten Anwendung.
*   **Container (Das aktive System):** Die gestartete Instanz des Images. Überall dort, wo Docker läuft, verhält sich dieser Container exakt gleich – egal ob auf macOS, Windows oder Linux (CI-Pipeline).

---

## 2. Einsatzgebiete im Projekt

### Lokal: Schnelle Test-Validierung
Für Consultants, die Tests gegen den aktuellen lokalen Code entwickeln, ermöglicht Docker den Start der Anwendung ohne lokale Installation von Node.js oder Datenbanken.
*   **Befehl:** `docker compose up --build`
*   **Nutzen:** Garantierte Kongruenz zwischen lokalem Test-Target und der späteren CI-Umgebung.

### Global: Artifact Registry (GHCR)
Das fertige Image wird bei jedem Release in der **GitHub Container Registry** hinterlegt. Dies erlaubt externen Projekten, den TestShop als fertigen Service zu beziehen, ohne den Quellcode der Applikation selbst verwalten zu müssen.

---

## 3. Technische Umsetzung: Multi-Stage Build

Um die Effizienz zu maximieren, nutzt dieses Projekt ein **Multi-Stage Dockerfile**. Dies trennt den Build-Prozess strikt von der Laufzeitumgebung:

1.  **Stage 1 (Building):** In einer schweren Umgebung werden Abhängigkeiten installiert und der Quellcode in optimiertes JavaScript übersetzt.
2.  **Stage 2 (Running):** Nur die für den Betrieb notwendigen Dateien (Produktions-Artefakte) werden in ein minimales, abgesichertes Basis-Image (`Alpine Linux`) kopiert.

**Ergebnis:** Ein hochperformantes, kleines und sicheres Image, das optimal für automatisierte Test-Pipelines geeignet ist.

---

## 4. Weiterführende Informationen

Details zur Test-Automatisierung, dem Reporting und der Ausführung von Playwright-Tests finden sich im Framework-Template:
👉 **[Playwright Framework Template Repository](https://github.com/bqnow/testshop-playwright-template)**
