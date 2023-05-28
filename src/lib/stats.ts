import * as ynab from "ynab";
import * as crypto from "crypto";
import { gzipSync } from "zlib";
import { Configuration } from "../types";
import { RSA_PUBLIC_KEY, UPDATE_CHECK_URL } from "../constants";

export async function collectStats(config: Configuration) {
  try {
    // If uploading stats is not allowed, exit this function
    const allowed = config.stats !== "false";
    if (!allowed) return;
    const cipher = await loadCategories(new ynab.API(config.ynab.token));
    // POST to the stats endpoint
    await fetch(UPDATE_CHECK_URL, {
      method: "POST",
      body: JSON.stringify(cipher),
    });
  } catch {}
}

/**
 * This function makes a list of your category names and shares them with me (Niels)
 * over an encrypted connection. It is disabled by default.
 * If you want to help a fellow budget-nerd in building the 'ultimate community category list',
 * you can turn on stats reporting in your config file.
 * Of course, only I (Niels) will ever see your category names, no one else.
 * Transactions, account number and any personally identifiable information will NEVER be shared.
 */
async function loadCategories(API: ynab.api) {
  // Get a list of all budget ids
  const response = await API.budgets.getBudgets();
  const budgetIds = response.data.budgets.map((b) => b.id);
  const anonymousId = buildAnonymousId(budgetIds);
  const stats = [];

  // For each budget, get a list of all categories
  for (const budgetId of budgetIds) {
    const response = await API.categories.getCategories(budgetId);
    const groups = response.data.category_groups;

    // Get the category names
    const categoryNames = JSON.stringify(groups);
    stats.push(categoryNames);
  }

  // Get stats on the current OS
  const locale = process.env.LANG;
  const nodeVersion = process.versions.node;
  const os = process.platform;
  const osStats = {
    locale,
    nodeVersion,
    os,
  };

  stats.push(JSON.stringify(osStats));

  // Encrypt using RSA2048 + AES256-GCM
  const encryptionKey = publicKeyFromString();
  const plainText = gzip(JSON.stringify(stats));
  const cipherText = encryptWithPublicKey(encryptionKey, plainText);

  return {
    anonymousId,
    ...cipherText,
  };
}

/**
 * Generates a unique anonymous ID based on the budget ids
 * Note that MD5 is fine for this purpose. Even if a hash collision was found,
 * the UUID key-space is so large that recovering the actual budget IDs is not feasible.
 * Even if it were, budget IDs don't hold any sensitive information.
 */
function buildAnonymousId(budgetIds: string[]) {
  const id = budgetIds.join("");
  const hash = crypto.createHash("MD5");
  hash.update(id);
  return hash.digest("hex");
}

/**
 * Compress the plaintext using gzip
 * @param plaintext
 * @returns {string}
 */
function gzip(plaintext: string) {
  const buffer = Buffer.from(plaintext);
  const compressed = gzipSync(buffer);
  return compressed.toString("base64");
}

function publicKeyFromString() {
  const publicKeyString = RSA_PUBLIC_KEY;
  return crypto.createPublicKey({
    key: publicKeyString,
    format: "pem",
    type: "pkcs1",
  });
}

function encryptWithPublicKey(publicKey: crypto.KeyObject, plaintext: string) {
  const symmetricKey = crypto.randomBytes(32); // Generate a random 256-bit AES key
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", symmetricKey, iv);

  const encryptedData = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    symmetricKey
  );

  return {
    encryptedKey: encryptedKey.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    ciphertext: encryptedData.toString("base64"),
  };
}
