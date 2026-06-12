export function parseHour(
  text: string
): string | null {

  const match =
    text.match(
      /(\d{1,2})(?::(\d{2}))?\s*h?/i
    );

  if (!match) {
    return null;
  }

  const hour =
    match[1].padStart(2, "0");

  const minute =
    match[2] || "00";

  return `${hour}:${minute}`;
}