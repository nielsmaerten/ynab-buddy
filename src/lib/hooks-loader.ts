import { Options } from "csv-parse";
import fs from "fs";
import { BankFile, Configuration, Transaction } from "../types";

// First, let's import the javascript file that contains the hooks:
function importHooksModule() {
  // When debugging, load the hooks file from inside the repository
  const environment = process.env.NODE_ENV || "production";
  const isDev = ["development", "test"].includes(environment);
  if (isDev) return require(`${__dirname}/../../assets/config/hooks.js`);

  // In production, load the hooks file from the user's home directory
  const userHomeDir = require("os").homedir();
  const hooksPath = `${userHomeDir}/ynab-buddy/hooks.js`;
  if (fs.existsSync(hooksPath)) {
    return require(hooksPath);
  }
  return null;
}
const hooks = importHooksModule();

// A HookFunction is a function that can be called with any number of arguments,
// and returns a value of type T.
type HookFunction<T, A extends any[]> = (...args: A) => T;

// To call a hook, we look for a function with the right name in the hooks module.
// If it exists, we call it with the given arguments.
// If not, the data is passed through unchanged.
const callHook = <T, A extends any[]>(hookName: string): HookFunction<T, A> => {
  return (...args: A): T => {
    if (hooks && hooks[hookName]) {
      return hooks[hookName](...args);
    }
    return args[0];
  };
};

// Export the available hooks
export const onCsvLoaded: HookFunction<string, [string]> = callHook('onCsvLoaded');
export const onParseOptionsLoaded: HookFunction<Options, [Options]> = callHook('onParseOptionsLoaded');
export const onRecord: HookFunction<any, [any]> = callHook('onRecord');
export const onTransaction: HookFunction<Transaction, [any, Transaction]> = callHook('onTransaction');
export const onConfigurationLoaded: HookFunction<Configuration, [Configuration]> = callHook('onConfigurationLoaded');
export const onBankFile: HookFunction<BankFile, [BankFile]> = callHook('onBankFile');
