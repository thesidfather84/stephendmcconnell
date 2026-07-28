/**
 * Hand-written types for the tables app code reads/writes today. Once the
 * migrations in supabase/migrations have been run against the live project,
 * regenerate full types with:
 *
 *   npx supabase gen types typescript --project-id <your-project-ref> > src/lib/supabase/types.ts
 *
 * and this file can be replaced wholesale.
 */
export type ProfileRole = "admin" | "viewer";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: ProfileRole;
  created_at: string;
};

export type DropboxConnectionRow = {
  id: number;
  encrypted_refresh_token: string | null;
  token_iv: string | null;
  token_auth_tag: string | null;
  dropbox_account_id: string | null;
  dropbox_email: string | null;
  connected_by: string | null;
  connected_at: string | null;
  updated_at: string;
};

export type AuditLogRow = {
  id: string;
  admin_user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      dropbox_connection: {
        Row: DropboxConnectionRow;
        Insert: Partial<DropboxConnectionRow> & { id: 1 };
        Update: Partial<DropboxConnectionRow>;
        Relationships: [];
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: Partial<Omit<AuditLogRow, "id" | "created_at">>;
        Update: Partial<AuditLogRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
