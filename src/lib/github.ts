export class GitHubPublishError extends Error {}

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token || !repo) {
    throw new GitHubPublishError(
      "Publishing isn't connected yet. Ask your web developer to finish the setup."
    );
  }

  return { token, repo, branch };
}

function apiHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function toBase64(input: string | Buffer): string {
  return Buffer.isBuffer(input) ? input.toString("base64") : Buffer.from(input, "utf8").toString("base64");
}

/** Reads a file from the repo. Returns null if it doesn't exist yet. */
export async function getRepoFile(
  path: string
): Promise<{ content: string; sha: string } | null> {
  const { token, repo, branch } = getConfig();

  const res = await fetch(
    `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`,
    { headers: apiHeaders(token), cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new GitHubPublishError("Couldn't read the website's content right now. Please try again shortly.");
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { content, sha: data.sha };
}

/** Creates or updates a file in the repo with a single commit to the configured branch. */
export async function putRepoFile({
  path,
  content,
  message,
  sha,
}: {
  path: string;
  content: string | Buffer;
  message: string;
  sha?: string;
}): Promise<void> {
  const { token, repo, branch } = getConfig();

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...apiHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: toBase64(content),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    if (res.status === 409) {
      throw new GitHubPublishError(
        "Someone else's changes were saved at the same time. Please try again."
      );
    }
    throw new GitHubPublishError("Publishing failed. Please try again, or contact your web developer.");
  }
}
