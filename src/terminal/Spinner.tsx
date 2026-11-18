import React, { useEffect, useState } from "react";

// A row of blocks with a bright head sweeping back and forth and a fading
// trail behind it, like a scanner light.
const CELLS = 8;
const TRAIL = 4;
const TICK = 70;

interface SpinnerProps {
  label: string;
  started: number;
  skipHint: string;
}

const Spinner: React.FC<SpinnerProps> = ({ label, started, skipHint }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), TICK);
    return () => clearInterval(t);
  }, []);

  // Position along a there-and-back path, and which way the head is moving.
  const step = Math.floor((now - started) / TICK) % (2 * (CELLS - 1));
  const forward = step < CELLS - 1;
  const head = forward ? step : 2 * (CELLS - 1) - step;

  const cells = Array.from({ length: CELLS }, (_, i) => {
    const behind = forward ? head - i : i - head;
    const level = behind >= 0 && behind <= TRAIL ? 1 - behind / (TRAIL + 1) : 0;
    return (
      <span
        key={i}
        className="cell"
        style={{ opacity: 0.18 + 0.82 * level }}
      >
        ■
      </span>
    );
  });

  const secs = ((now - started) / 1000).toFixed(1);
  return (
    <div className="spinner" aria-live="off">
      <span className="scanner" aria-hidden="true">
        {cells}
      </span>
      <span className="dim">
        {label} · {secs}s · {skipHint}
      </span>
    </div>
  );
};

export default Spinner;
