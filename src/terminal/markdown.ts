// A tiny markdown subset for section bodies: **bold**, *italic*, `code`,
// [text](href), "- " bullets and blank-line paragraph breaks. Lines are kept
// as flat spans so the streaming effect can cut them at any character.

export interface Span {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  href?: string;
  download?: string;
}

export interface Line {
  kind: "text" | "bullet" | "blank";
  spans: Span[];
}

const INLINE = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g;

function parseInline(text: string): Span[] {
  const spans: Span[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) spans.push({ text: text.slice(last, m.index) });
    if (m[1]) spans.push({ text: m[1], bold: true });
    else if (m[2]) spans.push({ text: m[2], italic: true });
    else if (m[3]) spans.push({ text: m[3], code: true });
    else spans.push({ text: m[4], href: m[5] });
    last = m.index + m[0].length;
  }
  if (last < text.length) spans.push({ text: text.slice(last) });
  return spans;
}

export function parseMarkdown(source: string): Line[] {
  const lines = source.trim().split("\n");
  return lines.map((raw): Line => {
    const line = raw.trimEnd();
    if (!line.trim()) return { kind: "blank", spans: [] };
    if (line.startsWith("- "))
      return { kind: "bullet", spans: parseInline(line.slice(2)) };
    return { kind: "text", spans: parseInline(line) };
  });
}

/** Characters in a line, counting one for its line break. */
export function lineLength(line: Line): number {
  return line.spans.reduce((n, s) => n + s.text.length, 0) + 1;
}

export function totalLength(lines: Line[]): number {
  return lines.reduce((n, l) => n + lineLength(l), 0);
}

/**
 * Offsets where a chunk may end, so text streams a word at a time the way
 * a model's tokens arrive rather than one letter at a time.
 */
export function chunkStops(lines: Line[]): number[] {
  const flat = lines
    .map((l) => l.spans.map((s) => s.text).join("") + "\n")
    .join("");
  const stops: number[] = [];
  for (let i = 1; i < flat.length; i++) {
    if (/\s/.test(flat[i]) && !/\s/.test(flat[i - 1])) stops.push(i);
  }
  stops.push(flat.length);
  return stops;
}
