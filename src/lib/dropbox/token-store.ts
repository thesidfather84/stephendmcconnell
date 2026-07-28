import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { decryptSecret, encryptSecret } from "./crypto";

export type DropboxConnection = {
  connected: boolean;
  dropboxAccountId: string | null;
  dropboxEmail: string | null;
  connectedAt: string | null;
};

/** Encrypts and stores the Dropbox refresh token (server-only, service role). */
export async function saveDropboxConnection(params: {
  refreshToken: string;
  dropboxAccountId: string;
  dropboxEmail: string;
  connectedBy: string;
}): Promise<void> {
  const { ciphertext, iv, authTag } = encryptSecret(params.refreshToken);
  const supabase = createAdminSupabaseClient();

  const { error } = await supabase.from("dropbox_connection").upsert({
    id: 1,
    encrypted_refresh_token: ciphertext,
    token_iv: iv,
    token_auth_tag: authTag,
    dropbox_account_id: params.dropboxAccountId,
    dropbox_email: params.dropboxEmail,
    connected_by: params.connectedBy,
    connected_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to save Dropbox connection: ${error.message}`);
  }
}

/** Reads and decrypts the stored refresh token. Returns null if never connected. */
export async function getDropboxRefreshToken(): Promise<string | null> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("dropbox_connection")
    .select("encrypted_refresh_token, token_iv, token_auth_tag")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read Dropbox connection: ${error.message}`);
  }
  if (!data?.encrypted_refresh_token || !data.token_iv || !data.token_auth_tag) {
    return null;
  }

  return decryptSecret({
    ciphertext: data.encrypted_refresh_token,
    iv: data.token_iv,
    authTag: data.token_auth_tag,
  });
}

/** Connection status for the admin UI — never returns the token itself. */
export async function getDropboxConnectionStatus(): Promise<DropboxConnection> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("dropbox_connection")
    .select("dropbox_account_id, dropbox_email, connected_at, encrypted_refresh_token")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read Dropbox connection: ${error.message}`);
  }

  return {
    connected: Boolean(data?.encrypted_refresh_token),
    dropboxAccountId: data?.dropbox_account_id ?? null,
    dropboxEmail: data?.dropbox_email ?? null,
    connectedAt: data?.connected_at ?? null,
  };
}

/** Removes the stored connection (does not revoke on Dropbox's side). */
export async function clearDropboxConnection(): Promise<void> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("dropbox_connection")
    .update({
      encrypted_refresh_token: null,
      token_iv: null,
      token_auth_tag: null,
      dropbox_account_id: null,
      dropbox_email: null,
      connected_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    throw new Error(`Failed to clear Dropbox connection: ${error.message}`);
  }
}
