/**
 * SHEREHE AI module — calls the Supabase Edge Function for AI generation.
 *
 * The Edge Function (`ai-invitation`) proxies requests to the AI provider
 * with server-side rate limiting and keeps the API secret off the client.
 *
 * Rate limiting: 15 requests per hour per device. Tracked via AsyncStorage
 * using a sliding-window of timestamps — the edge function also enforces
 * its own rate limit as a second layer.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device";

// Rate limit: max requests per hour
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_STORAGE_KEY = "sherehe.ai_rate_limits.v1";

/**
 * Check and update rate limit. Returns true if the request is allowed,
 * false if the rate limit has been exceeded.
 */
async function checkRateLimit(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(RATE_STORAGE_KEY);
    const timestamps: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Prune expired entries
    const active = timestamps.filter((t) => t > windowStart);

    if (active.length >= RATE_LIMIT_MAX) {
      console.log(`[ai] Rate limit reached (${active.length}/${RATE_LIMIT_MAX} in last hour)`);
      return false;
    }

    active.push(now);
    await AsyncStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(active));
    return true;
  } catch (e) {
    // If storage fails, allow the request — fail open
    console.log("[ai] Rate limit check failed, allowing request", e);
    return true;
  }
}

interface AiInvitationInput {
  /** Event type (wedding, birthday, baby, etc.) */
  eventType: string;
  /** Custom label if type is "custom" */
  customLabel?: string;
  /** Host's name */
  hostName: string;
  /** Event name / title */
  eventName: string;
  /** Venue or location */
  venue: string;
  /** Current draft the user typed (for rewrite) */
  existing?: string;
}

/**
 * Generate a fresh invitation message using AI via the server-side Edge Function.
 * Falls back to returning null if the AI call fails — the caller should
 * use its own template-based fallback in that case.
 */
export async function generateInvitationMessage(
  input: AiInvitationInput,
): Promise<string | null> {
  // Enforce client-side rate limit before making the network call
  const allowed = await checkRateLimit();
  if (!allowed) return null;

  try {
    const deviceId = await getDeviceId();
    const { data, error } = await supabase.functions.invoke<{
      content: string | null;
      error: string | null;
    }>("ai-invitation", {
      body: {
        eventType: input.eventType,
        customLabel: input.customLabel,
        hostName: input.hostName,
        eventName: input.eventName,
        venue: input.venue,
        existing: input.existing,
        deviceId,
      },
    });

    if (error) {
      console.log("[ai] Edge Function error:", error.message);
      return null;
    }

    if (data?.error) {
      console.log("[ai] Server-side error:", data.error);
      return null;
    }

    return data?.content ?? null;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.log("[ai] Generation failed:", msg);
    return null;
  }
}
