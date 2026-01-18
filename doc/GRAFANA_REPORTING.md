# Grafana Reporting Guide

This guide explains how the centralized test reporting to Grafana Loki works, how to use the dashboard, and how to integrate the reporter into new test projects.

## 1. Architecture

We use **Grafana Loki** as a lightweight log-based storage for test results. Instead of a complex database, test runners send JSON-formatted logs to Loki. Grafana then parses these logs to build dashboards.

### Data Model

Each test run sends two types of log streams:

1.  **Test Results** (`kind="test_result"`):
    *   One log entry per test case.
    *   Contains status (`passed`, `failed`, `skipped`), duration, browser, and error details.
    *   Used for: Tables, detailed graphs, failure analysis.

2.  **Run Summary** (`kind="test_summary"`):
    *   One log entry per test run (suite execution).
    *   Contains aggregated counts (`total`, `passed`, `failed`, `skipped`) and total duration.
    *   Used for: Top-level stats (Stat panels), history tracking.

### Labels & Fields

Common labels used for filtering in the dashboard:
*   `app`: The project name (e.g., `testshop-ts`, `testshop-java`).
*   `environment`: The environment tested (e.g., `staging`, `local`).

## 2. Dashboard Setup

The dashboard is defined in `grafana-dashboard.json`.

**Features:**
*   **Dynamic Filtering:** Filter by Project (`app`) and Environment.
*   **Time Range:** Supports standard Grafana time pickers (e.g., "Last 6 hours").
*   **Panels:**
    *   **Overview:** Aggregated stats for Passed/Failed tests across selected projects.
    *   **Per-Project Breakdown:** Bar gauge showing pass counts per project.
    *   **Failure Timeline:** Time-series graph showing when failures occurred.

**Importing:**
1.  Go to Grafana > Dashboards > New > Import.
2.  Upload `grafana-dashboard.json` or paste its JSON content.
3.  Select your Loki datasource if prompted (UID: `grafanacloud-bqnow-logs`).

## 3. Integration Guide

### Requirements
All projects must have the following environment variables set to report data:

```bash
GRAFANA_LOKI_URL="https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push"
GRAFANA_LOKI_USER="<your-user-id>"
GRAFANA_LOKI_KEY="<your-api-key>"
GRAFANA_APP_NAME="preferred-project-name" (Optional, defaults to 'testshop-ts'/'testshop-java')
TEST_ENV="staging" (Optional, defaults to 'local')
```

### TypeScript (Playwright)

Use the provided `GrafanaReporter.ts`.

1.  **File:** `e2e/reporters/GrafanaReporter.ts`
2.  **Config:** Register it in `playwright.config.ts`:

```typescript
import GrafanaReporter from './e2e/reporters/GrafanaReporter';

export default defineConfig({
  reporter: [
    ['list'],
    ['./e2e/reporters/GrafanaReporter'] // Add this line
  ],
  // ...
});
```

### Java (Playwright/TestNG)

Use the provided `GrafanaReporter.java`.

1.  **File:** `src/test/java/com/bqnow/testshop/reporting/GrafanaReporter.java`
2.  **Dependencies:** Ensure you have usage of `HttpClient` (Java 11+) and `Gson`.
3.  **Config:** Register it in `testng.xml`:

```xml
<suite name="Playwright Suite">
    <listeners>
        <listener class-name="com.bqnow.testshop.reporting.GrafanaReporter" />
    </listeners>
    <!-- ... -->
</suite>
```

## 4. Troubleshooting

*   **No Data in Dashboard?**
    *   Check if `GRAFANA_LOKI_URL` is correct.
    *   Verify the `app` label matches what you selected in the dashboard variable.
    *   Ensure the time picker covers the time you ran the tests.
*   **"Loki: Entry out of order"?**
    *   The reporters are designed to batch-send logs with a *single timestamp* for the whole run to prevent this. Do not try to send real-time logs during the test run unless you handle nanosecond precision strictly.
