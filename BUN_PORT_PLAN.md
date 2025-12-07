# Bun Port Plan

## Goals
- Replace Yarn with Bun for install/run while keeping npm users working.
- Ship both Node-compatible JS + assets for npm and single-file Bun executables per OS.
- Swap Jest for `bun test` with equivalent coverage/mocking.
- Preserve dynamic hook loading (`assets/config/hooks.js` or `~/ynab-buddy/hooks.js`) in both JS and compiled modes.

## Current state (pre-migration)
- Package manager: Yarn 4 (`.yarnrc.yml`, `yarn.lock`, scripts use `yarn`, dev instructions mention Yarn).
- Build/package: `tsc` to `dist/`; `@yao-pkg/pkg` creates binaries to `bin/` from `dist/index.js`; runtime uses `process.pkg` to detect pkg build for exit/update UX.
- Tests: Jest + ts-jest config (`jest.config.js`, `tsconfig` types include jest); coverage via Jest.
- CI/release: GitHub Actions with `yarn install/test/lint/pkg`, uploads `bin/*` on tags.
- Assets/hooks: `assets/config/example.yaml` copied to home config; hooks loader reads `assets/config/hooks.js` in dev/test and `~/ynab-buddy/hooks.js` at runtime.
- Docs: README/CONTRIBUTING/RELEASE mention Yarn workflows.

## Work Plan
1) Package manager
- Switch `packageManager` to Bun, drop Yarn artifacts, regenerate lock (`bun.lock`).
- Update scripts to `bun`/`bun x …`, refresh CONTRIBUTING/README/devcontainer if needed.

2) Build outputs
- Keep `bun x tsc --noEmit` for type-checking; emit JS to `dist/` via Bun.
- Add `bun build --compile` targets to produce one executable per OS in `bin/`; ensure version injection still works.
- Runtime detection: handle Node (JS install) and Bun-compiled binary (no `process.pkg`).

3) Tests
- Migrate Jest suites to `bun test` APIs (mocks/spies/timers/coverage).
- Remove Jest/ts-jest configs and deps; update `tsconfig` types to Bun/Node.

4) Assets & hooks
- Ensure `assets/config/example.yaml` and `assets/config/hooks.js` remain loadable from filesystem; avoid bundling them away in compiled build.
- Confirm compiled binary can read `~/ynab-buddy/hooks.js` dynamically.

5) npm publish strategy
- Prefer publishing transpiled JS + assets (status quo for npm); if Node compat is problematic, fall back to a small npm wrapper that downloads the correct release binary.

6) CI & release
- Update GitHub Actions to Bun (`oven-sh/setup-bun`), run bun install/test/lint, build JS + executables, upload `bin/*` to releases, and keep npm publish flow working.

## Validation
- Run `bun test`, lint/prettier, type-check, JS run path (`bun run dist/index.js` or `node dist/index.js`), and smoke-check compiled binaries per OS.

## Done so far
- Installed Bun (v1.3.4), set `packageManager` to Bun, removed Yarn artifacts, and generated `bun.lock`.
- Updated package scripts to Bun equivalents; `bun test` now runs with `--max-concurrency=1` for isolation.
- Migrated all Jest tests to `bun:test` (rewrote mocks/spies/timers), adjusted filesystem/parser tests to avoid global module mocks, and refactored `src/index.ts` to export `runApp` for dependency injection in tests.
- Switched `filesystem.ts` to use `fs.*` calls for easier mocking; `tsconfig` now references `bun-types`; Jest config/deps removed.
