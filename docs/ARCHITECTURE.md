# Architecture

Gnomon is a pnpm monorepo with a local-first browser extension runtime.

## Packages

- `packages/tokenizer`: approximate token estimation using a model profile.
- `packages/core`: prompt feature extraction, classification, scoring, issue detection, output prediction, suggestions, and optimization.
- `packages/shared`: supported site config, default settings, i18n strings, and storage helpers.
- `packages/ui`: reusable React UI primitives used by popup and options pages.
- `apps/extension`: Manifest V3 extension, content script, inline widget, popup, and options page.

## Runtime Flow

1. The content script runs on `chatgpt.com` and `chat.openai.com`.
2. A prompt observer finds the ChatGPT input field using flexible selectors.
3. Input events are debounced.
4. Prompt text is analyzed locally through `@gnomon/core`.
5. React renders the floating widget.
6. Optimization is rule-based and only replaces the prompt after the user clicks Apply.

No prompt text is sent to external APIs.
