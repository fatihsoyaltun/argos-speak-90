export const TTS_MAX_TEXT_LENGTH = 2_000;

function findPreferredBreak(text: string, limit: number) {
  const minimumPreferredBreak = Math.floor(limit * 0.6);

  for (let index = limit; index >= minimumPreferredBreak; index -= 1) {
    const previousCharacter = text[index - 1];
    const currentCharacter = text[index];

    if (
      currentCharacter &&
      /\s/.test(currentCharacter) &&
      previousCharacter &&
      /[.!?;:]/.test(previousCharacter)
    ) {
      return index;
    }
  }

  for (let index = limit; index > 0; index -= 1) {
    if (/\s/.test(text[index] ?? "")) {
      return index;
    }
  }

  return limit;
}

export function splitTtsText(
  text: string,
  maxLength = TTS_MAX_TEXT_LENGTH,
) {
  if (!Number.isInteger(maxLength) || maxLength < 1) {
    throw new RangeError("TTS chunk length must be a positive integer.");
  }

  let remaining = text.trim();
  const chunks: string[] = [];

  while (remaining.length > maxLength) {
    const breakIndex = findPreferredBreak(remaining, maxLength);
    const chunk = remaining.slice(0, breakIndex).trim();

    if (!chunk) {
      chunks.push(remaining.slice(0, maxLength));
      remaining = remaining.slice(maxLength).trimStart();
      continue;
    }

    chunks.push(chunk);
    remaining = remaining.slice(breakIndex).trimStart();
  }

  if (remaining) {
    chunks.push(remaining);
  }

  return chunks;
}
