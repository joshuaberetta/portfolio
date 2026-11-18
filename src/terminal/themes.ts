// Colour schemes, defined as CSS variable sets in index.css under
// html[data-theme="…"]. The choice is remembered between visits.

export const THEMES = ["midnight", "phosphor", "amber", "paper"] as const;
export type Theme = (typeof THEMES)[number];

const KEY = "theme";

export function savedTheme(): Theme {
  const saved = localStorage.getItem(KEY);
  return THEMES.includes(saved as Theme) ? (saved as Theme) : THEMES[0];
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(KEY, theme);
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg")
    .trim();
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", bg);
}

/** The named theme, or the next one after `current` when no name is given. */
export function resolveTheme(arg: string | undefined, current: Theme) {
  if (!arg) return THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  return THEMES.find((t) => t === arg.toLowerCase());
}
