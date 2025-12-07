import fs from "fs";
import path from "path";

// Embedded copies of assets needed for compiled binaries.
// These are only used as a fallback when the on-disk assets are not available.

const assetsDir = path.join(__dirname, "../../assets/config");

const readAsset = (fileName: string): string | undefined => {
  const filePath = path.join(assetsDir, fileName);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return undefined;
  }
};

const exampleConfig =
  process.env.EMBEDDED_EXAMPLE_CONFIG ?? readAsset("config.yaml");
const hooks = process.env.EMBEDDED_HOOKS ?? readAsset("hooks.js");

if (!exampleConfig || !hooks) {
  throw new Error(
    "Embedded assets unavailable. Ensure assets/config files exist or provide EMBEDDED_EXAMPLE_CONFIG and EMBEDDED_HOOKS at build time.",
  );
}

export const EMBEDDED_EXAMPLE_CONFIG: string = exampleConfig;
export const EMBEDDED_HOOKS: string = hooks;
