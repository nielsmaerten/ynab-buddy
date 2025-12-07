import { Options } from "csv-parse";
import fs from "fs";
import path from "path";
import { homedir } from "os";
import { BankFile, Configuration, Transaction } from "../types";

export const USER_HOOKS_PATH = path.join(homedir(), "ynab-buddy/hooks.js");

// First, let's import the javascript file that contains the hooks:
function importHooksModule() {
  // When debugging, load the hooks file from inside the repository
  const environment = process.env.NODE_ENV || "production";
  const isBundled =
    Boolean((process as any).pkg) || process.env.YNAB_BUNDLED === "true";
  const isDev = !isBundled && ["development", "test", "hooks"].includes(environment);
  const devHooksPath = `${__dirname}/../../assets/config/hooks.js`;
  if (isDev && fs.existsSync(devHooksPath)) return require(devHooksPath);

  // In production, load the hooks file from the user's home directory
  if (fs.existsSync(USER_HOOKS_PATH)) {
    return require(USER_HOOKS_PATH);
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
// prettier-ignore
export const onCsvLoaded: HookFunction<string, [string]> = callHook('onCsvLoaded');
// prettier-ignore
export const onParseOptionsLoaded: HookFunction<Options, [Options]> = callHook('onParseOptionsLoaded');
// prettier-ignore
export const onRecord: HookFunction<any, [any]> = callHook('onRecord');
// prettier-ignore
export const onTransaction: HookFunction<Transaction, [any, Transaction]> = callHook('onTransaction');
// prettier-ignore
export const onConfigurationLoaded: HookFunction<Configuration, [Configuration]> = callHook('onConfigurationLoaded');
// prettier-ignore
export const onBankFile: HookFunction<BankFile, [BankFile]> = callHook('onBankFile');
