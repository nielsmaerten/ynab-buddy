# HOW TO: Release ynab-buddy

1. When changes are ready and reviewed, bump the version string in `package.json` and commit.
2. GitHub Actions will test the code and create a draft release
3. Review the draft and optionally enter a description
4. Set the new release to "published"
5. GitHub Actions will build binaries and attach them to the release
6. GitHub Actions will publish the latest version to npm
7. Users of ynab-buddy will see an update notification in their terminal
