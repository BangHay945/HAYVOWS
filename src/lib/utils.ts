export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function formatDate(dateStr: string, localeOrFormat = "id-ID"): string {
  try {
    const validLocale =
      localeOrFormat && localeOrFormat.includes("-")
        ? localeOrFormat
        : "id-ID";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(validLocale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }
}

export function formatTime(time?: string | null): string {
  if (!time) return "00:00";
  return String(time).slice(0, 5);
}
