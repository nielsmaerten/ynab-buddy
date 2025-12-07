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
- Assets/hooks: `assets/config/config.yaml` copied to home config; hooks loader reads `assets/config/hooks.js` in dev/test and `~/ynab-buddy/hooks.js` at runtime.
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
- Ensure `assets/config/config.yaml` and `assets/config/hooks.js` remain loadable from filesystem; avoid bundling them away in compiled build.
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
- Replaced pkg packaging scripts with `bun build --compile` targets for Linux/macOS/Windows (`build:bin*`), and wired `package` to run both JS build and binaries.
- Added embedded example config fallback for compiled binaries and a `YNAB_BUNDLED` flag to detect Bun-compiled executables at runtime; build:bin scripts set the flag so CLI exit/update behavior matches the old pkg binary.
- Confirmed builds/tests: `bun run build`, `bun run build:bin`, and `bun test --coverage --max-concurrency=1`.
- Added hook ejection UX: new `--setup-hooks` flag writes `assets/config/hooks.js` template into `~/ynab-buddy/hooks.js`; compiled binaries embed both the example config and hooks template so hooks remain optional and filesystem-driven.
- Added Dockerized integration harness (`test:integration`) that builds artifacts, runs the Linux bun-compiled binary (including `--setup-hooks`) and the compiled JS path inside a disposable Node container, and validates hooked parsing/output CSVs; verified it passes locally.

## Next steps (remaining)
- Document hooks behavior and `--setup-hooks`, and confirm runtime gracefully disables hooks when the file is absent.
- Decide npm publish shape: ship transpiled JS + assets (preferred) vs wrapper downloader; update files array/main/bin accordingly.
- Update CI/release workflow to Bun (install/test/lint/build binaries/upload), wire in dockerized integration tests, and refresh docs/RELEASE.md for new commands.

## Pending prerelease
- Plan: tag/publish `3.0.0-preview.1` (npm `dist-tag next` for prerelease; stable skips the tag) after merging to `main`, letting Bun workflows build binaries and push npm (JS+assets) via GitHub OIDC trusted publisher. Validate on target systems manually.
