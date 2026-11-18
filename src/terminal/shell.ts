// Hidden shell commands: anything typed at the prompt that isn't a section.
// Each returns a markdown reply, and may ask for a download or a pane change.
import { SITE } from "../shared/siteContent";
import { THEMES } from "./themes";

/** Pane changes a command can ask the tmux layout for. */
export type TmuxAction = "split-h" | "split-v" | "kill";

export interface ShellResult {
  md: string;
  /** Download this file (same-site) or open this page (elsewhere). */
  fetch?: { href: string; fileName?: string };
  tmux?: TmuxAction;
}

interface ShellContext {
  history: string[];
  theme: string;
  panes: number;
}

const TMUX_HELP = [
  "**tmux** · this page runs inside one. Press `ctrl+b`, then:",
  "- `%` · split side by side",
  '- `"` · split top and bottom',
  "- `o` or arrows · move between panes (or click one)",
  "- `x` · close the pane",
  "",
  "Or type `tmux split-window -h`, `tmux split-window -v`, `tmux kill-pane`, or `exit`.",
].join("\n");

function tmux([sub, ...flags]: string[], { panes }: ShellContext): ShellResult {
  switch (sub) {
    case "split-window":
    case "splitw":
    case "split":
      return flags.includes("-h")
        ? { md: "split-window: new pane opened to the right →", tmux: "split-h" }
        : { md: "split-window: new pane opened below ↓", tmux: "split-v" };
    case "kill-pane":
    case "killp":
      return panes > 1
        ? { md: "[exited]", tmux: "kill" }
        : { md: "can't kill the last pane. Try `tmux split-window` first." };
    case "ls":
    case "list-sessions":
      return {
        md: `nowhere: 1 windows, ${panes} pane${panes > 1 ? "s" : ""} (attached)`,
      };
    default:
      return { md: TMUX_HELP };
  }
}

const thesis = SITE.sections.flatMap((s) => s.files ?? [])[0];
const files = [
  ...SITE.sections.map((s) => `${s.key}.md`),
  ...(thesis ? ["thesis.pdf"] : []),
  ...(SITE.site.cv ? ["cv.pdf"] : []),
];

function megabytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}M`;
}

/** Fake wget output, then hand the real download to the caller. */
function wget(name: string | undefined): ShellResult {
  if (!name) return { md: "wget: missing URL · try `wget thesis.pdf`" };
  const file = name.replace(/^.*\//, "");
  const now = new Date();
  const stamp = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const started = `--${stamp}--  https://joshuaberetta.com/${file}`;
  if (file === "thesis.pdf" && thesis) {
    return {
      md: [
        `\`${started}\``,
        "Resolving joshuaberetta.com… connected.",
        "HTTP request sent, awaiting response… **200 OK**",
        `Length: ${thesis.fileSize} (${megabytes(thesis.fileSize)}) [application/pdf]`,
        `Saving to: *‘${thesis.fileName}’*`,
        "",
        `\`thesis.pdf  100%[===================>]  ${megabytes(thesis.fileSize)}  in 0.4s\``,
        "",
        `Saved. If nothing downloaded, [grab it here](${thesis.file}).`,
      ].join("\n"),
      fetch: { href: thesis.file, fileName: thesis.fileName },
    };
  }
  if (file === "cv.pdf" && SITE.site.cv) {
    return {
      md: [
        `\`${started}\``,
        "HTTP request sent, awaiting response… **302 Found**",
        `Location: [${SITE.site.cv}](${SITE.site.cv}) [following]`,
        "",
        "The CV lives on its own site, always up to date. Opened it in a new tab: the PDF is behind its download button.",
      ].join("\n"),
      fetch: { href: SITE.site.cv },
    };
  }
  return {
    md: `\`${started}\`\nHTTP request sent, awaiting response… **404 Not Found**\nwget: ${file}: nothing like that here. Try \`ls\`.`,
  };
}

function cat(name: string | undefined): string {
  if (!name) return "usage: `cat <file>` · try `ls` first";
  if (name.endsWith(".pdf") && files.includes(name)) {
    return `cat: ${name}: binary file. Try \`wget ${name}\`.`;
  }
  const section = SITE.sections.find((s) => `${s.key}.md` === name || s.key === name);
  return section ? section.body : `cat: ${name}: No such file or directory`;
}

const COMMANDS: Record<string, (args: string[], ctx: ShellContext) => ShellResult> = {
  help: () => ({
    md: [
      "**sections**",
      ...SITE.sections.map((s) => `- \`/${s.key}\` · ${s.hint ?? s.label}`),
      "",
      "**extras**",
      "- `/theme [name]` · switch colour scheme",
      "- `/clear` · clear the screen",
      "- `wget thesis.pdf` · download the thesis",
      "- `tmux` · split the screen into more sessions",
      "",
      "*…and a few hidden ones. It's a shell, try things.*",
    ].join("\n"),
  }),
  ls: (args) => ({
    md: args.some((a) => a.startsWith("-"))
      ? files.map((f) => `- \`-rw-r--r--  joshua  nowhere\`  ${f}`).join("\n")
      : files.join("   "),
  }),
  cat: ([name]) => ({ md: cat(name) }),
  wget: (args) => wget(args.find((a) => !a.startsWith("-"))),
  less: ([name]) => ({ md: cat(name) }),
  pwd: () => ({ md: "~/nowhere" }),
  cd: ([dir]) => ({
    md: dir
      ? `cd: ${dir}: no fixed address. You're already in \`~/nowhere\`.`
      : "Home is wherever the next deployment is.",
  }),
  whoami: () => ({
    md: "**guest** · you're the visitor here. For who *I* am, try `/about`.",
  }),
  echo: (args) => ({ md: args.join(" ") || " " }),
  date: () => ({ md: new Date().toString() }),
  uname: () => ({ md: "NomadOS 2026.11 backpack x86_64 · kernel: coffee" }),
  history: (_, { history }) => ({
    md: history.length
      ? history.map((h, i) => `- \`${String(i + 1).padStart(3)}\`  ${h}`).join("\n")
      : "no history yet",
  }),
  neofetch: (_, { theme }) => ({
    md: [
      "**joshua**@**nowhere**",
      "- **OS** · NomadOS 2026.11 (backpack edition)",
      "- **Host** · whichever airport has wifi",
      "- **Uptime** · 4 deployments, 22 trainings, 1 thesis",
      "- **Shell** · nosh (no-home shell)",
      "- **Languages** · English, Spanish, Python, TypeScript",
      `- **Theme** · ${theme}`,
      "- **Packages** · KoboToolbox, XLSForm, Django, too many PDFs",
    ].join("\n"),
  }),
  sudo: () => ({
    md: "guest is not in the sudoers file. This incident will be reported.",
  }),
  rm: (args) =>
    args.some((a) => a.includes("r") && a.startsWith("-"))
      ? { md: "Nice try. Everything here is backed up in a backpack." }
      : { md: "rm: permission denied" },
  vim: () => ({ md: "You're in vim now. Good luck. (type `:q` to escape)" }),
  ":q": () => ({ md: "Phew. You escaped vim. Most people don't." }),
  exit: (_, { panes }) =>
    panes > 1
      ? { md: "[exited]", tmux: "kill" }
      : { md: "There is no exit. Only the next deployment." },
  tmux,
  ping: ([host]) => ({
    md: `ping: ${host ?? "home"}: Name or service not known`,
  }),
  ssh: ([host]) => ({
    md: `ssh: connect to host ${host ?? "home"}: no fixed address`,
  }),
  coffee: () => ({ md: "Brewing… ☕ done. Productivity +10." }),
};

// Aliases share an implementation.
for (const [alias, target] of Object.entries({
  vi: "vim",
  nano: "vim",
  emacs: "vim",
  ":wq": ":q",
  ":q!": ":q",
  ":x": ":q",
  logout: "exit",
  quit: "exit",
  fastfetch: "neofetch",
  more: "less",
  curl: "wget",
  "?": "help",
  man: "help",
})) {
  COMMANDS[alias] = COMMANDS[target];
}

export function runShell(text: string, ctx: ShellContext): ShellResult {
  const [name, ...args] = text.trim().replace(/^\//, "").split(/\s+/);
  const command = COMMANDS[name.toLowerCase()];
  if (command) return command(args, ctx);
  return { md: `nosh: command not found: ${name}\n\nTry \`help\`.` };
}

/** What the last word of `input` could complete to. */
export function completions(input: string): { word: string; matches: string[] } {
  const words = input.split(" ");
  const word = words.at(-1) ?? "";
  let candidates: string[];
  if (words.length === 1) {
    candidates = word.startsWith("/")
      ? [...SITE.sections.map((s) => s.key), "theme", "clear"].map((k) => `/${k}`)
      : [
          ...Object.keys(COMMANDS).filter((c) => /^[a-z]/.test(c)),
          ...SITE.sections.map((s) => s.key),
          "clear",
          "theme",
        ];
  } else if (words[0].replace(/^\//, "") === "theme") {
    candidates = [...THEMES];
  } else if (words[0] === "tmux") {
    candidates = ["split-window", "kill-pane", "list-sessions"];
  } else {
    candidates = files;
  }
  const matches = [...new Set(candidates)]
    .filter((c) => c.startsWith(word) && c !== word)
    .sort();
  return { word, matches };
}
