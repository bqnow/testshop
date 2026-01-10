# TestShop - E-Commerce Target Application 🚀

Diese Next.js Applikation dient als moderne E-Commerce Plattform für Schulungszwecke in der Testautomatisierung und CI/CD-Orchestrierung.

---

## 🏗️ Architektur & Schulungskonzept

Das Projekt folgt strikt dem **"Target & Template" Ansatz**. Die Applikation (Target) und das Test-Framework (Template) sind technologisch vollständig entkoppelt.

### Ressourcen für Test-Consultants
Die E2E-Automatisierung wird in dedizierten Repositories verwaltet. Für den Einstieg und die technische Dokumentation nutzen Sie bitte das entsprechende Template:

👉 **[Playwright Framework Template](https://github.com/bqnow/testshop-playwright-template)**

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
