export type ScriptedIntent<T> = {
  patterns: readonly RegExp[];
  response: () => T;
};

export function normalizeQuestion(question: string) {
  return question
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function matchScriptedIntent<T>(
  question: string,
  intents: readonly ScriptedIntent<T>[],
) {
  const normalized = normalizeQuestion(question);
  return intents.find((intent) => (
    intent.patterns.some((pattern) => pattern.test(normalized))
  ))?.response();
}
