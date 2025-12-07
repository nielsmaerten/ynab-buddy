/**
 * Compares two semantic version strings.
 * @param version1 First version string (e.g., "2.0.5")
 * @param version2 Second version string (e.g., "2.1.0")
 * @returns -1 if version1 < version2, 0 if equal, 1 if version1 > version2
 */
function compareVersions(version1: string, version2: string): number {
  // Remove 'v' prefix if present
  const v1 = version1.replace(/^v/, "");
  const v2 = version2.replace(/^v/, "");

  const parts1 = v1.split(".").map(Number);
  const parts2 = v2.split(".").map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }

  return 0;
}

/**
 * Fetches the latest release information from GitHub.
 * @param owner Repository owner
 * @param repo Repository name
 * @param timeout Timeout in milliseconds
 * @returns Release information with tag_name, or null if failed
 */
async function fetchLatestRelease(
  owner: string,
  repo: string,
  timeout: number,
): Promise<{ tag_name: string } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  const requestOpts = { signal: controller.signal };

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
    const res = await fetch(url, requestOpts);
    clearTimeout(timeoutId);

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json;
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
    const release = await fetchLatestRelease(owner, repo, timeoutMs);

    if (!release || !release.tag_name) {
      return null;
    }

    const latestVersion = release.tag_name;
    const updateAvailable = compareVersions(currentVersion, latestVersion) < 0;

    return {
      updateAvailable,
      latest: latestVersion,
    };
  } catch {
    return null;
  }
}
