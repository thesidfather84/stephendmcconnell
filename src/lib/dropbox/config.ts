export function getDropboxConfig() {
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  const redirectUri = process.env.DROPBOX_REDIRECT_URI;

  if (!appKey || !appSecret || !redirectUri) {
    throw new Error(
      "Dropbox isn't configured yet. Set DROPBOX_APP_KEY, DROPBOX_APP_SECRET, and DROPBOX_REDIRECT_URI."
    );
  }

  return { appKey, appSecret, redirectUri };
}
