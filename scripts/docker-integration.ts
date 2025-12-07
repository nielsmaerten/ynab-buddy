#!/usr/bin/env bun
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  chmodSync,
} from "fs";
import { join, resolve } from "path";
import os from "os";
import { spawnSync, SpawnSyncOptions } from "child_process";

type Fixture = {
  kind: string;
  baseDir: string;
  homeRoot: string;
  banksDir: string;
  bankFile: string;
  importPath: string;
  outputPath: string;
  hookPath: string;
};

const repoRoot = resolve(__dirname, "..");
const dockerBin = process.env.DOCKER_BIN || "docker";
const bunBin =
  process.env.BUN_BIN ||
  (existsSync("/home/niels/.bun/bin/bun") ? "/home/niels/.bun/bin/bun" : "bun");
const image = process.env.INTEGRATION_IMAGE || "node:20-bookworm-slim";

const distDir = resolve(repoRoot, "dist");
const assetsDir = resolve(repoRoot, "assets");
const nodeModulesDir = resolve(repoRoot, "node_modules");
const binaryPath = resolve(repoRoot, "bin/ynab-buddy-linux");
const packageJsonPath = resolve(repoRoot, "package.json");

function main() {
  const isCI = Boolean(process.env.CI);
  if (isCI) {
    console.log("Running in CI mode: Docker integration tests disabled.");
    return;
  }
  ensureCommand(dockerBin, ["--version"], "Docker is required for integration tests");
  ensureBuilds();

  const fixtures = {
    js: prepareFixture("js"),
    bin: prepareFixture("bin"),
  };

  try {
    runBinaryIntegration(fixtures.bin);
    runJsIntegration(fixtures.js);
    console.log("✅ Docker integration tests passed.");
  } finally {
    if (!process.env.KEEP_INT_TMP) {
      cleanup(fixtures.js.baseDir);
      cleanup(fixtures.bin.baseDir);
    } else {
      console.log(
        `Temp data preserved at ${fixtures.js.baseDir} and ${fixtures.bin.baseDir}`,
      );
    }
  }
}

function ensureBuilds() {
  runProcess(bunBin, ["run", "build"]);
  runProcess(bunBin, ["run", "build:bin:linux"]);
  assertFile(binaryPath, "Compiled Linux binary is missing. Run build:bin:linux.");
  assertDir(distDir, "dist build is missing. Run bun run build.");
  // Ensure host binary is executable before mounting into Docker
  chmodSync(binaryPath, 0o755);
}

function prepareFixture(kind: string): Fixture {
  const baseDir = mkdtempSync(join(os.tmpdir(), `ynab-buddy-int-${kind}-`));
  const homeRoot = join(baseDir, "home");
  const configDir = join(homeRoot, "ynab-buddy");
  const banksDir = join(baseDir, "banks");
  mkdirSync(configDir, { recursive: true });
  mkdirSync(banksDir, { recursive: true });

  const bankFile = `${kind}-sample.csv`;
  const importPath = `/data/${kind}`;
  writeFileSync(join(banksDir, bankFile), sampleCsv());
  writeFileSync(join(configDir, "config.yaml"), sampleConfig(importPath, bankFile));

  return {
    kind,
    baseDir,
    homeRoot,
    banksDir,
    bankFile,
    importPath,
    outputPath: join(
      banksDir,
      `${bankFile.replace(/\.csv$/i, "")}.YNAB.csv`,
    ),
    hookPath: join(configDir, "hooks.js"),
  };
}

function runBinaryIntegration(fixture: Fixture) {
  console.log("Running bundled binary flow…");
  // Eject default hooks file using the compiled binary
  runDocker(
    [
      "-u",
      "0:0",
      "-v",
      `${binaryPath}:/artifacts/ynab-buddy-linux:ro`,
      "-v",
      `${fixture.banksDir}:${fixture.importPath}`,
      "-v",
      `${fixture.homeRoot}:/home/node`,
      "-e",
      "HOME=/home/node",
      "-w",
      "/tmp",
      image,
      "/bin/sh",
      "-c",
      "printf '\\n' | /artifacts/ynab-buddy-linux --setup-hooks",
    ],
    "Failed to run binary --setup-hooks",
    "\n",
  );
  assertFile(
    fixture.hookPath,
    "Hooks file was not created by --setup-hooks in bundled binary",
  );

  // Replace hooks with a deterministic handler (write inside container as root)
  runDocker(
    [
      "-u",
      "0:0",
      "-v",
      `${fixture.homeRoot}:/home/node`,
      image,
      "/bin/sh",
      "-c",
      `cat <<'EOF' > /home/node/ynab-buddy/hooks.js\n${hookTemplate(fixture.kind)}\nEOF`,
    ],
    "Failed to overwrite hooks file inside container",
  );

  // Process sample data with the bundled binary (send a newline to satisfy exit prompt)
  runDocker(
    [
      "-u",
      "0:0",
      "-v",
      `${binaryPath}:/artifacts/ynab-buddy-linux:ro`,
      "-v",
      `${fixture.banksDir}:${fixture.importPath}`,
      "-v",
      `${fixture.homeRoot}:/home/node`,
      "-e",
      "HOME=/home/node",
      "-w",
      "/tmp",
      image,
      "/bin/sh",
      "-c",
      "printf '\\n' | /artifacts/ynab-buddy-linux",
    ],
    "Bundled binary flow failed",
    "\n",
  );
  assertProcessedOutput(fixture.outputPath, fixture.kind);
}

function runJsIntegration(fixture: Fixture) {
  console.log("Running Node (compiled JS) flow…");
  writeFileSync(fixture.hookPath, hookTemplate(fixture.kind));

  runDocker(
    [
      "-u",
      "0:0",
      "-v",
      `${distDir}:/app/dist:ro`,
      "-v",
      `${packageJsonPath}:/app/package.json:ro`,
      "-v",
      `${assetsDir}:/app/assets:ro`,
      "-v",
      `${nodeModulesDir}:/app/node_modules:ro`,
      "-v",
      `${fixture.banksDir}:${fixture.importPath}`,
      "-v",
      `${fixture.homeRoot}:/home/node`,
      "-e",
      "HOME=/home/node",
      "-w",
      "/app",
      image,
      "node",
      "dist/index.js",
    ],
    "JS flow failed",
  );
  assertProcessedOutput(fixture.outputPath, fixture.kind);
}

function assertProcessedOutput(outputPath: string, marker: string) {
  assertFile(outputPath, `Expected parsed output file at ${outputPath}`);
  const output = readFileSync(outputPath, "utf8");
  const lines = output.trim().split("\n");
  if (lines.length < 2) {
    throw new Error(`Parsed output at ${outputPath} has no rows`);
  }
  if (!output.includes(`[${marker}-hook]`)) {
    throw new Error(
      `Hook output marker missing in parsed file ${outputPath}. Contents:\n${output}`,
    );
  }
}

function sampleCsv() {
  return [
    "date,payee,memo,inflow,outflow",
    "2024-01-01,Coffee Shop,Morning coffee,10.50,",
    "2024-01-02,Grocery Store,Groceries,,5.25",
    "2024-01-03,Online Store,New headphones,120.00,",
  ].join("\n");
}

function sampleConfig(importPath: string, bankFile: string) {
  return [
    `import_from: "${importPath}"`,
    "skip_path_confirmation: true",
    "search_subdirectories: false",
    "bank_transaction_files:",
    `  - account_name: Integration Checking`,
    `    pattern: ${bankFile}`,
    "    parser: integration-parser",
    "    ynab_account_id: 00000000-0000-0000-0000-000000000000",
    "    ynab_budget_id: 00000000-0000-0000-0000-000000000000",
    "    save_parsed_file: true",
    "    delete_original_file: false",
    "    upload: false",
    "parsers:",
    "  - name: integration-parser",
    "    header_rows: 1",
    "    footer_rows: 0",
    "    delimiter: \",\"",
    "    columns: [date, payee, memo, inflow, outflow]",
    "    date_format: yyyy-MM-dd",
    "    decimal_separator: \".\"",
    "upload_to_ynab:",
    "  upload_transactions: false",
    "  ynab_token: DUMMY",
    "configuration_done: true",
    "",
  ].join("\n");
}

function hookTemplate(kind: string) {
  return `
module.exports = {
  onTransaction(tx) {
    tx.memo = (tx.memo || "") + " [${kind}-hook]";
    return tx;
  },
};
`.trimStart();
}

function runDocker(args: string[], errorMessage: string, input?: string) {
  const result = spawnSync(
    dockerBin,
    ["run", "--rm", ...args],
    {
      stdio: ["pipe", "inherit", "inherit"],
      input,
      env: { ...process.env },
    },
  );
  if (result.status !== 0) {
    throw new Error(errorMessage);
  }
}

function runProcess(cmd: string, args: string[], opts: SpawnSyncOptions = {}) {
  const result = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

function ensureCommand(cmd: string, args: string[], message: string) {
  const result = spawnSync(cmd, args, { stdio: "ignore" });
  if (result.status !== 0) {
    throw new Error(message);
  }
}

function assertFile(path: string, message: string) {
  if (!existsSync(path)) {
    throw new Error(message);
  }
}

function assertDir(path: string, message: string) {
  if (!existsSync(path)) {
    throw new Error(message);
  }
}

function cleanup(dir: string) {
  rmSync(dir, { recursive: true, force: true });
}

main();
