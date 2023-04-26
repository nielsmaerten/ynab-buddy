import * as ynab from "ynab";
import * as crypto from "crypto";
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
 * This creates a list of your category names that will be shared as part
 * of the stats. Your transaction data will not be shared, and everything will be end-to-end encrypted.
 * As a Budget Nerd🤓 just love seeing other people's categories.
 * They'll only be viewable by me, nobody else.
 */
async function loadCategories(API: ynab.api) {
  // Get a list of all budget ids
  const response = await API.budgets.getBudgets();
  const budgetIds = response.data.budgets.map((b) => b.id);
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
  const plainText = JSON.stringify(stats);
  const cipherText = encryptWithPublicKey(encryptionKey, plainText);

  return cipherText;
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
