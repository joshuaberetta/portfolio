import React, { useEffect, useState } from "react";

const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");
const pad = (n: number) => String(n).padStart(2, "0");

export function clock(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

interface StatusBarProps {
  window: string;
  title: string;
  /** ctrl+b was pressed and tmux is waiting for the next key. */
  prefix: boolean;
}

/** The tmux status line: session and window on the left, clock on the right. */
const StatusBar: React.FC<StatusBarProps> = ({ window, title, prefix }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(t);
  }, []);

  const date = `${pad(now.getDate())}-${MONTHS[now.getMonth()]}-${String(
    now.getFullYear()
  ).slice(2)}`;
  return (
    <footer className="tmux">
      <span>
        [0] <span className="u">0:{window}*</span>
        {prefix && <span className="prefix"> ^B </span>}
      </span>
      <span className="tmux-hint">^b % split · ^b " stack · ^b x close</span>
      <span className="right">
        "{title}" {clock(now)} {date}
      </span>
    </footer>
  );
};

export default StatusBar;
