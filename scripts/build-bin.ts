import { readFileSync } from "fs";
import path from "path";

type BuildTarget = {
  target: string;
  outfile: string;
};

const rootDir = path.join(__dirname, "..");
const assetsDir = path.join(rootDir, "assets/config");

const targets: Record<string, BuildTarget> = {
  linux: { target: "bun-linux-x64", outfile: "bin/ynab-buddy-linux" },
  macos: { target: "bun-darwin-x64", outfile: "bin/ynab-buddy-macos" },
  win: { target: "bun-windows-x64", outfile: "bin/ynab-buddy-win.exe" },
};

const loadAsset = (fileName: string) =>
  readFileSync(path.join(assetsDir, fileName), "utf8");

const baseDefines = [
  '--define:process.env.YNAB_BUNDLED="true"',
  `--define:process.env.EMBEDDED_EXAMPLE_CONFIG=${JSON.stringify(
    loadAsset("config.yaml"),
  )}`,
  `--define:process.env.EMBEDDED_HOOKS=${JSON.stringify(
    loadAsset("hooks.js"),
  )}`,
];

const selectedTargets = Bun.argv.slice(2);
const targetNames = selectedTargets.length
  ? selectedTargets
  : Object.keys(targets);

for (const name of targetNames) {
  const build = targets[name];
  if (!build) {
    console.error(
      `Unknown target "${name}". Available targets: ${Object.keys(targets).join(", ")}`,
    );
    process.exit(1);
  }

  const args = [
    "build",
    "--compile",
    ...baseDefines,
    `--target=${build.target}`,
    `--outfile=${build.outfile}`,
    "src/index.ts",
  ];

  console.log(`\nBuilding ${name} binary...`);
  const result = Bun.spawnSync(["bun", ...args], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  if (result.exitCode !== 0) {
    process.exit(result.exitCode);
  }
}
