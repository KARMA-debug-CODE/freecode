# FreeCode

A free, self-hosted coding practice platform: a problem list, an in-browser editor, and an instant judge, plus a daily problem and streak tracking.

Everything runs **in your browser**:

- **JavaScript** runs in a Web Worker.
- **Python 3** runs in a Web Worker via [Pyodide](https://pyodide.org) (CPython compiled to WebAssembly, loaded from a CDN the first time you use it).
- Progress, submissions, and your code drafts are saved in `localStorage`. There is no backend and no account.

All problem statements, tests, and reference solutions in this repo were written for this project.

## Features

- 30 problems (Easy / Medium / Hard) with search plus difficulty, tag, and status filters
- Monaco editor (the VS Code editor) with Python and JavaScript support
- **Run** checks only the sample tests. **Submit** runs every test, including the hidden ones.
- Results show Accepted / Wrong Answer / Runtime Error / Time Limit Exceeded, with output, expected value, and captured stdout
- Hints, a reference solution you have to reveal on purpose, and a per-problem submission history
- Problem of the Day, a daily streak, and a 20-week activity heatmap
- Keyboard shortcuts: `Ctrl+Enter` runs, `Ctrl+Shift+Enter` submits

## Run it locally (Ubuntu / WSL)

Requires Node.js 20+ (for example via [nvm](https://github.com/nvm-sh/nvm): `nvm install 22`).

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

## Adding a problem

Problems live in `src/lib/problems/{easy,medium,hard}.ts`. Each one has:

- `entry`: the function name for each language. Python code uses `class Solution` with that method.
- `starter` / `solution`: code for each language
- `tests`: `{ args: [...], expected }`. The first `sampleCount` tests are shown to the user and used by **Run**.
- `compare` (optional): `"exact"` (the default), `"unordered"`, or `"nested-unordered"`

Then check that every reference solution passes every test in both languages:

```bash
npm run verify
```

## Project layout

```
public/runners/     Web Worker runners (js-runner.js, py-runner.js, compare.js)
scripts/verify.ts   Checks every reference solution against its tests
src/app/            Pages: list (/), problem (/problems/[slug]), /daily, /progress
src/components/     UI components (Workspace = editor + judge)
src/lib/            Problems, runner client, progress store
```
