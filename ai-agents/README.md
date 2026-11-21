# Playwright AI Test Agents

This module contains three GitHub Copilot custom agents connected to the Playwright Test MCP server.

## Agents

- **Test Planner** — explores an application and writes a structured test plan covering happy paths, edge cases, and validation.
- **Test Generator** — turns a selected test-plan scenario into a Playwright test, exercising the scenario before writing the test.
- **Test Healer** — investigates failures using test output, browser snapshots, console/network evidence, and targeted code changes. It must not silently skip or weaken failing tests.

Agent definitions are stored in the repository-level `.github/agents/` directory so GitHub Copilot can discover them. The Playwright MCP server configuration is in `.vscode/mcp.json`.

## Run the sample tests

```bash
npm ci
npx playwright install
npm test
npm run report
```

The sample tests use the public GreenKart training application. Its availability and content are outside this repository's control.

## Test design

The test plan is in `specs/greenkart-test-plan.md`. The `seed.spec.ts` file is a small baseline check used as a known starting point for agent-assisted test generation.

## Important

These are custom agent instructions and an MCP configuration. Their presence in the repository does not mean an agent has autonomously executed every planned scenario. Use a compatible GitHub Copilot environment, enable the configured MCP server, and review generated/healed code before accepting it.
