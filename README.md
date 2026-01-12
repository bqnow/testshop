# TestShop - E-Commerce Target Application 🚀

Diese Next.js Applikation dient als moderne E-Commerce Plattform für Schulungszwecke in der Testautomatisierung und CI/CD-Orchestrierung.


> 🌍 **Live Demo:** [https://testshop-dusky.vercel.app/](https://testshop-dusky.vercel.app/)
---

## 🏗️ Architektur & Schulungskonzept

Das Projekt folgt strikt dem **"Target & Template" Ansatz**. Die Applikation (Target) und das Test-Framework (Template) sind technologisch vollständig entkoppelt.

---

## 🎯 Schulungsprojekt: Test-Szenarien

Ziel ist die vollständige Automatisierung des Bestellprozesses unter Einhaltung professioneller Standards (POM, Data-Driven).

### Szenario 1: Happy Path (Standard-Bestellung)
1.  **Login:** Erfolgreiche Anmeldung mit dem User `consultant` und Passwort `pwd`.
2.  **Produktsuche:** Suche nach einem beliebigen Produkt (z.B. "Watch") und Filterung nach einer Kategorie.
3.  **Warenkorb:** Hinzufügen des Produkts zum Warenkorb.
4.  **Validierung:** Erhöhung der Anzahl auf `2` im Warenkorb und Verifizierung, dass sich der Gesamtpreis korrekt verdoppelt hat.
5.  **Checkout:** Eingabe valider Versanddaten und erfolgreicher Abschluss der Bestellung (Bestätigungsseite).

### Szenario 2: Edge Case (Fehlerbehandlung)
1.  **Produkt-ID 999:** Direkter Aufruf oder Hinzufügen des Produkts mit der ID `999` (simuliert einen fehlerhaften Artikel).
2.  **Fehlerprüfung:** Die Applikation muss eine Fehlermeldung anzeigen (z.B. "Internal Server Error" oder "Produkt nicht verfügbar").
3.  **Stabilität:** Verifizierung, dass die Applikation nicht abstürzt (White Screen of Death) und der User zurück zur Startseite navigieren kann.

---

## ☁️ Deployment & Hosting

Die Anwendung wird automatisch über **Vercel** gehostet und deployed.

*   **URL:** [https://testshop-dusky.vercel.app/](https://testshop-dusky.vercel.app/)
*   **Workflow:** Jeder Push auf den `main` Branch in diesem Repository löst ein neues Deployment auf Vercel aus.
*   **Technologie:** Next.js Edge Network. Dies stellt sicher, dass die Anwendung für Tests hochverfügbar und performant ist, ohne dass lokale Server gestartet werden müssen (siehe "Pfad 2").


### Ressourcen für Test-Consultants
Die E2E-Automatisierung wird in dedizierten Repositories verwaltet. Templates mit verschiedenen Test-Frameworks sind verfügbar:

👉 **[Playwright Framework Template](https://github.com/bqnow/testshop-playwright-template)**


---

## 🚀 Wahl des richtigen Setups (Guide)

Für einen reibungslosen Start ist die Wahl der passenden Bereitstellungsmethode entscheidend. Je nach Zielsetzung ist einer der folgenden Pfade zu wählen:

### Pfad 1: Lokale Test-Entwicklung (Empfohlen)
Dieser Weg ist für Consultants vorgesehen, die **neue Tests für dieses Repository** entwickeln oder validieren wollen. Er garantiert die Ausführung gegen den aktuellsten lokalen Code-Stand, ohne eine manuelle Node.js Installation zu erfordern.

*   **Voraussetzung:** Docker Desktop
*   **Befehl:** `docker compose up --build`
*   **Vorteil:** Bit-identische Umgebung zur CI-Pipeline; kein lokaler Node.js Overhead.
👉 Erreichbar unter: `http://localhost:3000`

---

### Pfad 2: Eigene Test-Projekte (Ziel-Architektur)
Dieser Pfad repräsentiert das **Ziel-Szenario der Schulung**. Hierbei wird ein vollständig separates Test-Repository erstellt, das den Quellcode des Webshops nicht enthält. Die Anwendung wird stattdessen als fertiges Modul bezogen.

*   **Quelle:** GitHub Container Registry (GHCR)
*   **Image:** `ghcr.io/bqnow/testshop:latest`
*   **Einsatz:** Einbindung in die `docker-compose.yml` des eigenen Test-Projekts:
```yaml
services:
  testshop-app:
    image: ghcr.io/bqnow/testshop:latest
    ports:
      - "3000:3000"
```

---

### Pfad 3: Aktive Frontend-Entwicklung
Nur für Nutzer vorgesehen, die **direkte Änderungen am Quellcode** des Webshops vornehmen und sofortiges Feedback (Hot Reload) benötigen.

1.  `npm install`
2.  `npm run dev`
👉 Erreichbar unter: `http://localhost:3000`

---

## 📚 Begleitdokumentation

*   🎓 **[QA Handbuch (QA_HANDBOOK.md)](./QA_HANDBOOK.md)**: Theoretische Grundlagen (Testpyramide, Shift Left).
*   🐳 **[Docker Guide (DOCKER.md)](./DOCKER.md)**: Einsatz von Containern in der Testautomatisierung.

---

## 🛠️ Systemanforderungen
*   **Node.js (LTS)**
*   **Git**
*   **Docker Desktop** (optional für Container-Tests)
