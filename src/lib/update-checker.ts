/**
 * Compares two semantic version strings.
 * @param version1 First version string (e.g., "2.0.5")
 * @param version2 Second version string (e.g., "2.1.0")
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
function compareVersions(version1: string, version2: string): number {
  // Remove 'v' prefix if present and extract major.minor.patch only
  const v1 = version1.replace(/^v/, "").split("-")[0];
  const v2 = version2.replace(/^v/, "").split("-")[0];

  const parts1 = v1.split(".");
  const parts2 = v2.split(".");

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parseInt(parts1[i] || "0", 10);
    const num2 = parseInt(parts2[i] || "0", 10);

    // If parsing failed, treat as 0
    const val1 = isNaN(num1) ? 0 : num1;
    const val2 = isNaN(num2) ? 0 : num2;

    if (val1 < val2) return -1;
    if (val1 > val2) return 1;
  }

  return 0;
}

/**
 * Fetches the version from package.json of the latest release.
 * @param owner Repository owner
 * @param repo Repository name
 * @param timeout Timeout in milliseconds
 * @returns Version string from package.json, or null if failed
 */
async function fetchLatestReleaseVersion(
  owner: string,
  repo: string,
  timeout: number,
): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const requestOpts = { signal: controller.signal };

  try {
    // First, get the latest release to find the tag name
    const releaseUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
    const releaseRes = await fetch(releaseUrl, requestOpts);

    if (!releaseRes.ok) {
      clearTimeout(timeoutId);
      return null;
    }

    const releaseJson = await releaseRes.json();
    const tagName = releaseJson.tag_name;

    if (!tagName) {
      clearTimeout(timeoutId);
      return null;
    }

    // Fetch package.json from the tagged commit
    const packageUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${tagName}/package.json`;
    const packageRes = await fetch(packageUrl, requestOpts);
    clearTimeout(timeoutId);

    if (!packageRes.ok) {
      return null;
    }

    const packageJson = await packageRes.json();
    return packageJson.version || null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Checks if an update is available by comparing the current version with the latest GitHub release.
 * @param currentVersion Current version of the application
 * @param owner Repository owner
 * @param repo Repository name
 * @param timeoutMs Timeout in milliseconds (default: 3000)
 * @returns Object with updateAvailable flag and latest version, or null if check failed
 */
export async function checkForUpdate(
  currentVersion: string,
  owner: string,
  repo: string,
  timeoutMs: number = 3000,
): Promise<{ updateAvailable: boolean; latest: string } | null> {
  try {
    const latestVersion = await fetchLatestReleaseVersion(
      owner,
      repo,
      timeoutMs,
    );

    if (!latestVersion) {
      return null;
    }

    const updateAvailable = compareVersions(currentVersion, latestVersion) < 0;

    return {
      updateAvailable,
      latest: latestVersion,
    };
  } catch {
    return null;
  }
}
