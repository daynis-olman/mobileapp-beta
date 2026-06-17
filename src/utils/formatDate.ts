export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

export function toDateInputValue(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } catch {
    return "";
  }
}

export function fromDateInputValue(value: string): string {
  if (!value) return new Date().toISOString();
  const d = new Date(`${value}T00:00:00`);
  return d.toISOString();
}