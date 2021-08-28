export function displayWelcomeMessage(isFirstRun: boolean) {
  console.log("todo");
  // TODO
  //   // Hi, I'm Ynab Buddy and I can help you import your bank's CSV files into YNAB
  //   // It looks like you haven't configured me yet.
  //   // Please follow the instructions in the file c:/users/niels/ybuddy-config.yaml
}

/**
 * Asks the user to confirm the folder where the tool should search for BankFiles.
 * If a default folder has been set in config the user can confirm by pressing ENTER,
 * or provide a new path. If no default is set, we use the current working directory
 * The function loops until a valid existing path is provided
 */
export function confirmImportPath(defaultPath: string | undefined): string {
  console.log("todo");
  // TODO
  return "";
}
