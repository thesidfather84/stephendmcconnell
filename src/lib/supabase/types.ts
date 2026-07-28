/**
 * Hand-written types for the tables read by app code today (just `profiles`,
 * for the admin role check). Once the migration in supabase/migrations has
 * been run against the live project, regenerate full types with:
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

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
    };
  };
};
