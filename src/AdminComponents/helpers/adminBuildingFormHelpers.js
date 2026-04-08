export function formatDateLatin(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("es-DO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTimeLatin(value) {
  if (!value) return "";

  const date = new Date(`2026-01-01T${value}:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString("es-DO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}