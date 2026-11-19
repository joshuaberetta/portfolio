import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import PixelAvatar from "./PixelAvatar";
import Response from "./Response";
import Spinner from "./Spinner";
import TravelMap from "./TravelMap";
import { clock } from "./StatusBar";
import { Line, chunkStops, parseMarkdown, totalLength } from "./markdown";
import { TmuxAction, answerPrompt, completions, runShell, runSlash } from "./shell";
import { THEMES, Theme, resolveTheme } from "./themes";
import { SITE, Section } from "../shared/siteContent";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = () => window.matchMedia("(pointer: coarse)").matches;

interface Entry {
  id: number;
  prompt: string;
  lines: Line[];
  stops: number[];
  total: number;
  shown: number;
  phase: "thinking" | "streaming" | "done";
  started: number;
  finished?: number;
  /** A section's map, shown once its text has streamed in. */
  map?: Section["map"];
}

/** A section's body, plus its downloads as link bullets. */
function sectionLines(section: Section): Line[] {
  const lines = parseMarkdown(section.body);
  if (section.files?.length) {
    lines.push({ kind: "blank", spans: [] });
    for (const f of section.files) {
      lines.push({
        kind: "bullet",
        spans: [{ text: `↓ ${f.label}`, href: f.file, download: f.fileName }],
      });
    }
  }
  return lines;
}

// The menu: every section, plus the theme switcher.
const MENU = [
  ...SITE.sections.map((s) => ({ key: s.key, label: s.label, hint: s.hint })),
  { key: "theme", label: "Theme", hint: "switch colour scheme" },
];

function findSection(text: string): Section | undefined {
  const q = text.trim().toLowerCase().replace(/^\//, "");
  return SITE.sections.find(
    (s) => s.key === q || s.label.toLowerCase() === q
  );
}

/** Longest prefix that every string shares. */
function commonPrefix(items: string[]) {
  return items.reduce((prefix, item) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === item[i]) i++;
    return prefix.slice(0, i);
  });
}

/** Start a download, or open an external page in a new tab. */
function fetchFile({ href, fileName }: { href: string; fileName?: string }) {
  const a = document.createElement("a");
  a.href = href;
  if (fileName) a.download = fileName;
  else {
    a.target = "_blank";
    a.rel = "noreferrer";
  }
  a.click();
}

interface PaneProps {
  /** Only the active pane takes keyboard input. */
  active: boolean;
  /** Type and answer the intro question on mount (the first pane only). */
  intro: boolean;
  /** How many panes are open, so `exit` knows whether it can close this one. */
  panes: number;
  theme: Theme;
  onTheme: (theme: Theme) => void;
  onActivate: () => void;
  onTmux: (action: TmuxAction) => void;
}

/** One terminal session: transcript, prompt and menu. */
const Pane: React.FC<PaneProps> = (props) => {
  const { active: focused, intro, theme, onActivate } = props;
  // Latest props for callbacks that are created once.
  const latest = useRef(props);
  latest.current = props;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [introTyping, setIntroTyping] = useState(intro);
  const [highlight, setHighlight] = useState(0);
  // With an empty prompt the menu is a single row of chips; typing, or ↓,
  // opens the full list with hints.
  const [listOpen, setListOpen] = useState(false);
  // Tab-completion candidates, listed under the prompt when there are several.
  const [candidates, setCandidates] = useState<string[]>([]);
  const nextId = useRef(0);
  const pane = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const inputEl = useRef<HTMLInputElement>(null);
  const touch = useMemo(coarsePointer, []);
  const pastPrompts = useRef<string[]>([]);

  const active = entries.at(-1);
  const busy = introTyping || (active !== undefined && active.phase !== "done");

  // `!` switches the prompt to shell mode, as in Claude Code.
  const shellMode = input.startsWith("!");
  const query = input.trim().toLowerCase().replace(/^\//, "");
  const options = shellMode
    ? []
    : MENU.filter(
        (s) => s.key.startsWith(query) || s.label.toLowerCase().startsWith(query)
      );
  const expanded = !shellMode && (listOpen || input !== "");

  const submit = useCallback((text: string, lines?: Line[]) => {
    setInput("");
    setHighlight(0);
    setListOpen(false);
    setCandidates([]);
    stick.current = true;
    const trimmed = text.trim();
    // `! ls` runs a shell command; anything else is a /command or a question.
    const shell = trimmed.match(/^!\s*(.*)$/)?.[1];
    const section = shell === undefined ? findSection(text) : undefined;
    if (section) history.replaceState(null, "", `#${section.key}`);
    if (/^(\/|!\s*)(clear|cls)$/.test(trimmed)) {
      setEntries([]);
      history.replaceState(null, "", location.pathname);
      return;
    }
    pastPrompts.current.push(text);
    let body = lines ?? (section && sectionLines(section));
    const themeCmd = trimmed.match(/^\/theme(?:\s+(\S+))?$/);
    if (!body && themeCmd) {
      const next = resolveTheme(themeCmd[1], latest.current.theme);
      if (next) latest.current.onTheme(next);
      body = parseMarkdown(
        (next
          ? `Theme set to **${next}**.`
          : `theme: unknown theme \`${themeCmd[1]}\`.`) +
          ` Pick one with \`/theme <name>\`: ${THEMES.map((t) => `\`${t}\``).join(", ")}.`
      );
    }
    if (!body) {
      const result =
        shell !== undefined
          ? shell
            ? runShell(shell, {
                history: pastPrompts.current,
                theme: latest.current.theme,
                panes: latest.current.panes,
              })
            : { md: "Type a shell command after `!`, like `! ls` or `! help`." }
          : trimmed.startsWith("/")
            ? runSlash(trimmed)
            : answerPrompt(trimmed);
      if (result.tmux) latest.current.onTmux(result.tmux);
      if (result.fetch) fetchFile(result.fetch);
      body = parseMarkdown(result.md);
    }
    // Sections and questions "think" first; commands answer straight away.
    const thinks =
      Boolean(section) || Boolean(lines) || (shell === undefined && !trimmed.startsWith("/"));
    const total = totalLength(body);
    const instant = reducedMotion();
    setEntries((prev) => [
      ...prev,
      {
        id: nextId.current++,
        prompt: text,
        lines: body,
        stops: chunkStops(body),
        total,
        shown: instant ? total : 0,
        phase: instant ? "done" : thinks ? "thinking" : "streaming",
        started: Date.now(),
        finished: instant ? Date.now() : undefined,
        map: section?.map,
      },
    ]);
  }, []);

  const choose = useCallback(
    (item: { key: string }) => submit(`/${item.key}`),
    [submit]
  );

  // On load, type the intro question (or a #section from the URL) into the
  // prompt and send it, as if someone had just asked.
  useEffect(() => {
    if (!intro) return;
    const fromHash = findSection(location.hash.slice(1));
    const introSection = SITE.sections.find((s) => s.key === SITE.intro.section);
    const text = fromHash ? `/${fromHash.key}` : SITE.intro.prompt;
    const lines = fromHash ? undefined : introSection && sectionLines(introSection);
    if (reducedMotion()) {
      setIntroTyping(false);
      submit(text, lines);
      return;
    }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setInput(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(t);
        setTimeout(() => {
          setIntroTyping(false);
          submit(text, lines);
        }, 250);
      }
    }, 55);
    return () => clearInterval(t);
  }, [intro, submit]);

  // Drive the active response: a short think, then stream a few words a tick.
  useEffect(() => {
    if (!active || active.phase === "done") return;
    const update = (patch: Partial<Entry>) =>
      setEntries((prev) =>
        prev.map((e) => (e.id === active.id ? { ...e, ...patch } : e))
      );
    if (active.phase === "thinking") {
      const t = setTimeout(
        () => update({ phase: "streaming" }),
        450 + Math.random() * 600
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      const next = active.stops.findIndex((s) => s > active.shown);
      const shown =
        active.stops[
          Math.min(next + Math.floor(Math.random() * 3), active.stops.length - 1)
        ];
      update(
        shown >= active.total
          ? { shown, phase: "done", finished: Date.now() }
          : { shown }
      );
    }, 20 + Math.random() * 45);
    return () => clearTimeout(t);
  }, [active]);

  /** Esc / tap while busy: show everything at once. */
  const skip = useCallback(() => {
    if (!active || active.phase === "done") return;
    setEntries((prev) =>
      prev.map((e) =>
        e.id === active.id
          ? { ...e, shown: e.total, phase: "done", finished: Date.now() }
          : e
      )
    );
  }, [active]);

  // Keep the newest output in view unless the reader has scrolled up, also
  // when the pane shrinks because another one was split off it.
  useEffect(() => {
    const el = pane.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [entries, focused]);

  useEffect(() => {
    const el = pane.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (stick.current) el.scrollTop = el.scrollHeight;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Focus the prompt once a response finishes, except on touch screens where
  // that would pop up the keyboard.
  useEffect(() => {
    if (focused && !busy && !touch) inputEl.current?.focus({ preventScroll: true });
  }, [focused, busy, touch]);

  useEffect(() => {
    if (!focused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (busy) {
        if (e.key === "Escape") skip();
        return;
      }
      // Tab with something typed completes it, like a shell.
      if (e.key === "Tab" && !e.shiftKey && input.trim()) {
        e.preventDefault();
        const { word, matches } = completions(input);
        const head = input.slice(0, input.length - word.length);
        if (matches.length === 1) {
          setInput(`${head}${matches[0]} `);
          setCandidates([]);
        } else if (matches.length > 1) {
          setInput(head + commonPrefix(matches));
          setCandidates(matches);
        }
        return;
      }
      const n = Math.max(options.length, 1);
      if (!expanded && e.key === "ArrowDown") {
        e.preventDefault();
        setListOpen(true);
      } else if (
        e.key === "ArrowDown" ||
        (e.key === "Tab" && !e.shiftKey) ||
        (!expanded && e.key === "ArrowRight")
      ) {
        e.preventDefault();
        setHighlight((h) => (h + 1) % n);
      } else if (expanded && !input && e.key === "ArrowUp" && highlight === 0) {
        e.preventDefault();
        setListOpen(false);
      } else if (
        e.key === "ArrowUp" ||
        (e.key === "Tab" && e.shiftKey) ||
        (!expanded && e.key === "ArrowLeft")
      ) {
        e.preventDefault();
        setHighlight((h) => (h - 1 + n) % n);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const option = options[highlight];
        if (option) choose(option);
        else if (input.trim()) submit(input.trim());
      } else if (e.key === "Escape") {
        setInput("");
        setHighlight(0);
        setListOpen(false);
      } else if (/^[1-9]$/.test(e.key) && input === "") {
        const option = SITE.sections[Number(e.key) - 1];
        if (option) {
          e.preventDefault();
          choose(option);
        }
      } else if (e.key.length === 1 && document.activeElement !== inputEl.current) {
        inputEl.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, busy, options, expanded, highlight, input, choose, submit, skip]);

  const onScroll = () => {
    const el = pane.current;
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  };

  const { header } = SITE;
  return (
    <div className="term" onPointerDown={onActivate}>
      <main
        className="pane"
        ref={pane}
        onScroll={onScroll}
        onClick={busy ? skip : undefined}
      >
        <header className="banner-head">
          <PixelAvatar
            src={header.image}
            alt={header.name}
            theme={theme}
          />
          <div>
            <div>
              <span className="b">{header.name}</span>{" "}
              <span className="dim">{header.version}</span>
            </div>
            <div className="dim">{header.subtitle}</div>
            <div className="dim">{header.path}</div>
          </div>
        </header>
        <div className="banner">
          <span className="tag">info</span>
          <span className="dim">{SITE.banner}</span>
        </div>

        {!intro && entries.length === 0 && (
          <div className="dim welcome">
            new session · pick a section, or try <span className="code">/help</span>
          </div>
        )}

        {entries.map((e) => (
          <section key={e.id} className="entry">
            <div className={e.prompt.startsWith("!") ? "prompt-row shell" : "prompt-row"}>
              {e.prompt}
            </div>
            {e.phase !== "thinking" && <Response lines={e.lines} shown={e.shown} />}
            {e.phase === "done" && e.map && (
              <TravelMap lived={e.map.lived} visited={e.map.visited} touch={touch} />
            )}
            {e.phase === "done" && e.finished && (
              <div className="done dim">
                <span className="accent">▣</span> done ·{" "}
                {((e.finished - e.started) / 1000).toFixed(1)}s ·{" "}
                {clock(new Date(e.finished))}
              </div>
            )}
          </section>
        ))}
        {active && active.phase !== "done" && (
          <Spinner
            key={active.id}
            label={active.phase === "thinking" ? "thinking" : "writing"}
            started={active.started}
            skipHint={touch ? "tap to skip" : "esc to interrupt"}
          />
        )}
      </main>

      <div className={shellMode ? "inputbox shell" : "inputbox"}>
        <label className="input-row">
          <span className="caret">{shellMode ? "!" : "›"}</span>
          <span className="typed">
            {shellMode ? input.slice(1) : input}
            <span className="cursor" />
            {!input && !busy && (
              <span className="placeholder">
                {touch ? " tap a command below" : " type a /command, or ! for shell"}
              </span>
            )}
          </span>
          <input
            ref={inputEl}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCandidates([]);
              setHighlight(0);
            }}
            disabled={busy}
            aria-label="Command"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
          />
        </label>
      </div>

      {candidates.length > 0 && !busy && (
        <div className="completions">
          {candidates.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      )}

      <nav
        className={expanded ? "menu" : "menu chips"}
        aria-label="Sections"
        hidden={busy || shellMode || candidates.length > 0}
      >
        {!expanded && options.map((s, i) => (
          <button
            key={s.key}
            className={i === highlight && !touch ? "chip on" : "chip"}
            title={s.hint}
            onMouseEnter={() => setHighlight(i)}
            onClick={() => choose(s)}
          >
            /{s.key}
          </button>
        ))}
        {expanded && options.map((s, i) => (
          <button
            key={s.key}
            className={i === highlight ? "option on" : "option"}
            onMouseEnter={() => setHighlight(i)}
            onClick={() => choose(s)}
          >
            <span className="cmd">/{s.key}</span>
            <span className="hint">{s.hint}</span>
          </button>
        ))}
        {expanded && options.length === 0 && (
          <div className="option dim">no matching section · enter to run it as a command</div>
        )}
      </nav>

      <div className="keys">
        {!busy && !touch && !expanded && options[highlight] && (
          <span className="chip-hint">{options[highlight].hint}</span>
        )}
        {(busy
          ? [[touch ? "tap" : "esc", "skip"]]
          : touch
            ? [["tap", "open a section"]]
            : shellMode
              ? [
                  ["!", "shell mode"],
                  ["tab", "complete"],
                  ["enter", "run"],
                  ["esc", "cancel"],
                ]
            : expanded
              ? [
                  ["↑↓", "navigate"],
                  ["tab", "complete"],
                  ["enter", "open"],
                  ["esc", "close"],
                ]
              : [
                  ["←→", "select"],
                  ["↓", "details"],
                  ["enter", "open"],
                  [`1-${Math.min(9, SITE.sections.length)}`, "jump"],
                ]
        ).map(([key, action]) => (
          <span key={key}>
            <span className="key">{key}</span> <span className="dim">{action}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Pane;
