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

export type ProcessingStatus =
  | "pending"
  | "processing"
  | "processed"
  | "failed"
  | "needs_review";

export type DocumentRow = {
  id: string;
  dropbox_file_id: string | null;
  dropbox_path: string;
  dropbox_revision: string | null;
  content_hash: string | null;
  filename: string;
  display_title: string | null;
  file_extension: string | null;
  mime_type: string | null;
  file_size: number | null;
  modified_at_dropbox: string | null;
  document_type: string | null;
  processing_status: ProcessingStatus;
  processing_error: string | null;
  is_public: boolean;
  original_source_url: string | null;
  created_at: string;
  updated_at: string;
};

export type DocumentPageRow = {
  id: string;
  document_id: string;
  page_number: number;
  extracted_text: string | null;
  ocr_confidence: number | null;
  page_image_url: string | null;
  created_at: string;
};

export type PodcastEpisodeStatus =
  | "setup"
  | "recording"
  | "processing"
  | "draft"
  | "published"
  | "discarded"
  | "error";

export type PodcastEpisodeRow = {
  id: string;
  title: string;
  description: string;
  episode_date: string;
  status: PodcastEpisodeStatus;
  error_message: string | null;
  room_name: string | null;
  room_url: string | null;
  recording_id: string | null;
  duration_seconds: number | null;
  video_location: string | null;
  audio_location: string | null;
  youtube_status: "none" | "uploading" | "unlisted" | "failed";
  youtube_video_id: string | null;
  youtube_error: string | null;
  youtube_upload_url: string | null;
  youtube_upload_bytes: number;
  youtube_upload_total: number | null;
  youtube_upload_lock: string | null;
  website_status: "none" | "published" | "failed";
  website_error: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PodcastGuestInviteRow = {
  id: string;
  episode_id: string;
  token_hash: string;
  claim_hash: string | null;
  guest_name: string | null;
  expires_at: string;
  claimed_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type YoutubeConnectionRow = {
  id: number;
  encrypted_refresh_token: string | null;
  token_iv: string | null;
  token_auth_tag: string | null;
  channel_id: string | null;
  channel_title: string | null;
  connected_at: string | null;
  updated_at: string;
};

export type PodcastLoginAttemptRow = {
  ip_hash: string;
  failed_count: number;
  locked_until: string | null;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      podcast_episodes: {
        Row: PodcastEpisodeRow;
        Insert: Partial<PodcastEpisodeRow>;
        Update: Partial<PodcastEpisodeRow>;
        Relationships: [];
      };
      podcast_guest_invites: {
        Row: PodcastGuestInviteRow;
        Insert: Partial<PodcastGuestInviteRow> & {
          episode_id: string;
          token_hash: string;
          expires_at: string;
        };
        Update: Partial<PodcastGuestInviteRow>;
        Relationships: [];
      };
      youtube_connection: {
        Row: YoutubeConnectionRow;
        Insert: Partial<YoutubeConnectionRow> & { id: 1 };
        Update: Partial<YoutubeConnectionRow>;
        Relationships: [];
      };
      podcast_login_attempts: {
        Row: PodcastLoginAttemptRow;
        Insert: Partial<PodcastLoginAttemptRow> & { ip_hash: string };
        Update: Partial<PodcastLoginAttemptRow>;
        Relationships: [];
      };
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
      documents: {
        Row: DocumentRow;
        Insert: Partial<Omit<DocumentRow, "id" | "created_at" | "updated_at">> & {
          dropbox_path: string;
          filename: string;
        };
        Update: Partial<DocumentRow>;
        Relationships: [];
      };
      document_pages: {
        Row: DocumentPageRow;
        Insert: Partial<Omit<DocumentPageRow, "id" | "created_at">> & {
          document_id: string;
          page_number: number;
        };
        Update: Partial<DocumentPageRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      podcast_login_hit: {
        Args: { p_key: string; p_max: number; p_window_seconds: number; p_lock_seconds: number };
        Returns: boolean;
      };
    };
  };
};
