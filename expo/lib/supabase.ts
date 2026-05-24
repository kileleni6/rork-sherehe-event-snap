import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Supabase calls will fail until these are set."
  );
}

/**
 * Shared Supabase client for the SHEREHE app.
 * Uses AsyncStorage on native for session persistence; web falls back to localStorage automatically.
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === "web" ? undefined : (AsyncStorage as unknown as Storage),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});

export const isSupabaseConfigured: boolean = Boolean(supabaseUrl && supabaseAnonKey);
