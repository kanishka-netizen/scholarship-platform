import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseConfigured || !supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase public frontend configuration is missing");
  }

  client ??= createClient(supabaseUrl, supabasePublishableKey);
  return client;
}
