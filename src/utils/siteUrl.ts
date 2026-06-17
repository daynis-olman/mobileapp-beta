export function getSiteOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}