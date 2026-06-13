# Gnomon

Gnomon is a Chrome/Chromium browser extension that predicts AI prompt token usage and helps users write clearer, cheaper, and more controlled prompts before sending them.

## Features

- Real-time prompt token estimation.
- Output token range prediction.
- Prompt quality score.
- Issue detection and actionable suggestions.
- Rule-based prompt optimization.
- Before/after comparison with token savings.
- Copy and apply optimized prompt.
- Local-only analysis by default.
- English UI with Indonesian toggle.

## Tech Stack

- TypeScript
- React
- Vite
- TailwindCSS
- Chrome Extension Manifest V3
- pnpm workspaces
- Turborepo
- Vitest
- Playwright

## Getting Started

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm build
```

Load `apps/extension/dist` as an unpacked extension in Chrome, Edge, or another Chromium browser.

## Development Commands

```bash
pnpm dev
pnpm test
pnpm lint
pnpm build
pnpm zip
```

Run the extension smoke test after building:

```bash
pnpm test:e2e
```

## Architecture

The core prompt engine is browser-independent and lives in `packages/core`. The content script observes ChatGPT prompt input, sends text through the local analyzer, and renders a floating React widget. Settings are stored locally through Chrome storage APIs.

See [Architecture](docs/ARCHITECTURE.md), [Privacy](docs/PRIVACY.md), and [Demo Script](docs/DEMO_SCRIPT.md).

## Privacy

Gnomon does not send prompt text to external APIs in the MVP. Analysis, scoring, and optimization run locally in the browser.
