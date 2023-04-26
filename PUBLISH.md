# Publishing

- Switch to main branch
- Run `yarn run publish:np` - this builds the project to `dist/`
- `np` will create new versions on NPM and on GitHub
- GitHub will build the binaries and add them to the new release
- Update this release notes using the previous release as a template
- Update version.json to trigger notifications in existing installations
