# TestShop - Dein Test- & Automatisierungs-Spielplatz 🚀

Willkommen im **TestShop**! Dies ist eine moderne E-Commerce Webanwendung (gebaut mit Next.js), an der du Testautomatisierung und das Bauen von Pipelines (CI/CD) üben wirst.

---

## 🏗️ Architektur & Schulungskonzept

Dieses Projekt folgt dem **"Target & Template" Ansatz**. Hier findest du die Applikation, gegen die getestet wird.

1.  **Diese App (Target):** Der Quellcode des Webshops.
2.  **Test-Vorlagen (Templates):** Professionelle E2E-Testprojekte in separaten Repositories.

### Verfügbare Test-Templates:
*   🎭 **[Playwright Showcase Template](https://github.com/bqnow/testshop-playwright-template)**: Unsere Referenz-Implementierung für Playwright (POM, Allure, Docker).

---

## 🚀 Schnellstart

### 1. Webshop lokal starten
```bash
npm install
npm run dev
```
👉 [http://localhost:3000](http://localhost:3000)

### 2. Gesamtsystem via Docker
```bash
docker compose up --build
```

---

## 📚 Dokumentation für Tester

Möchtest du lernen, wie man diese App professionell automatisiert? Besuche unser dediziertes Test-Repository:
� **[Playwright Test Suite & Dokumentation](https://github.com/bqnow/testshop-playwright-template)**

Dort findest du Guides zu:
*   Page Object Model (POM)
*   Reporting mit Allure
*   Docker & CI/CD Integration

---

## 🎯 Deine Aufgabe als Test Consultant

Stelle dir vor, du bist Teil eines Agile-Teams. Deine Mission ist es, den Bestellprozess zu automatisieren. Nutze die oben verlinkten Templates als Basis für deine eigene Test-Suite.

*Hintergrundwissen zur QA findest du im [QA Handbuch](./QA_HANDBOOK.md).*

---

## 🛠️ Voraussetzungen
1.  **Node.js (LTS)**
2.  **Git**
3.  **Docker Desktop**
