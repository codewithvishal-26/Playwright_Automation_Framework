# Playwright CLI Automation Demo

This module preserves the Playwright CLI skill documentation and a browser test for cancelling an existing EventHub booking.

## What is included

- Claude Code skill instructions under the repository-level `.claude/skills/playwright-cli/`
- Playwright CLI command references for navigation, snapshots, locators, sessions, storage, tracing, video, network mocking, and WebMCP
- A Playwright Test example that cancels a confirmed booking and verifies that it disappears from the booking list

## Important distinction

The booking spec is executed by the Playwright Test runner (`npx playwright test`). The `.claude` skill teaches an AI coding assistant how to operate the separate `playwright-cli` command. The spec itself does not invoke the CLI package.

## Setup

```bash
npm ci
npx playwright install
```

Set `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` in the shell. The account must already have at least one confirmed booking. Cancellation is destructive, so use a dedicated test account and booking.

```powershell
$env:TEST_USER_EMAIL = "your-test-account@example.com"
$env:TEST_USER_PASSWORD = "your-password"
npm test
```

## Use the CLI skill

From the repository root, open a compatible Claude Code environment and invoke the `playwright-cli` skill. Review the skill instructions before allowing the assistant to interact with a live account.
