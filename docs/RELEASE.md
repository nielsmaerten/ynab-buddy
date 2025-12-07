# Release manual

- Switch to main branch
- Ensure Bun (v1.3+) and Docker are available locally.
- Run `bun run test` and `bun run test:integration` (Dockerized JS + binary check).
- Run `bun run release`
  - Uses `np --no-publish` to test, bump, and tag
  - Tags will be pushed to GitHub; CI will attach bun-compiled binaries to the release
- When prompted for OTP, complete `npm publish` (compiled JS + assets).
