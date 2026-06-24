/**
 * SHEREHE — AI Invitation Writer Edge Function
 *
 * Server-side proxy for AI invitation message generation.
 * The client no longer ships with an EXPO_PUBLIC secret key.
 *
 * Features:
 *   - Rate limiting per device (15 req/hour) via a simple in-memory store
 *   - Proxies to the Rork AI toolkit with server-side secret
 *   - Returns null on rate limit / error so client falls back to templates
 *
 * Invoke: supabase.functions.invoke("ai-invitation", { body: { ... } })
 */

const TOOLKIT_URL = Deno.env.get("TOOLKIT_URL") ?? "";
const TOOLKIT_SECRET = Deno.env.get("TOOLKIT_SECRET_KEY") ?? "";
const MODEL_ID = "openai/gpt-4.1-nano";
const RATE_LIMIT_MAX = 15;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const TIMEOUT_MS = 15_000;

// In-memory rate limiting (per Edge Function instance — resets on cold start,
// which is acceptable for a free-tier rate limit)
const rateMap = new Map<string, number[]>();

function checkRateLimit(deviceId: string): boolean {
  const now = Date.now();
  const timestamps = rateMap.get(deviceId) ?? [];
  const active = timestamps.filter((t) => t > now - RATE_WINDOW_MS);

  if (active.length >= RATE_LIMIT_MAX) {
    return false;
  }

  active.push(now);
  rateMap.set(deviceId, active);
  return true;
}

interface InvitationInput {
  eventType: string;
  customLabel?: string;
  hostName: string;
  eventName: string;
  venue: string;
  existing?: string;
  deviceId?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
      },
    });
  }

  if (!TOOLKIT_URL || !TOOLKIT_SECRET) {
    return jsonResponse({ content: null, error: "not_configured" });
  }

  let body: InvitationInput;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ content: null, error: "invalid_body" }, 400);
  }

  const deviceId = body.deviceId ?? "unknown";
  if (!checkRateLimit(deviceId)) {
    return jsonResponse({ content: null, error: "rate_limited" });
  }

  const label = body.eventType === "custom" && body.customLabel
    ? body.customLabel
    : body.eventType;

  const systemPrompt = [
    "You are a warm, personal invitation writer. Write messages that feel handwritten — not corporate.",
    "Rules:",
    "- 2-4 sentences max (50-120 words)",
    '- Never use clichés like "You\'re cordially invited" or "Save the date"',
    "- Match the tone to the event type naturally",
    "- Address the recipient as a valued guest, not a crowd",
    "- Use the host's name naturally if it fits",
    "- Avoid exclamation marks unless the event is genuinely high-energy",
    "- Write in plain, modern English — no formality for formality's sake",
  ].join("\n");

  const userPrompt = body.existing
    ? [
        "Rewrite this invitation message to be fresher and more personal. Keep the same length and key details.",
        "",
        `Event: ${body.eventName} (${label})`,
        `Host: ${body.hostName}`,
        `Venue: ${body.venue}`,
        "",
        "Current draft:",
        body.existing,
      ].join("\n")
    : [
        "Write a short, warm invitation message for this event:",
        "",
        `Event: ${body.eventName}`,
        `Type: ${label}`,
        `Host: ${body.hostName}`,
        `Venue: ${body.venue}`,
      ].join("\n");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new Error("timeout")), TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(`${TOOLKIT_URL}/v2/vercel/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${TOOLKIT_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.85,
          max_tokens: 250,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[ai-invitation] API error ${response.status}:`, text.slice(0, 200));
      return jsonResponse({ content: null, error: "api_error" });
    }

    const data = await response.json() as {
      choices?: { message?: { content?: string } }[];
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return jsonResponse({ content: null, error: "empty_response" });
    }

    const cleaned = content
      .replace(/^["']|["']$/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return jsonResponse({ content: cleaned, error: null });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[ai-invitation] Generation failed:", msg);
    return jsonResponse({ content: null, error: msg });
  }
});

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
