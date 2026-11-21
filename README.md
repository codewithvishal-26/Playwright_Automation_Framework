# QA_Playwright

Hands-on Playwright automation (JavaScript + TypeScript) built while learning, covering UI, API, network mocking, fixtures, data-driven testing, BDD, reporting and CI/CD.

## Repository layout

| Folder | What it is |
|---|---|
| `/` (root), `tests/`, `features/` | Main framework: Playwright + Cucumber, Page Objects, API, mocking, CI |
| `typescript-version/` | TypeScript version of the page-object tests |
| `ai-agents/` | Playwright AI agents (planner / generator / healer) sample on GreenKart, with `.github/agents` and `.vscode/mcp.json` |
| `cli-demo/` | Playwright CLI skill + booking-cancellation test (`.claude/skills/playwright-cli`); needs `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`, manual workflow |

Each sub-folder has its own `package.json`; run `npm ci` inside it first.

## What is inside (main framework)

| Area | Where | Highlights |
|---|---|---|
| Page Object Model | `tests/utils/` (JS), `typescript-version/` (TS) | Login, Dashboard, Cart, Checkout pages |
| E-commerce flows | `tests/Clientapp*.spec.js`, `addToCart`, `clientLogin*` | Login, add to cart, checkout |
| API + UI hybrid | `webApiTest`, `mockOrderResponse`, `getProductIds` | Token via API, `addInitScript`, `route.fulfill` mocking |
| Network interception | `NetworkTest.spec.js` | Request / response interception |
| EventHub assignments | `eventhub`, `refundEligibility`, `sandboxBanner`, `Crossuserbookingaccess` | UI + API, cross-user access (security) |
| Fixtures | `utils/Eventhubfixture.js`, `utils/fixtures.js` | Custom `test.extend` fixtures |
| Data-driven | `Exceluploaddownload.spec.js`, `utils/Excelutils.js` | exceljs read/write |
| Race condition demo | `Raceconditiondemo.spec.js` (`@race`) | Shared state, run with `--workers=1` |
| BDD (Cucumber) | `features/` | Hooks, step definitions, Scenario Outline, tags |
| Reporting | Playwright HTML + Allure | `npm run report`, `npm run allure:report` |
| CI/CD | `.github/workflows/` | GitHub runner, 4-way sharding + merged report, Azure Playwright Workspaces |

## Setup

```bash
npm ci
npx playwright install chromium
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
# open .env and fill in your own test accounts
```

`.env` is git-ignored. Never commit credentials. In CI the same values come from GitHub **Secrets**.

## Run

```bash
npm test                  # all projects (chromium, firefox, Mobile Chrome)
npm run test:chromium     # one browser
npm run test:headed       # watch the browser
npm run test:race         # @race tests, 1 worker
npm run test:ts           # TypeScript version
npm run cucumber:regression
npm run cucumber:validation
npm run report            # Playwright HTML report
npm run allure:report     # Allure report
```

## GitHub Secrets used by the workflows

`CLIENT_EMAIL`, `CLIENT_PASSWORD`, `EVENTHUB_EMAIL`, `EVENTHUB_PASSWORD`, `YAHOO_EMAIL`, `YAHOO_PASSWORD`, `GMAIL_EMAIL`, `GMAIL_PASSWORD`
(Azure workflow additionally: `PLAYWRIGHT_SERVICE_URL`, `AZURE_CREDENTIALS`.)

## Workflows

- `playwright-ci.yml` runs on every push / PR (Chromium on a GitHub runner).
- `playwright-shard.yml` manual run, 4 parallel shards, merged HTML report.
- `ai-agents-playwright.yml` runs only when `ai-agents/**` changes.
- `cli-demo-playwright.yml` manual run; needs secrets `EVENTHUB_TEST_USER_EMAIL` and `EVENTHUB_TEST_USER_PASSWORD`.
- `playwright-azure.yml` manual run on Azure Playwright Workspaces (needs an active Azure subscription/trial).

## Notes

- Tests run against public practice sites (rahulshettyacademy.com), so occasional failures can come from the site, not the code.
- `slowMo` is 1000 ms locally and 0 in CI.
