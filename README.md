## KIE Tooling Core

This repository is the home for the Multiplying Architecture packages. Together, they provide a complete solution for creating Editors and Views that can be easily reused on different types of web-based applications.

The KIE Tooling Core project provides facilitator packages for writing VS Code Extensions and Chrome Extensions for augmenting GitHub's web UI.

---

### Documentation

- _Work in progress 🔨_

### Contribute

- _Work in progress 🔨_

### Develop

To start building the KIE Tooling Core project, you're going to need:

- Node `>= 16.2.0` _(To install, follow these instructions: https://nodejs.org/en/download/package-manager/)_
- Yarn `1.22.10` _(To install, run `npm install -g yarn@1.22.10`)_
- Lerna `4.0.0` _(To install, run `npm install -g lerna@4.0.0`)_

After installing the tools above, you'll need to download the dependencies and link the packages locally. Simply run:

- `yarn bootstrap`

To build it, you'll have two choices:

- `yarn build:dev` - This is fast, but not as strict. It skips tests, linters, and some type checks. Be prepared for the CI to fail on your PRs.
- `yarn build:prod` - The default command to build production-ready packages. Use that to make sure your changes are correct.

You can also use the packages on the `examples` directory. They provide applications to see how the KIE Tooling Core packages are going to be consumed. Follow the instructions on each README file inside each package.

- `examples/webapp` - Contains a web application with a Base64 PNG Editor, and a couple of Views.
  - Might the most recommended one to use during development. This webapp has live-reload, and contains usage of the majority of the packages on the KIE Tooling Core project.
- `examples/todo-list-view-vscode-extension` - VS Code Extension with a simple View.
- `examples/base64png-editor-vscode-extension` - VS Code Extension with a simple Editor for `.base64png` files.
- `examples/base64png-editor-chrome-extension` - Chrome Extension to display `.base64png` files directly on GitHub's UI.

### Test with Kogito Tooling

The [Kogito Tooling](https://github.com/kiegroup/kogito-tooling) project uses KIE Tooling Core extensively. If you need to test changes on KIE Tooling Core directly on Kogito Tooling, follow these steps:

1. Clone [kogito-tooling](https://github.com/kiegroup/kogito-tooling).
1. Follow the [build instructions](https://github.com/kiegroup/kogito-tooling/tree/main/README.md#build-from-source) for Kogito Tooling.
1. Change kie-tooling-core packages and built it following the instructions above.
1. Go to the root directory of kie-tooling-core and run `yarn link-to <path-to-kogito-tooling>`.
   - _Usually `yarn link-to ../kogito-tooling`._
1. Rebuild the Kogito Tooling modules you want to test and see the effects of your changes.

### Release

1. Go to the [`Release` workflow](https://github.com/kiegroup/kie-tooling-core/actions/workflows/release.yml) and select "Run workflow".
1. Choose the branch from which you're going to create a release.
1. Provide the version of the release (New version).
1. Provide the version of the last release made (Latest version).
   - _This is used to determine the Release Notes, which are automatically generated from the commits between the two versions._
1. Monitor the release workflow. If everything goes well, you'll have a new tag, a new release on GitHub's page, and a new version published to the NPM registry.
   - _If the release notes contain errors or if you want to add or change it, simply edit the GitHub release manually._

### Tutorials and guides

- [How to create a custom Editor in a React application](https://blog.kie.org/2020/10/kogito-tooling-examples%e2%80%8a-%e2%80%8ahow-to-create-a-custom-editor-in-a-react-application.html) - ([Code](/examples/base64png-editor))
- [How to create a Chrome Extension for a custom Editor](https://blog.kie.org/2020/10/kogito-tooling-examples%e2%80%8a-%e2%80%8ahow-to-create-a-chrome-extension-for-a-custom-editor.html) - ([Code](/examples/base64png-editor-chrome-extension))
- [How to create a VS Code Extension for the custom Editor](https://blog.kie.org/2020/10/kogito-tooling-examples%e2%80%8a-%e2%80%8ahow-to-create-a-vs-code-extension-for-the-custom-editor.html) - ([Code](/examples/base64png-editor-vscode-extension))
- [How to create a custom View](https://blog.kie.org/2020/10/kogito-tooling-examples-how-to-create-a-custom-view.html) - ([Code](/examples/todo-list-view))
- [How to create a more complex custom View](https://blog.kie.org/2020/10/kogito-tooling-examples-how-to-create-a-more-complex-custom-view.html) - ([Code](/examples/ping-pong-view))
- [How to create a VS Code Extension for a custom View](https://blog.kie.org/2020/10/kogito-tooling-examples%e2%80%8a-%e2%80%8ahow-to-create-a-vs-code-extension-for-a-custom-view.html) - ([Code](/examples/todo-list-view-vscode-extension))
- [How to integrate a custom Editor, an existing Editors, and custom Views on a Web App](https://blog.kie.org/2020/10/kogito-tooling-examples%e2%80%8a-%e2%80%8ahow-to-integrate-a-custom-editor-an-existing-editors-and-custom-views.html) - ([Code](/examples/webapp))
