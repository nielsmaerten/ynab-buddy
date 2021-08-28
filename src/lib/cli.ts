import { resolve } from "path";
import { APP_NAME, APP_VERSION } from "../constants";
import { getConfigPath } from "./configuration";

export function displayWelcomeMessage(isFirstRun: boolean) {
  console.log(`${APP_NAME} - v${APP_VERSION}`);
  console.log("= = = = =");
  if (isFirstRun) {
    console.log(
      "Welcome to YNAB Buddy.",
      "This tool can help you import your bank's CSV files into YNAB.",
      "Looks like you haven't configured YNAB Buddy yet."
    );
    console.log(
      "To get started, open the following file and follow the instructions:"
    );
    console.log(getConfigPath());
  }
}

/**
 * // TODO: Next steps: get the import path using 'inquirer'
 * - it will need to be validated, and the promise should only resolve with a valid path
 * - the default path can be selected by just pressing enter
 * - if it the path is invalid or does not exist, we ask again
 * - no need to validate defaultpath upfront, just allow user to press enter and fail from there
 *
 * Asks the user to confirm the folder where the tool should search for BankFiles.
 * If a default folder has been set in config the user can confirm by pressing ENTER,
 * or provide a new path. If no default is set, we use the current working directory
 * The function loops until a valid existing path is provided
 */
export async function confirmImportPath(defaultPath: string | undefined) {
  const prompt = new Input({
    message: "Directory containing files to import/convert:",
    initial: defaultPath || resolve(__dirname),
  });

  prompt
    .run()
    .then((answer: string) => console.log("Answer:", answer))
    .catch(console.log);
  console.log("Directory containing files to import/convert:");
  let importPath = defaultPath?.toString();
  if (!importPath) {
    importPath = resolve(__dirname);
  }

  console.log(`{ENTER}: [${defaultPath}]`);
  return "";
}
