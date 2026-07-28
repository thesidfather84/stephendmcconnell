const DEV_USERNAME = "McConnell";
const DEV_PASSWORD = "Kidney2026!";
const DEV_SECRET = "dev-only-insecure-session-secret-replace-me";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? DEV_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? DEV_PASSWORD;

/** True when the site is running on the hardcoded development credentials. */
export const USING_DEV_CREDENTIALS =
  !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? DEV_SECRET;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function createSessionCookieValue(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

export async function isSessionValid(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false;
  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) return false;
  if ((await sign(payload)) !== signature) return false;
  return Number(payload) > Date.now();
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;
