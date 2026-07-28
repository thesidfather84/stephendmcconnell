import { Dropbox, DropboxAuth } from "dropbox";
import { getDropboxConfig } from "./config";
import { getDropboxRefreshToken } from "./token-store";

/** Step 1 of the OAuth flow: where to send the admin to approve access. */
export async function buildAuthorizeUrl(state: string): Promise<string> {
  const { appKey, appSecret, redirectUri } = getDropboxConfig();
  const dbxAuth = new DropboxAuth({ clientId: appKey, clientSecret: appSecret });

  const url = await dbxAuth.getAuthenticationUrl(
    redirectUri,
    state,
    "code",
    "offline", // request a refresh token, not just a short-lived access token
    undefined,
    undefined,
    false
  );

  return url.toString();
}

/** Step 2: exchange the ?code=... Dropbox sent back for a refresh token + account info. */
export async function exchangeCodeForConnection(code: string): Promise<{
  refreshToken: string;
  dropboxAccountId: string;
  dropboxEmail: string;
}> {
  const { appKey, appSecret, redirectUri } = getDropboxConfig();
  const dbxAuth = new DropboxAuth({ clientId: appKey, clientSecret: appSecret });

  const response = await dbxAuth.getAccessTokenFromCode(redirectUri, code);
  const result = response.result as {
    refresh_token?: string;
    access_token: string;
    account_id: string;
  };

  if (!result.refresh_token) {
    throw new Error(
      "Dropbox did not return a refresh token. Make sure the app requests offline access."
    );
  }

  // Look up the account's email using the access token we just received.
  dbxAuth.setAccessToken(result.access_token);
  const dbx = new Dropbox({ auth: dbxAuth });
  const account = await dbx.usersGetCurrentAccount();

  return {
    refreshToken: result.refresh_token,
    dropboxAccountId: result.account_id,
    dropboxEmail: account.result.email,
  };
}

/**
 * A ready-to-use Dropbox API client, built from the stored refresh token.
 * Returns null if Dropbox has never been connected. Server-only.
 */
export async function getDropboxClient(): Promise<Dropbox | null> {
  const refreshToken = await getDropboxRefreshToken();
  if (!refreshToken) return null;

  const { appKey, appSecret } = getDropboxConfig();
  const dbxAuth = new DropboxAuth({ clientId: appKey, clientSecret: appSecret, refreshToken });
  await dbxAuth.refreshAccessToken();

  return new Dropbox({ auth: dbxAuth });
}

/**
 * Confirms the stored token still actually works by pinging Dropbox,
 * rather than just trusting that a row exists in the database.
 */
export async function pingDropboxConnection(): Promise<
  { ok: true; email: string } | { ok: false; error: string }
> {
  try {
    const dbx = await getDropboxClient();
    if (!dbx) return { ok: false, error: "Not connected." };

    const account = await dbx.usersGetCurrentAccount();
    return { ok: true, email: account.result.email };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Couldn't reach Dropbox.";
    return { ok: false, error: message };
  }
}
