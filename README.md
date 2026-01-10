# TestShop - E-Commerce Target Application 🚀

Diese Next.js Applikation dient als moderne E-Commerce Plattform für Schulungszwecke in der Testautomatisierung und CI/CD-Orchestrierung.

---

## 🏗️ Architektur & Schulungskonzept

Das Projekt folgt strikt dem **"Target & Template" Ansatz**. Die Applikation (Target) und das Test-Framework (Template) sind technologisch vollständig entkoppelt.

### Ressourcen für Test-Consultants
Die E2E-Automatisierung wird in dedizierten Repositories verwaltet. Für den Einstieg und die technische Dokumentation ist das entsprechende Template zu verwenden:

👉 **[Playwright Framework Template](https://github.com/bqnow/testshop-playwright-template)**

---

## 🎯 Schulungsprojekt: Test-Szenarien

Ziel der Schulung ist die vollständige Automatisierung des Bestellprozesses unter Einhaltung professioneller Standards (POM, Data-Driven).

### Szenario 1: Happy Path (Standard-Bestellung)
1.  **Login:** Erfolgreiche Anmeldung mit dem User `consultant` und Passwort `pwd`.
2.  **Produktsuche:** Suche nach einem Produkt (z.B. "Watch") inklusive Filterung nach Kategorien.
3.  **Warenkorb:** Hinzufügen des Produkts zum Warenkorb.
4.  **Validierung:** Erhöhung der Anzahl auf 2 und Verifizierung der korrekten Preisaktualisierung.
5.  **Checkout:** Eingabe der Versanddaten und erfolgreicher Abschluss der Bestellung.

### Szenario 2: Edge Case (Fehlerbehandlung)
1.  **Produkt-ID 999:** Hinzufügen des Produkts mit der ID `999` zum Warenkorb.
2.  **Fehlerprüfung:** Beim Versuch der Bestellung muss eine entsprechende Fehlermeldung (Server Error) angezeigt werden.
3.  **Stabilität:** Verifizierung, dass der Fehler korrekt abgefangen wird, ohne dass die Applikation instabil wird.

---

## 🚀 Lokale Ausführung

### 1. Developer Setup
```bash
npm install
npm run dev
```
Local Endpoint: [http://localhost:3000](http://localhost:3000)

### 2. Docker Orchestrierung
Die Applikation kann isoliert via Docker Compose gestartet werden:
```bash
docker compose up --build
```

---

## 📚 Begleitdokumentation

*   🎓 **[QA Handbuch (QA_HANDBOOK.md)](./QA_HANDBOOK.md)**: Theoretische Grundlagen (Testpyramide, Shift Left).
*   🐳 **[Docker Guide (DOCKER.md)](./DOCKER.md)**: Einsatz von Containern in der Testautomatisierung.

---

## 🛠️ Systemanforderungen
*   **Node.js (LTS)**
*   **Git**
*   **Docker Desktop** (optional für Container-Tests)
