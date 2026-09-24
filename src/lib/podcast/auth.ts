import crypto from "crypto";
import { cookies, headers } from "next/headers";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const STUDIO_SESSION_COOKIE = "podcast_studio_session";
const SESSION_TTL_MS = 4 * 60 * 60 * 1000; // signed in for at most 4 hours, then the code is asked for again

/** Everything the studio needs to be usable. Returns the missing env var names, never their values. */
export function getStudioAuthConfigProblems(): string[] {
  const problems: string[] = [];
  const passcode = process.env.PODCAST_STUDIO_PASSCODE;
  if (!passcode || !/^\d{4}$/.test(passcode)) {
    problems.push("PODCAST_STUDIO_PASSCODE (must be exactly 4 digits)");
  }
  const secret = process.env.PODCAST_STUDIO_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    problems.push("PODCAST_STUDIO_SESSION_SECRET (at least 32 characters)");
  }
  return problems;
}

function sessionSecret(): string {
  const secret = process.env.PODCAST_STUDIO_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("PODCAST_STUDIO_SESSION_SECRET is not set.");
  return secret;
}

function hmac(value: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex");
}

/** Constant-time string comparison that doesn't leak length. */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function passcodeMatches(entered: string): boolean {
  const expected = process.env.PODCAST_STUDIO_PASSCODE;
  if (!expected || !/^\d{4}$/.test(expected)) return false;
  return safeEqual(entered, expected);
}

export function createSessionValue(now = Date.now()): string {
  const expires = String(now + SESSION_TTL_MS);
  return `${expires}.${hmac(`studio:${expires}`)}`;
}

export function isSessionValue(value: string | undefined, now = Date.now()): boolean {
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(hmac(`studio:${expires}`), signature)) return false;
  return Number(expires) > now;
}

/** True when the current request carries a valid studio session cookie. */
export async function hasStudioSession(): Promise<boolean> {
  if (getStudioAuthConfigProblems().length > 0) return false;
  const store = await cookies();
  return isSessionValue(store.get(STUDIO_SESSION_COOKIE)?.value);
}

/** Throws unless signed in. Every studio server action and API route calls this first. */
export async function requireStudioSession(): Promise<void> {
  if (!(await hasStudioSession())) throw new Error("NOT_SIGNED_IN");
}

export async function startStudioSession(): Promise<void> {
  const store = await cookies();
  store.set(STUDIO_SESSION_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // No maxAge: a session cookie, so closing the browser signs out. Some phones restore session
    // cookies when a browser reopens, so the signed expiry above is the hard limit.
    path: "/",
  });
}

export async function endStudioSession(): Promise<void> {
  const store = await cookies();
  store.delete(STUDIO_SESSION_COOKIE);
}

async function visitorKey(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return hmac(`ip:${ip}`);
}

export type PasscodeAttempt = { ok: true } | { ok: false; message: string };

const WINDOW_SECONDS = 15 * 60;
const MAX_TRIES_PER_VISITOR = 5; // per 15 minutes, per device/network
const MAX_TRIES_ALL_VISITORS = 60; // per 15 minutes in total, so many different addresses can't grind through 10,000 codes

/**
 * Checks a passcode with lockouts. Each try is counted atomically in the database BEFORE the
 * code is compared, so a burst of parallel guesses can't sneak past the limit.
 */
export async function attemptPasscode(entered: string): Promise<PasscodeAttempt> {
  if (getStudioAuthConfigProblems().length > 0) {
    return { ok: false, message: "The studio isn't ready yet. Please contact Sidney." };
  }
  if (!/^\d{4}$/.test(entered)) {
    return { ok: false, message: "Please enter the 4-digit code." };
  }

  const supabase = createAdminSupabaseClient();
  const key = await visitorKey();
  const tooMany = { ok: false as const, message: "Too many wrong codes. Please wait 15 minutes and try again." };

  for (const [k, max] of [
    [key, MAX_TRIES_PER_VISITOR],
    [hmac("all-visitors"), MAX_TRIES_ALL_VISITORS],
  ] as const) {
    const { data: locked, error } = await supabase.rpc("podcast_login_hit", {
      p_key: k,
      p_max: max,
      p_window_seconds: WINDOW_SECONDS,
      p_lock_seconds: WINDOW_SECONDS,
    });
    if (error) throw new Error("rate limit unavailable"); // fail closed: never skip the limit
    if (locked) return tooMany;
  }

  if (passcodeMatches(entered)) {
    await supabase.from("podcast_login_attempts").delete().eq("ip_hash", key);
    return { ok: true };
  }
  return { ok: false, message: "That code isn't right. Please check it and try again." };
}
