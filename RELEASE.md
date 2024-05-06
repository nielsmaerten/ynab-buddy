# Release manual

- Switch to main branch
- Run `yarn release` 
  - The project will be tested, built, bumped and tagged
  - Tags will be pushed to GitHub
  - A draft release will be created, and GitHub actions will add binaries to it
- `npm publish` will run automatically, and pause while waiting for OTP
  - If everything went well, enter OTP to publish to NPM
