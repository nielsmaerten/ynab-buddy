import $hgUW1$fs, {writeFileSync as $hgUW1$writeFileSync, rmSync as $hgUW1$rmSync} from "fs";
import * as $hgUW1$process from "process";
import $hgUW1$chalk from "chalk";
import $hgUW1$prompts from "prompts";
import $hgUW1$path from "path";
import {homedir as $hgUW1$homedir} from "os";
import {load as $hgUW1$load} from "js-yaml";
import {minimatch as $hgUW1$minimatch} from "minimatch";
import {sync as $hgUW1$sync} from "glob";
import {stringify as $hgUW1$stringify} from "csv-stringify/sync";
import {parse as $hgUW1$parse} from "csv-parse/sync";
import {DateTime as $hgUW1$DateTime} from "luxon";
import $hgUW1$ynab, {API as $hgUW1$API} from "ynab";
import {Buffer as $hgUW1$Buffer} from "buffer";
import {createHash as $hgUW1$createHash, createPublicKey as $hgUW1$createPublicKey, randomBytes as $hgUW1$randomBytes, createCipheriv as $hgUW1$createCipheriv, publicEncrypt as $hgUW1$publicEncrypt, constants as $hgUW1$constants} from "crypto";
import {gzipSync as $hgUW1$gzipSync} from "zlib";


      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire6dad"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire6dad"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("jb6Pn", function(module, exports) {
module.exports = JSON.parse('{"name":"ynab-buddy","version":"3.0.0-alpha.1","description":"Upload & import CSV files from any bank into YNAB","keywords":["ynab","youneedabudget","csv","import"],"type":"module","module":"./dist/index.mjs","bin":"./dist/index.mjs","files":["dist/","assets/"],"license":"MIT","author":{"name":"Niels Maerten","url":"https://github.com/nielsmaerten"},"homepage":"https://github.com/nielsmaerten/ynab-buddy","repository":{"type":"git","url":"https://github.com/nielsmaerten/ynab-buddy"},"scripts":{"hooks":"cross-env NODE_ENV=hooks yarn start","check-types":"tsc --noEmit","build":"parcel build ./src/index.ts --dist-dir dist","dev":"yarn build && node --inspect dist/index.mjs","package":"yarn pkg ./dist/index.js --config ./package.json","package:rebuild":"yarn build && yarn package","publish:np":"yarn build && np --no-cleanup --no-yarn && yarn package --compress Brotli","test":"jest","lint:fix":"yarn prettier ./src --write","lint":"yarn prettier ./src --check"},"pkg":{"assets":["assets/config/example.yaml"],"scripts":"build/**/*.js","targets":["linux","win","macos"],"outputPath":"bin"},"config":{"commitizen":{"path":"./node_modules/cz-conventional-changelog"}},"devDependencies":{"@types/glob":"^8.1.0","@types/jest":"^29.4.4","@types/js-yaml":"^4.0.5","@types/luxon":"^3.2.0","@types/node":"^20.11.19","@types/prompts":"^2.4.3","commitizen":"^4.3.0","cross-env":"^7.0.3","cz-conventional-changelog":"3.3.0","jest":"^29.5.0","np":"^8.0.0","parcel":"^2.11.0","pkg":"^5.8.1","prettier":"2.8.8","ts-jest":"^29.0.5","typescript":"^5.0.4"},"dependencies":{"chalk":"^4.1.2","csv-parse":"^5.5.3","csv-stringify":"^6.4.5","glob":"^10.2.2","js-yaml":"^4.1.0","luxon":"^3.3.0","minimatch":"^9.0.0","prompts":"^2.4.2","ynab":"^2.2.0","zlib":"^1.0.5"},"resolutions":{"minimist":"^1.2.7"},"packageManager":"yarn@3.8.0"}');

});

const $234747a9630b4642$export$918c9dda287c9d0b = "~/ynab-buddy";
const $234747a9630b4642$export$ed2960050c23d0cf = "config.yaml";
const $234747a9630b4642$export$90385cabec895467 = "assets/config/example.yaml";
const $234747a9630b4642$export$cad19b853250d406 = "assets/test-banks";
const $234747a9630b4642$export$5b6c28c7dca07ad7 = "YNAB Buddy";

const $234747a9630b4642$export$8ee1df3c6367a60 = (parcelRequire("jb6Pn")).version;
const $234747a9630b4642$export$cf61f82ee08f4eb = "https://api.niels.me/ynab-buddy/check-updates?version=" + $234747a9630b4642$export$8ee1df3c6367a60;
const $234747a9630b4642$export$d6856d1a13b1d967 = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsEdgc6Ug6/Ao1JHenEIj
xEzaFxYwlexMhPoVoMMeKKSTkbzF8MMvHtifw8DZ97Kbinard9EZu5jxbNkpfVwm
k04HUEQgs/H7mj8omMqbFEbzdBrkUvS1exFdL/LivOEnJ/ZN7PrgQYcnZQCb/S9m
wZvd9A9M93BRkZoEfgDJYfml6AKTrKyfl5l7YZLIYGMwQ63Zp7ixd7Js4tZqp8FE
g89CzzIASLXx4QHSbx+M2tVKgz1woC+vBnBvMSu0UHun9mVEkn97qZtAvdCYoDSv
pVAg1iqCtsxjhxuTFkjVeV+1YNSBlFwPMdmt3SnzXL33PtgYt3Z5ribNa+FJbgtK
VQIDAQAB
-----END PUBLIC KEY-----`;
const $234747a9630b4642$export$defe85febe8b728c = {
    disclaimer: "Disclaimer: This is a community project, not an official service from YNAB.",
    intro: "Convert CSV files from any bank; upload directly to YNAB",
    notConfigured: "Looks like YNAB Buddy is not yet configured.",
    gettingStarted: "To get started, open the following file and follow the instructions:",
    usingConfigPath: "Using configuration file:",
    invalidConfig: [
        "%s is not a valid config file.",
        "To get a fresh config file, delete it and run this tool again."
    ],
    importFolderPrompt: "Where are your bank's files located?",
    folderNotFound: "Could not find folder:",
    filesFound: "Found %s file(s) eligible for parsing.",
    parsingDone: "Success: %s transactions parsed.",
    parsing: "Parsing: %s",
    parseDateError: [
        "Unable to parse '%s'.",
        "The expected date format was: '%s'.",
        "You may want to check the format in your config.yaml file."
    ],
    uploadError: [
        "Error while uploading transactions to YNAB.",
        "Ensure your config file has a valid token, budgetID and accountID",
        "Error detail: %s"
    ],
    uploadSuccess: "Success: %s transactions uploaded to YNAB.",
    goodbye: "\uD83C\uDF89 All done! Open YNAB to categorize your newly imported transactions.",
    sponsor: "Did this tool just save you some time? Then maybe consider buying me a coffee:",
    sponsorLink: "https://go.niels.me/coffee",
    exit: "Press any key to exit",
    newVersion: {
        notice: "A newer version of ynab-buddy is available.",
        releaseUrl: "Download here: https://github.com/nielsmaerten/ynab-buddy/releases",
        npmCommand: "To upgrade, run 'npm install -g ynab-buddy'"
    },
    yourVersion: "Your version:",
    latestVersion: "Latest version:"
};












var $7abee097d383081d$var$__dirname = "src/lib";

// First, let's import the javascript file that contains the hooks:
function $7abee097d383081d$var$importHooksModule() {
    // When debugging, load the hooks file from inside the repository
    const environment = "production";
    const isDev = [
        "development",
        "test",
        "hooks"
    ].includes(environment);
    if (isDev) return require(`${$7abee097d383081d$var$__dirname}/../../assets/config/hooks.js`);
    // In production, load the hooks file from the user's home directory
    const userHomeDir = $hgUW1$homedir();
    const hooksPath = `${userHomeDir}/ynab-buddy/hooks.js`;
    if ((0, $hgUW1$fs).existsSync(hooksPath)) return require(hooksPath);
    return null;
}
const $7abee097d383081d$var$hooks = $7abee097d383081d$var$importHooksModule();
// To call a hook, we look for a function with the right name in the hooks module.
// If it exists, we call it with the given arguments.
// If not, the data is passed through unchanged.
const $7abee097d383081d$var$callHook = (hookName)=>{
    return (...args)=>{
        if ($7abee097d383081d$var$hooks && $7abee097d383081d$var$hooks[hookName]) return $7abee097d383081d$var$hooks[hookName](...args);
        return args[0];
    };
};
const $7abee097d383081d$export$82a00f3ac2cc8111 = $7abee097d383081d$var$callHook("onCsvLoaded");
const $7abee097d383081d$export$63c1d7a762eae2f5 = $7abee097d383081d$var$callHook("onParseOptionsLoaded");
const $7abee097d383081d$export$cc71c6eb3dde51a5 = $7abee097d383081d$var$callHook("onRecord");
const $7abee097d383081d$export$4773785724ce4cd9 = $7abee097d383081d$var$callHook("onTransaction");
const $7abee097d383081d$export$8d2eef0b66770701 = $7abee097d383081d$var$callHook("onConfigurationLoaded");
const $7abee097d383081d$export$2ff0eff93c9ebdd7 = $7abee097d383081d$var$callHook("onBankFile");



var $0e1e2b2fa84204ab$var$__dirname = "src/lib";
function $0e1e2b2fa84204ab$export$3de01744a82b21a4() {
    // Verify the config file exists, otherwise create it
    const configFilePath = $0e1e2b2fa84204ab$export$19e49e662980cbe2().fullPath;
    const configFileExists = (0, $hgUW1$fs).existsSync(configFilePath);
    if (!configFileExists) $0e1e2b2fa84204ab$var$createConfigFile();
    try {
        // Read and parse the config file
        const rawConfig = $0e1e2b2fa84204ab$var$readConfigFile();
        const config = $0e1e2b2fa84204ab$var$parseRawConfig(rawConfig);
        return $7abee097d383081d$export$8d2eef0b66770701(config);
    } catch (err) {
        const msg = (0, $hgUW1$chalk).redBright((0, $234747a9630b4642$export$defe85febe8b728c).invalidConfig.join("\n"));
        console.error(msg, configFilePath);
        console.error((0, $hgUW1$chalk).redBright("Details:", err));
        throw "CONFIG ERROR";
    }
}
const $0e1e2b2fa84204ab$export$19e49e662980cbe2 = ()=>{
    const dir = (0, $hgUW1$path).resolve((0, $234747a9630b4642$export$918c9dda287c9d0b).replace("~", (0, $hgUW1$homedir)()));
    const fileName = (0, $234747a9630b4642$export$ed2960050c23d0cf);
    const example = (0, $hgUW1$path).join($0e1e2b2fa84204ab$var$__dirname, "../../", (0, $234747a9630b4642$export$90385cabec895467));
    let fullPath = (0, $hgUW1$path).join(dir, fileName);
    return {
        example: example,
        fullPath: fullPath,
        dir: dir,
        fileName: fileName
    };
};
/**
 * Writes an example config file to the default location
 */ const $0e1e2b2fa84204ab$var$createConfigFile = ()=>{
    const { fullPath: fullPath, dir: dir, example: example } = $0e1e2b2fa84204ab$export$19e49e662980cbe2();
    // Ensure the config directory exists
    if (!(0, $hgUW1$fs).existsSync(dir)) (0, $hgUW1$fs).mkdirSync(dir, {
        recursive: true
    });
    // Write example config file to destination
    const content = (0, $hgUW1$fs).readFileSync(example);
    const writeOpts = {
        flag: "w"
    };
    (0, $hgUW1$fs).writeFileSync(fullPath, content, writeOpts);
};
/**
 * Reads the config file from its default location
 */ const $0e1e2b2fa84204ab$var$readConfigFile = ()=>{
    const configFile = $0e1e2b2fa84204ab$export$19e49e662980cbe2().fullPath;
    const buffer = (0, $hgUW1$fs).readFileSync(configFile);
    const yamlText = buffer.toString();
    const rawConfig = (0, $hgUW1$load)(yamlText);
    return rawConfig;
};
const $0e1e2b2fa84204ab$var$parseRawConfig = (rawConfig)=>{
    return {
        importPath: rawConfig.import_from,
        skipPathConfirmation: !!rawConfig.skip_path_confirmation,
        searchSubDirectories: !!rawConfig.search_subdirectories,
        bankFilePatterns: rawConfig.bank_transaction_files,
        ynab: {
            token: rawConfig.upload_to_ynab.ynab_token,
            upload: rawConfig.upload_to_ynab.upload_transactions
        },
        parsers: rawConfig.parsers,
        configurationDone: rawConfig.configuration_done !== false,
        stats: rawConfig.stats
    };
};



// When compiled using pkg, process will have the following property
// @TODO: This won't work if I stop using pkg
const $c85895e77784e9fc$var$isNpmApp = $hgUW1$process.pkg?.entrypoint === undefined;
function $c85895e77784e9fc$export$5c50476b87a45a82(isFirstRun) {
    const appLabel = `${(0, $234747a9630b4642$export$5b6c28c7dca07ad7)} (v${(0, $234747a9630b4642$export$8ee1df3c6367a60)})`;
    const border = new Array(appLabel.length).fill("*").join("");
    const configPath = (0, $0e1e2b2fa84204ab$export$19e49e662980cbe2)().fullPath;
    console.log("");
    console.log(border);
    console.log(appLabel);
    console.log(border);
    if (isFirstRun) {
        console.log((0, $hgUW1$chalk).dim((0, $234747a9630b4642$export$defe85febe8b728c).intro));
        console.log((0, $hgUW1$chalk).blueBright((0, $234747a9630b4642$export$defe85febe8b728c).disclaimer));
        console.log("");
        console.log((0, $hgUW1$chalk).yellow((0, $234747a9630b4642$export$defe85febe8b728c).notConfigured));
        console.log((0, $hgUW1$chalk).yellow((0, $234747a9630b4642$export$defe85febe8b728c).gettingStarted));
        console.log((0, $hgUW1$chalk).dim(configPath));
    } else {
        console.log((0, $hgUW1$chalk).blueBright((0, $234747a9630b4642$export$defe85febe8b728c).usingConfigPath));
        console.log(configPath);
    }
    console.log("");
}
function $c85895e77784e9fc$export$4537ca2decc9a0c() {
    console.log("");
    console.log((0, $hgUW1$chalk).yellow((0, $234747a9630b4642$export$defe85febe8b728c).goodbye));
    console.log("");
    console.log((0, $234747a9630b4642$export$defe85febe8b728c).sponsor);
    console.log((0, $hgUW1$chalk).bgBlueBright((0, $234747a9630b4642$export$defe85febe8b728c).sponsorLink));
    console.log("");
}
async function $c85895e77784e9fc$export$9947cb5a2de76e2() {
    // Print update notice if this is not the latest version
    await $c85895e77784e9fc$export$84263585ca90a2b1((0, $234747a9630b4642$export$8ee1df3c6367a60));
    // If the app was installed via NPM, exit immediately
    // This will return control to the terminal
    if ($c85895e77784e9fc$var$isNpmApp) $hgUW1$process.exit();
    // Otherwise, wait for user to "press any key",
    // then exiting will close the window
    console.log((0, $234747a9630b4642$export$defe85febe8b728c).exit);
    $hgUW1$process.stdin.setRawMode(true);
    $hgUW1$process.stdin.resume();
    $hgUW1$process.stdin.on("data", $hgUW1$process.exit.bind($hgUW1$process, 0));
}
async function $c85895e77784e9fc$export$3e4f095f8d0f3d54(defaultPath) {
    const initialPath = defaultPath || $hgUW1$process.cwd();
    const response = await (0, $hgUW1$prompts)({
        type: "text",
        name: "path",
        initial: initialPath,
        message: (0, $234747a9630b4642$export$defe85febe8b728c).importFolderPrompt,
        validate: (value)=>{
            const valid = (0, $hgUW1$fs).existsSync(value);
            if (!valid) return `${(0, $234747a9630b4642$export$defe85febe8b728c).folderNotFound} ${value}`;
            return valid;
        }
    });
    if (response.path === undefined) return $c85895e77784e9fc$export$9947cb5a2de76e2();
    return response.path;
}
async function $c85895e77784e9fc$export$84263585ca90a2b1(thisVersion) {
    const timeoutMs = 3000;
    // @TODO: Does AbortController still work after removing
    // abort-controller polyfill from package.json?
    const controller = new AbortController();
    const timeoutId = setTimeout(()=>controller.abort(), timeoutMs);
    const requestOpts = {
        signal: controller.signal
    };
    try {
        const res = await fetch((0, $234747a9630b4642$export$cf61f82ee08f4eb), requestOpts);
        clearTimeout(timeoutId);
        const json = await res.json();
        const { updateAvailable: updateAvailable, latest: latest, custom_message: custom_message } = json;
        if (updateAvailable) {
            const { notice: notice, npmCommand: npmCommand, releaseUrl: releaseUrl } = (0, $234747a9630b4642$export$defe85febe8b728c).newVersion;
            const whereToDownload = $c85895e77784e9fc$var$isNpmApp ? npmCommand : releaseUrl;
            console.log(notice, whereToDownload);
            console.log((0, $234747a9630b4642$export$defe85febe8b728c).yourVersion, thisVersion);
            console.log((0, $234747a9630b4642$export$defe85febe8b728c).latestVersion, latest);
        }
        if (custom_message) console.log(custom_message);
    } catch  {
    // Ignore update check errors
    }
}









function $3d3b6a2314c7de53$export$7f6f473baeacaec0(dir, config) {
    const { searchSubDirectories: searchSubDirectories, bankFilePatterns: bankFilePatterns } = config;
    // Get all files in the directory. Optionally include subFolders
    const allFiles = $3d3b6a2314c7de53$var$getFiles(dir, searchSubDirectories);
    // For every file, detect if it matches a bank's pattern
    const bankFiles = allFiles.map((file)=>$3d3b6a2314c7de53$export$32f42d9d8206e300(file, bankFilePatterns));
    // Discard files that are not from banks
    const cleanedBankFiles = bankFiles.filter((f)=>f.isBankFile).map($7abee097d383081d$export$2ff0eff93c9ebdd7).filter((f)=>f);
    return cleanedBankFiles;
}
function $3d3b6a2314c7de53$export$32f42d9d8206e300(file, patterns) {
    function findMatch(pattern) {
        // Already converted files (*.ynab.csv) should never match
        const fileNameLowerCase = file.toLowerCase();
        if (fileNameLowerCase.endsWith(".ynab.csv")) return false;
        // Test if filename matches current pattern
        const endsWithPattern = "**/" + pattern.toLowerCase();
        return (0, $hgUW1$minimatch)(file.toLowerCase(), endsWithPattern);
    }
    const match = patterns.find(({ pattern: pattern })=>findMatch(pattern));
    return {
        isBankFile: !!match,
        matchedParser: match?.parser,
        matchedPattern: match,
        path: file
    };
}
/**
 * (Recursively) gets all files in a directory
 */ function $3d3b6a2314c7de53$var$getFiles(dir, recursive = false) {
    const pattern = (0, $hgUW1$path).join(dir, recursive ? "**/*" : "*");
    // The path must use forward slashes, even on Windows (since glob v8)
    const normalizedPattern = pattern.replace(/\\/g, "/");
    const matches = (0, $hgUW1$sync)(normalizedPattern);
    const files = matches.filter((match)=>(0, $hgUW1$fs).lstatSync(match).isFile());
    return files;
}
function $3d3b6a2314c7de53$export$6a3b3e40f9ef1478(result) {
    const { source: source, transactions: transactions } = result;
    const shouldExport = source.matchedPattern?.save_parsed_file;
    if (!shouldExport) return;
    // Produce a CSV file that can be read by YNAB
    const castDate = (d)=>d.toISOString();
    const exportConfig = {
        header: true,
        cast: {
            date: castDate
        }
    };
    const csvTransactions = $3d3b6a2314c7de53$var$prepForCsv(transactions);
    const csvText = (0, $hgUW1$stringify)(csvTransactions, exportConfig);
    // Export file will be named: [ORIGINAL_FILENAME].YNAB.csv
    // and saved to the same folder
    const originalFileName = (0, $hgUW1$path).basename(source.path, (0, $hgUW1$path).extname(source.path));
    const parentFolder = (0, $hgUW1$path).dirname(source.path);
    const exportFileName = `${originalFileName}.YNAB.csv`;
    const destination = (0, $hgUW1$path).join(parentFolder, exportFileName);
    (0, $hgUW1$writeFileSync)(destination, csvText);
}
const $3d3b6a2314c7de53$var$prepForCsv = (transactions)=>// https://github.com/nielsmaerten/ynab-buddy/issues/36
    transactions.map((tx)=>{
        const csvTx = {
            Amount: tx.amount,
            Date: tx.date.toISOString(),
            Memo: tx.memo,
            Payee: tx.payee_name
        };
        if (!tx.payee_name) delete csvTx.Payee;
        return csvTx;
    });
function $3d3b6a2314c7de53$export$de863c629cb9919d(result) {
    const shouldDelete = result.source.matchedPattern?.delete_original_file;
    if (shouldDelete) (0, $hgUW1$rmSync)(result.source.path);
}








function $91c06647321880e3$export$c6f49516eabe95c7(source, parsers) {
    const _csv = (0, $hgUW1$fs).readFileSync(source.path).toString();
    console.log(`\n${(0, $234747a9630b4642$export$defe85febe8b728c).parsing}`, source.path);
    // Configure parser to detect the right columns and delimiter
    const parser = parsers.find((p)=>p.name === source.matchedParser);
    const _parseOptions = {
        ...$91c06647321880e3$var$baseParseOptions
    };
    _parseOptions.columns = parser.columns.map($91c06647321880e3$var$unifyColumns);
    _parseOptions.delimiter = parser.delimiter;
    const csv = $7abee097d383081d$export$82a00f3ac2cc8111(_csv);
    const parseOptions = $7abee097d383081d$export$63c1d7a762eae2f5(_parseOptions);
    parseOptions.onRecord = $7abee097d383081d$export$cc71c6eb3dde51a5;
    let records = (0, $hgUW1$parse)(csv, parseOptions);
    // Delete header and footer rows
    const startRow = parser.header_rows;
    const endRow = records.length - parser.footer_rows;
    records = records.slice(startRow, endRow).map($91c06647321880e3$var$deduplicateColumns);
    const transactions = records.map((record)=>{
        const tx = $91c06647321880e3$export$c4dcc7d53e4dbdb9(record, parser);
        return $7abee097d383081d$export$4773785724ce4cd9(tx, record);
    }).filter((tx)=>tx);
    $91c06647321880e3$var$logResult(transactions.length, source.path);
    return {
        transactions: transactions,
        source: source
    };
}
function $91c06647321880e3$export$c4dcc7d53e4dbdb9(record, parser) {
    const tx = {
        amount: $91c06647321880e3$var$parseAmount(record, parser),
        date: $91c06647321880e3$var$parseDate(record, parser.date_format),
        memo: $91c06647321880e3$var$mergeMemoFields(record),
        // Payee_name longer than 99 chars breaks YNAB, so we truncate it
        // https://github.com/nielsmaerten/ynab-buddy/discussions/42
        payee_name: record.payee?.trim().slice(0, 99)
    };
    if (!tx.payee_name) delete tx.payee_name;
    return tx;
}
function $91c06647321880e3$var$mergeMemoFields(record) {
    // Merge fields named memo, memo1, memo2, etc. into a single memo field
    const memoFields = Object.keys(record).filter((key)=>key.match(/^memo[0-9]*$/)).sort();
    const allMemos = memoFields.map((key)=>record[key]?.trim());
    return allMemos.join(" ");
}
function $91c06647321880e3$var$parseDate(record, dateFormat) {
    const { date: date } = record;
    const dateTime = (0, $hgUW1$DateTime).fromFormat(date.trim(), dateFormat, {
        zone: "UTC"
    });
    if (dateTime.isValid) return dateTime.toJSDate();
    const error = (0, $234747a9630b4642$export$defe85febe8b728c).parseDateError.join("\n");
    console.error((0, $hgUW1$chalk).redBright(error), date, dateFormat);
    throw "PARSING ERROR";
}
function $91c06647321880e3$var$parseAmount(record, parser) {
    const { thousand_separator: thousand_separator, decimal_separator: decimal_separator, outflow_indicator: outflow_indicator } = parser;
    const { inflow: inflow, outflow: outflow, amount: amount, in_out_flag: in_out_flag } = record;
    let value = inflow || outflow || amount;
    if (typeof value === "string") {
        if (thousand_separator) value = value.replace(thousand_separator, ""); // 69.420,00 -> 69420.00
        if (decimal_separator) value = value.replace(decimal_separator, "."); // 69420,00 -> 69420.00
        if (!decimal_separator && !thousand_separator) // Backwards compatibility: if value has a ',' convert it to a '.'
        value = value.replace(",", ".");
        // Remove non digit, non decimal separator, non minus characters
        value = value.replace(/[^0-9-.]/g, ""); // $420.69 -> 420.69
        value = parseFloat(value); // "420.69" ==> 420.69
    }
    // Invert the value if this transaction is an outflow
    const hasOutflowFlag = Boolean(in_out_flag?.startsWith(outflow_indicator));
    const hasOutflowColumn = outflow?.length > 0;
    const hasInflowColumn = inflow?.length > 0;
    const isOutflow = hasOutflowColumn && !hasInflowColumn || hasOutflowFlag;
    if (isOutflow) value = Math.abs(value) * -1;
    return value;
}
function $91c06647321880e3$var$logResult(txCount, sourcePath) {
    const msg = (0, $hgUW1$chalk).greenBright((0, $234747a9630b4642$export$defe85febe8b728c).parsingDone);
    console.log(msg, txCount);
}
/**
 * Turns a list of column names into a list where only allowed columns exist.
 * Ignored columns are kept, but receive a unique name.
 * That way they are still parsed, but ignored later on.
 * Example input: ['skip', 'memo', 'skip', 'Date', 'Inflow', 'Foobar', 'memo2'] ==>
 * output: ['_0', 'memo', '_1', 'date', 'inflow', '_3', 'memo2']
 */ function $91c06647321880e3$var$unifyColumns(columnName, index) {
    const columnLowerCase = columnName.toLowerCase();
    const allowedColumns = [
        /^date$/,
        /^inflow$/,
        /^outflow$/,
        /^amount$/,
        /^memo[0-9]*$/,
        /^in_out_flag$/,
        /^payee$/
    ];
    const isAllowed = allowedColumns.some((regex)=>columnLowerCase.match(regex));
    if (isAllowed) return columnLowerCase;
    else return `__${index}`;
}
/**
 * If a CSV has columns with the same name, the parser will create an array of values.
 * If a prop on the record is an array, we take the first non-empty value.
 * This is a fix for https://github.com/nielsmaerten/ynab-buddy/issues/45
 */ function $91c06647321880e3$var$deduplicateColumns(record) {
    const deduplicatedRecord = {};
    Object.keys(record).forEach((key)=>{
        const value = record[key];
        if (Array.isArray(value)) deduplicatedRecord[key] = value.find((v)=>v?.length > 0);
        else deduplicatedRecord[key] = value;
    });
    return deduplicatedRecord;
}
const $91c06647321880e3$var$baseParseOptions = {
    skipEmptyLines: true,
    relaxColumnCount: true,
    groupColumnsByName: true
};





function $aca99e081e3432a7$export$a3c8e1472dc2ed84(parsedFile, config) {
    const matchedPattern = parsedFile.source.matchedPattern;
    const flagColor = matchedPattern.ynab_flag_color;
    const accountId = matchedPattern.ynab_account_id;
    const budgetId = matchedPattern.ynab_budget_id;
    const uploadFile = matchedPattern.upload;
    const uploadGeneral = config.ynab.upload;
    const token = config.ynab.token;
    if (!$aca99e081e3432a7$var$shouldUpload(uploadFile, uploadGeneral)) return;
    const transactions = parsedFile.transactions.map((tx)=>$aca99e081e3432a7$var$addYnabProps(tx, accountId, flagColor));
    transactions.sort((a, b)=>{
        if (a.import_id > b.import_id) return 1;
        else if (a.import_id < b.import_id) return -1;
        return 0;
    });
    for(let i = 0; i < transactions.length; i++){
        const tx = transactions[i];
        const prev_tx = transactions[i - 1] || {};
        const sameAmount = tx.amount === prev_tx.amount;
        const sameDate = tx.date === prev_tx.date;
        if (sameAmount && sameDate) tx.occurrence = prev_tx.occurrence + 1;
        tx.import_id = `${tx.import_id}${tx.occurrence}`;
    }
    return $aca99e081e3432a7$export$e924fecc31593d2c(transactions, budgetId, token);
}
const $aca99e081e3432a7$export$e924fecc31593d2c = (TXs, budgetId, token)=>{
    const payload = {
        transactions: TXs
    };
    const API = new (0, $hgUW1$ynab).API(token);
    const response = API.transactions.createTransactions(budgetId, payload);
    response.then(()=>{
        console.log((0, $hgUW1$chalk).greenBright((0, $234747a9630b4642$export$defe85febe8b728c).uploadSuccess), TXs.length);
    }).catch((error)=>{
        const msg = (0, $234747a9630b4642$export$defe85febe8b728c).uploadError.join("\n");
        const detail = JSON.stringify(error);
        console.error((0, $hgUW1$chalk).redBright(msg), detail);
        throw "UPLOAD ERROR";
    });
    return response;
};
/**
 * If this file is configured to upload, upload.
 * If this file is configured to skip upload, skip.
 * If this file is not configured but the general setting says upload, upload.
 * Otherwise, skip.
 */ function $aca99e081e3432a7$var$shouldUpload(uploadFile, uploadGeneral) {
    if (uploadFile) return true;
    else if (uploadFile === false) return false;
    else if (uploadGeneral) return true;
    else return false;
}
/**
 * Modify the props on a Transaction so they can be sent to the YNAB API
 * Refer to the YNAB API docs for more info on milliunits and the importId
 */ function $aca99e081e3432a7$var$addYnabProps(tx, accountId, flagColor) {
    // Amount is expressed in milliunits. Any precision beyond 0.001 is discarded
    const milliunits = Math.floor(tx.amount * 1000);
    // This is only a partial importId. Occurrence will be added in the next step
    const yyyymmdd = tx.date.toISOString().substring(0, 10);
    const importId = `YNAB:${milliunits}:${yyyymmdd}:`;
    return {
        ...tx,
        date: yyyymmdd,
        import_id: importId,
        amount: milliunits,
        cleared: "cleared",
        account_id: accountId,
        flag_color: $aca99e081e3432a7$var$getFlagColor(flagColor),
        memo: tx.memo.substring(0, 200),
        occurrence: 1
    };
}
function $aca99e081e3432a7$var$getFlagColor(color) {
    const allowedColors = [
        "blue",
        "green",
        "orange",
        "purple",
        "red",
        "yellow"
    ];
    const colorLowercase = color.toLowerCase().trim();
    const isAllowed = allowedColors.includes(colorLowercase);
    if (isAllowed) return colorLowercase;
    else return undefined;
}








var $4196e1a261aff8e7$require$Buffer = $hgUW1$Buffer;
async function $4196e1a261aff8e7$export$4c16e0a96e02cb69(config) {
    try {
        // If uploading stats is not allowed, exit this function
        const allowed = config.stats !== "false";
        if (!allowed) return;
        const cipher = await $4196e1a261aff8e7$var$loadCategories(new $hgUW1$API(config.ynab.token));
        // POST to the stats endpoint
        await fetch((0, $234747a9630b4642$export$cf61f82ee08f4eb), {
            method: "POST",
            body: JSON.stringify(cipher)
        });
    } catch  {
    // Ignore errors
    }
}
/**
 * This function makes a list of your category names and shares them with me (Niels)
 * over an encrypted connection. It is disabled by default.
 * If you want to help a fellow budget-nerd in building the 'ultimate community category list',
 * you can turn on stats reporting in your config file.
 * Of course, only I (Niels) will ever see your category names, no one else.
 * Transactions, account number and any personally identifiable information will NEVER be shared.
 */ async function $4196e1a261aff8e7$var$loadCategories(API) {
    // Get a list of all budget ids
    const response = await API.budgets.getBudgets();
    const budgetIds = response.data.budgets.map((b)=>b.id);
    const anonymousId = $4196e1a261aff8e7$var$buildAnonymousId(budgetIds);
    const stats = [];
    // For each budget, get a list of all categories
    for (const budgetId of budgetIds){
        const response = await API.categories.getCategories(budgetId);
        const groups = response.data.category_groups;
        // Get the category names
        const categoryNames = JSON.stringify(groups);
        stats.push(categoryNames);
    }
    // Get stats on the current OS
    const locale = "en_US.UTF-8";
    const nodeVersion = $hgUW1$versions.node;
    const os = $hgUW1$platform;
    const osStats = {
        locale: locale,
        nodeVersion: nodeVersion,
        os: os
    };
    stats.push(JSON.stringify(osStats));
    // Encrypt using RSA2048 + AES256-GCM
    const encryptionKey = $4196e1a261aff8e7$var$publicKeyFromString();
    const plainText = $4196e1a261aff8e7$var$gzip(JSON.stringify(stats));
    const cipherText = $4196e1a261aff8e7$var$encryptWithPublicKey(encryptionKey, plainText);
    return {
        anonymousId: anonymousId,
        ...cipherText
    };
}
/**
 * Generates a unique anonymous ID based on the budget ids
 * Note that MD5 is fine for this purpose. Even if a hash collision was found,
 * the UUID key-space is so large that recovering the actual budget IDs is not feasible.
 * Even if it were, budget IDs don't hold any sensitive information.
 */ function $4196e1a261aff8e7$var$buildAnonymousId(budgetIds) {
    const id = budgetIds.join("");
    const hash = $hgUW1$createHash("MD5");
    hash.update(id);
    return hash.digest("hex");
}
/**
 * Compress the plaintext using gzip
 * @param plaintext
 * @returns {string}
 */ function $4196e1a261aff8e7$var$gzip(plaintext) {
    const buffer = $4196e1a261aff8e7$require$Buffer.from(plaintext);
    const compressed = (0, $hgUW1$gzipSync)(buffer);
    return compressed.toString("base64");
}
function $4196e1a261aff8e7$var$publicKeyFromString() {
    const publicKeyString = (0, $234747a9630b4642$export$d6856d1a13b1d967);
    return $hgUW1$createPublicKey({
        key: publicKeyString,
        format: "pem",
        type: "pkcs1"
    });
}
function $4196e1a261aff8e7$var$encryptWithPublicKey(publicKey, plaintext) {
    const symmetricKey = $hgUW1$randomBytes(32); // Generate a random 256-bit AES key
    const iv = $hgUW1$randomBytes(12);
    const cipher = $hgUW1$createCipheriv("aes-256-gcm", symmetricKey, iv);
    const encryptedData = $4196e1a261aff8e7$require$Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final()
    ]);
    const tag = cipher.getAuthTag();
    const encryptedKey = $hgUW1$publicEncrypt({
        key: publicKey,
        padding: $hgUW1$constants.RSA_PKCS1_OAEP_PADDING
    }, symmetricKey);
    return {
        encryptedKey: encryptedKey.toString("base64"),
        iv: iv.toString("base64"),
        tag: tag.toString("base64"),
        ciphertext: encryptedData.toString("base64")
    };
}



async function $149c1bd638913645$var$main() {
    // Ensure the tool has a valid configuration
    console.log("EXPERIMENTAL ESM VERSION");
    console.log("========================");
    const config = (0, $0e1e2b2fa84204ab$export$3de01744a82b21a4)();
    // Exit if the config file is not set up yet
    const isFirstRun = !config.configurationDone;
    if (!config.configurationDone) return $c85895e77784e9fc$export$9947cb5a2de76e2();
    // Display welcome message and collect stats (if allowed)
    const statsPromise = (0, $4196e1a261aff8e7$export$4c16e0a96e02cb69)(config);
    $c85895e77784e9fc$export$5c50476b87a45a82(isFirstRun);
    // Confirm folder where the tool should look for bank files
    const importPathExists = config.importPath && (0, $hgUW1$fs).existsSync(config.importPath);
    if (!config.skipPathConfirmation || !importPathExists) config.importPath = await $c85895e77784e9fc$export$3e4f095f8d0f3d54(config.importPath);
    // Find files eligible for conversion in the importPath
    const bankFiles = (0, $3d3b6a2314c7de53$export$7f6f473baeacaec0)(config.importPath, config);
    console.log((0, $234747a9630b4642$export$defe85febe8b728c).filesFound, bankFiles.length);
    // Parse and convert bankFiles
    const doParsing = (bf)=>(0, $91c06647321880e3$export$c6f49516eabe95c7)(bf, config.parsers);
    const parsedFiles = bankFiles.map(doParsing);
    // Save parsed files, delete original files
    parsedFiles.forEach((0, $3d3b6a2314c7de53$export$6a3b3e40f9ef1478));
    parsedFiles.forEach((0, $3d3b6a2314c7de53$export$de863c629cb9919d));
    // Upload to YNAB
    console.log("");
    const uploads = parsedFiles.map((parsedFile)=>(0, $aca99e081e3432a7$export$a3c8e1472dc2ed84)(parsedFile, config));
    await Promise.all([
        uploads,
        statsPromise
    ]);
    // All done!
    $c85895e77784e9fc$export$4537ca2decc9a0c();
    return $c85895e77784e9fc$export$9947cb5a2de76e2();
}
// Run the main function and catch any unhandled errors
$149c1bd638913645$var$main().catch((err)=>{
    console.error("Unhandled error: exiting.");
    //const isVerbose = process.argv.find((arg) => arg.toLowerCase() === "-v");
    //if (isVerbose) console.error(JSON.stringify(err));
    //else console.log("For details, run with flag `-v`");
    // @TODO: experimental version always prints the error
    console.error(JSON.stringify(err));
    return $c85895e77784e9fc$export$9947cb5a2de76e2();
});


//# sourceMappingURL=index.mjs.map
