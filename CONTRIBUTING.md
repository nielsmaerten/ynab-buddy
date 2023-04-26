# ynab-buddy

## Table of Contents

- [Getting Started](#getting-started)
- [Setting Up Your Development Environment](#setting-up-your-development-environment)
- [How ynab-buddy works (under the hood)](#how-ynab-buddy-works-under-the-hood)
- [Code Style and Formatting](#code-style-and-formatting)
- [Submitting a Pull Request](#submitting-a-pull-request)

## Getting Started

First of all, thank you for considering contributing to ynab-buddy! Your valuable input can help make this tool even better.

If you encounter any issues or bugs, please use the GitHub Issues tab to report them. This helps me track and address the problems more effectively.

For new feature suggestions, I encourage you to start a conversation on the GitHub Discussions tab before diving into the implementation. This allows others to provide feedback, share ideas, and ensure that no one is working on a similar feature simultaneously. It's a great way to collaborate and ensure that your efforts are aligned with the project's goals.

Once you've discussed your ideas and are ready to contribute, you can submit your code changes or updates through a Pull Request. Looking forward to seeing what you build!

## Setting Up Your Development Environment

There are multiple ways to set up your development environment for ynab-buddy. Choose the method that best suits your preferences and workflow.

### 1. Using GitHub Codespaces

GitHub Codespaces is a convenient and quick way to get started with ynab-buddy. It provides you with a fully configured, cloud-based development environment that you can access directly from your browser. To create a new Codespace for this project, visit the project's GitHub repository and click the "Code" button. From the dropdown menu, select "Open with Codespaces" and follow the prompts.

### 2. Using Devcontainer in Visual Studio Code (with Docker)

If you have Docker installed and prefer working with your local installation of Visual Studio Code, you can use the included `devcontainer.json` file to set up a containerized development environment. This ensures a consistent development environment across different machines and platforms.

To set up the environment, follow these steps:

1. Open the project folder in Visual Studio Code.
2. If you have the "Remote - Containers" extension installed, VS Code will automatically prompt you to reopen the project in a container. Click "Reopen in Container" to proceed.
3. If you don't see the prompt, press `F1` (or `Cmd+Shift+P` on macOS) to open the Command Palette, then search for and select "Remote-Containers: Reopen in Container".

The container will build and launch, setting up your development environment with all the necessary tools and dependencies.

### 3. Manual Setup (Yarn)

If you prefer to set up your development environment manually, follow these steps:

1. Ensure you have the latest version of Node.js and Yarn installed on your machine. Visit the [official Yarn website](https://yarnpkg.com/) for installation instructions.
2. Clone the project repository to your local machine.
3. Open a terminal/command prompt in the project root folder and run `yarn` to install the project dependencies.

Once the setup is complete, you're ready to start contributing to ynab-buddy!

---

## How ynab-buddy works (under the hood)

ynab-buddy follows a specific workflow to process and upload your bank transactions to YNAB. Here's an overview of the architecture and the main components involved:

1. **Configuration file**: When you run ynab-buddy for the first time, a configuration file is created in your home directory using a template from the assets folder. This file contains essential information on how to parse your bank's files and where to upload transactions.

2. **BankFile scanning**: ynab-buddy scans the import directory for files that match the filename patterns specified in the configuration. A matched file is treated as a BankFile, which contains the raw transaction data from your bank.

3. **Parsing BankFiles**: Each BankFile is associated with a Parser, which determines how to process the file. The Parser contains information on which columns contain relevant data, date formatting, and other necessary details. ynab-buddy reads the CSV data from all BankFiles and creates Transactions based on the records and the corresponding Parser instructions.

4. **Transaction processing**: After parsing, ynab-buddy holds a list of Transactions. For each transaction, the application determines:

   - If it should be uploaded to YNAB
   - Which YNAB Account and Budget it is associated with
   - Any additional metadata

5. **Uploading transactions to YNAB**: Eligible transactions are sent to YNAB using the YNAB API. Duplicates are prevented by assigning a unique ImportId to each transaction. To access the YNAB API, you need to add your personal developer token to the configuration file.

6. **Optional steps**: After the transactions are uploaded, ynab-buddy can optionally:

   - Delete the source BankFiles from the filesystem
   - Save the converted YNAB CSV files

7. **Script termination**: Once all the transactions have been processed and uploaded (if applicable), the script ends.

Please let us know if you would like more information or clarification on any part of the architecture.

## Code Style and Formatting

To maintain consistency and readability throughout the ynab-buddy project, we use [Prettier](https://prettier.io/) for code formatting. Prettier is included in the project's `devDependencies` and you can run it using `yarn lint`.

If you're using Visual Studio Code, we recommend installing the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension. This extension will automatically format your code according to the project's Prettier configuration when you save your files.

## Submitting a Pull Request

When you're ready to contribute your changes, follow these steps to submit a Pull Request:

1. Fork the ynab-buddy repository to your GitHub account.
2. Clone the forked repository to your local machine.
3. Create a new branch with a descriptive name, such as `feature/new-feature-name` or `fix/issue-description`.
4. Make your changes in the new branch, ensuring that your code adheres to the project's [code style and formatting guidelines](#code-style-and-formatting).
5. Commit your changes, using clear and informative commit messages.
6. Push the changes to your forked repository on GitHub.
7. Visit the ynab-buddy repository on GitHub and click the "Pull Requests" tab.
8. Click "New Pull Request" and choose the base repository (original ynab-buddy repository) and the head repository (your forked repository).
9. Select your branch with the changes and click "Create Pull Request."
10. Provide a detailed description of your changes in the Pull Request description, including the purpose of your changes and any related issues or discussions.

Once your Pull Request has been submitted, it will be reviewed by the project maintainer(s). They may provide feedback and request changes before merging your contribution into the main codebase.
