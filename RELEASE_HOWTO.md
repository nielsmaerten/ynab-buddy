# HOW TO: Release ynab-buddy

1. When changes are ready and reviewed, bump the version string in `package.json` and commit.
2. Push to `main`. The `version-check` workflow will tag the commit and create a draft release when the version changes.
3. GitHub Actions `test` runs Bun tests/lint/typecheck + Dockerized integration.
4. Publish the draft release. The `release` workflow will:
   - verify the tag matches `package.json`
   - run Bun lint/test/typecheck + integration
   - build Bun-compiled binaries and attach them to the release
   - publish the npm package (compiled JS + assets)
5. Users of ynab-buddy will see an update notification in their terminal.
