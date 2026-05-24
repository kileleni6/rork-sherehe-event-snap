import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const FALLBACK_URL = "https://ivpeowvxgbsrdtqhiavj.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cGVvd3Z4Z2JzcmR0cWhpYXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTUwNDAsImV4cCI6MjA5NTE5MTA0MH0.UeMJX0gFCiHL1KPqJsAtUIFzFywt7tAD8Iz9rhVQIV4";

const envUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const envKey: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabaseUrl: string = envUrl.length > 0 ? envUrl : FALLBACK_URL;
const supabaseAnonKey: string = envKey.length > 0 ? envKey : FALLBACK_ANON_KEY;

if (!envUrl || !envKey) {
  console.warn(
    "[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY not inlined at build time. Using bundled fallback values."
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
