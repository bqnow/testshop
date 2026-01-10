# Docker & Containerisierung: Application Deployment

Diese Dokumentation beschreibt den Einsatz von Docker zur Kapselung und Bereitstellung der **TestShop** Applikation.

---

## 1. Einsatzgebiet
In diesem Repository dient Docker primär dazu, die Applikation in einer produktionsnahen Umgebung (`Linux/Alpine`) zu betreiben. Dies stellt sicher, dass die Applikation für externe Test-Frameworks (wie Playwright oder Selenium) unter immer gleichen Bedingungen erreichbar ist.

---

## 2. Lokale Ausführung der Applikation

Um die Applikation isoliert in einem Container zu starten, ist folgender Befehl zu verwenden:

```bash
docker compose up --build
```

**Ergebnis:**
*   Die Applikation wird kompiliert und gestartet.
*   Der Webshop ist unter `http://localhost:3000` erreichbar.
*   Änderungen am Quellcode erfordern einen Neustart mit `--build`, um das Image zu aktualisieren.

---

## 3. Architektur: Multi-Stage Build

Die Applikation nutzt ein **Multi-Stage Dockerfile**, um die Sicherheit zu erhöhen und die Image-Größe zu minimieren:

1.  **Stage 1 (Builder):** Installation der Entwicklungs-Abhängigkeiten und Kompilierung des Next.js Quellcodes.
2.  **Stage 2 (Runner):** Kopieren ausschließlich der produktionsrelevanten Artefakte (`.next`, `public`, `node_modules`) in ein minimales Basis-Image.

Dieses optimierte Image wird automatisch über die GitHub CI/CD Pipeline gebaut und in die GitHub Container Registry (GHCR) übertragen.

---

## 4. Testing gegen den Container

Wenn externe Test-Suiten (aus dem Template-Repository) gegen diesen Container laufen, ist sicherzustellen, dass die `BASE_URL` auf die entsprechende Docker-IP oder `localhost:3000` zeigt.

Details zum **Test-Workflow** (Reporting, Traces, Test-Ausführung) finden sich ausschließlich im:
👉 **[Playwright Framework Template Repository](https://github.com/bqnow/testshop-playwright-template)**
