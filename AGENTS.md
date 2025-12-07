# Repository Guidelines

## Project Structure & Module Organization
- `src/`: TypeScript source. CLI entry at `src/index.ts`; helpers in `src/lib/`.
- `assets/`: User-facing templates (`config/config.yaml`, `config/hooks.js`, test CSVs).
- `dist/`: Build output from `bun run build`.
- `bin/`: Bun-compiled executables (`bun run build:bin*`).
- `docs/`: Contributor and usage docs (configuration, hooks, release, contributing).
- `.github/workflows/`: CI for tests, version-check, and releases.

## Build, Test, and Development Commands
- `bun install --frozen-lockfile` — install dependencies.
- `bun run build` — clean and compile TypeScript to `dist/`.
- `bun run test` — run unit tests with coverage (bun:test).
- `bun run lint` — Prettier check (`bun run lint:fix` to format).
- `bun run test:integration` — Dockerized end-to-end check for JS and compiled binary.
- `bun run build:bin` — build self-contained executables for Linux/macOS/Windows.

## Coding Style & Naming Conventions
- Language: TypeScript; CommonJS output.
- Formatting: Prettier defaults (run `bun run lint:fix`).
- Use descriptive names; prefer lowerCamelCase for vars/functions, PascalCase for types.
- Keep inline comments minimal; favor clear code.

## Testing Guidelines
- Framework: `bun:test`.
- Tests live alongside code (e.g., `src/lib/*.spec.ts`, fixtures nearby).
- Run `bun run test` before handoff; include integration (`test:integration`) when changing packaging/runtime behavior.
- Aim to keep tests deterministic; avoid global state.

## Commit & Pull Request Guidelines
- Leave changes on the working tree for the user to review.
- Do not commit unless asked by the user.
