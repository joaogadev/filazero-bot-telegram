// src/parsers/dateParser.ts

export function parseRelativeDate(
  text: string
): string | null {

  const input =
    text.toLowerCase().trim();

  const date =
    new Date();

  if (
    input.includes("amanhã") ||
    input.includes("amanha")
  ) {
    date.setDate(date.getDate() + 1);
  }
  else if (
    input.includes("hoje")
  ) {
    // mantém hoje
  }
  else {
    return null;
  }

  const day =
    String(date.getDate())
      .padStart(2, "0");

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const year =
    date.getFullYear();

  return `${day}/${month}/${year}`;
}