export const ALLOWED_EMAIL = "tim@tmeekconsulting.com";

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function unlockDecision(typed) {
  if (!String(typed ?? "").trim()) return "empty";
  if (normalizeEmail(typed) !== ALLOWED_EMAIL) return "mismatch";
  return "ok";
}
