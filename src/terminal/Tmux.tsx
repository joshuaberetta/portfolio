import React, { useCallback, useEffect, useRef, useState } from "react";

import Pane from "./Pane";
import StatusBar from "./StatusBar";
import { TmuxAction } from "./shell";
import { Theme, applyTheme, savedTheme } from "./themes";
import { SITE } from "../shared/siteContent";

// How long ctrl+b waits for the next key.
const PREFIX_MS = 2000;

/**
 * Pane layout as a tree: a leaf is one pane, a split lays its children out
 * side by side ("row", tmux's -h) or stacked ("col", tmux's -v).
 */
type Layout = { pane: number } | { dir: "row" | "col"; children: Layout[] };

function splitPane(layout: Layout, target: number, dir: "row" | "col", id: number): Layout {
  if ("pane" in layout) {
    return layout.pane === target
      ? { dir, children: [layout, { pane: id }] }
      : layout;
  }
  return {
    ...layout,
    children: layout.children.map((c) => splitPane(c, target, dir, id)),
  };
}

function removePane(layout: Layout, target: number): Layout | null {
  if ("pane" in layout) return layout.pane === target ? null : layout;
  const children = layout.children
    .map((c) => removePane(c, target))
    .filter((c): c is Layout => c !== null);
  if (children.length === 0) return null;
  return children.length === 1 ? children[0] : { ...layout, children };
}

/** Pane ids in reading order, for moving between them. */
function paneOrder(layout: Layout): number[] {
  return "pane" in layout ? [layout.pane] : layout.children.flatMap(paneOrder);
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Where each pane sits, in percent of the screen. Panes are rendered as flat
 * siblings placed by these rects, so splitting never remounts a pane and
 * wipes its history.
 */
function paneRects(layout: Layout, rect: Rect = { x: 0, y: 0, w: 100, h: 100 }): [number, Rect][] {
  if ("pane" in layout) return [[layout.pane, rect]];
  const n = layout.children.length;
  return layout.children.flatMap((child, i) =>
    paneRects(
      child,
      layout.dir === "row"
        ? { ...rect, x: rect.x + (rect.w / n) * i, w: rect.w / n }
        : { ...rect, y: rect.y + (rect.h / n) * i, h: rect.h / n }
    )
  );
}

/** The whole screen: panes in their layout, with the tmux status bar below. */
const Tmux: React.FC = () => {
  const [layout, setLayout] = useState<Layout>({ pane: 0 });
  const [activePane, setActivePane] = useState(0);
  const [theme, setTheme] = useState<Theme>(savedTheme);
  const [prefix, setPrefix] = useState(false);
  const nextId = useRef(1);
  const prefixTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => applyTheme(theme), [theme]);

  const order = paneOrder(layout);

  const act = useCallback(
    (action: TmuxAction | "next" | "prev", pane = activePane) => {
      if (action === "split-h" || action === "split-v") {
        const id = nextId.current++;
        setLayout((l) => splitPane(l, pane, action === "split-h" ? "row" : "col", id));
        setActivePane(id);
      } else if (action === "kill") {
        if (order.length < 2) return;
        const i = order.indexOf(pane);
        setLayout((l) => removePane(l, pane) ?? l);
        setActivePane(order[i === 0 ? 1 : i - 1]);
      } else {
        const i = order.indexOf(activePane);
        const step = action === "next" ? 1 : -1;
        setActivePane(order[(i + step + order.length) % order.length]);
      }
    },
    [activePane, order]
  );

  // ctrl+b, then a key. Listens in the capture phase so the key never
  // reaches the pane's prompt.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        e.stopPropagation();
        setPrefix(true);
        clearTimeout(prefixTimer.current);
        prefixTimer.current = setTimeout(() => setPrefix(false), PREFIX_MS);
        return;
      }
      if (!prefix || ["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
      setPrefix(false);
      clearTimeout(prefixTimer.current);
      const action = (
        {
          "%": "split-h",
          '"': "split-v",
          x: "kill",
          o: "next",
          ArrowRight: "next",
          ArrowDown: "next",
          ArrowLeft: "prev",
          ArrowUp: "prev",
        } as const
      )[e.key];
      if (action) act(action);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [prefix, act]);

  return (
    <div className="screen">
      <title>{SITE.site.title}</title>
      <div className={order.length > 1 ? "layout multi" : "layout"}>
        {paneRects(layout)
          .sort(([a], [b]) => a - b)
          .map(([id, r]) => (
            <div
              key={id}
              className={[
                "cell",
                id === activePane && "active",
                r.x + r.w < 99.9 && "edge-right",
                r.y + r.h < 99.9 && "edge-bottom",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                width: `${r.w}%`,
                height: `${r.h}%`,
              }}
            >
              <Pane
                active={id === activePane}
                intro={id === 0}
                panes={order.length}
                theme={theme}
                onTheme={setTheme}
                onActivate={() => setActivePane(id)}
                onTmux={(action) => act(action, id)}
              />
            </div>
          ))}
      </div>
      <StatusBar window={SITE.window} title={SITE.site.title} prefix={prefix} />
    </div>
  );
};

export default Tmux;
