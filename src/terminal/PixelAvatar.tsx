import React, { useCallback, useEffect, useRef } from "react";

// Grid size of the avatar and how many colours it keeps. Small numbers give
// the chunky look of an image drawn with half-block characters in a terminal.
const GRID = 32;
const COLOURS = 20;
// Square crop of the photo, as fractions of its width/height, around the face.
const CROP = { x: 0.14, y: 0.06, size: 0.74 };
// Glitch: how many frames, how long each lasts, and the gap between the
// glitches that happen on their own.
const GLITCH_FRAMES = 7;
const GLITCH_FRAME_MS = 55;
const IDLE_GLITCH_MS = [7000, 16000];

type RGB = [number, number, number];

/** Reduce pixels to a small palette with a few rounds of k-means. */
function quantize(pixels: RGB[], k: number): RGB[] {
  // Seed evenly across brightness so shadows and highlights both get colours.
  const lum = (p: RGB) => 0.3 * p[0] + 0.59 * p[1] + 0.11 * p[2];
  const sorted = [...pixels].sort((a, b) => lum(a) - lum(b));
  let centres = Array.from(
    { length: k },
    (_, i) => sorted[Math.floor(((i + 0.5) * sorted.length) / k)]
  );
  const nearest = (p: RGB) => {
    let best = 0;
    let bestD = Infinity;
    centres.forEach((c, i) => {
      const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
      if (d < bestD) [best, bestD] = [i, d];
    });
    return best;
  };
  for (let round = 0; round < 8; round++) {
    const sums = centres.map(() => [0, 0, 0, 0]);
    for (const p of pixels) {
      const s = sums[nearest(p)];
      s[0] += p[0];
      s[1] += p[1];
      s[2] += p[2];
      s[3]++;
    }
    centres = sums.map((s, i) =>
      s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : centres[i]
    );
  }
  return pixels.map((p) => centres[nearest(p)]);
}

function toImageData(pixels: RGB[]) {
  const data = new ImageData(GRID, GRID);
  pixels.forEach((p, i) => {
    data.data.set([...p.map(Math.round), 255], i * 4);
  });
  return data;
}

/** The terminal background colour of the current theme, as RGB. */
function themeBackground(): RGB {
  const hex = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg")
    .trim()
    .replace("#", "");
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) || 0) as RGB;
}

/**
 * One glitched frame: a few bands of rows slide sideways, the red channel
 * drifts off the others, and some frames drop to the 4-colour palette.
 */
function glitchFrame(base: ImageData, crushed: ImageData): ImageData {
  const src = Math.random() < 0.4 ? crushed : base;
  const out = new ImageData(new Uint8ClampedArray(src.data), GRID, GRID);
  const bands = 1 + Math.floor(Math.random() * 3);
  for (let b = 0; b < bands; b++) {
    const top = Math.floor(Math.random() * GRID);
    const height = 1 + Math.floor(Math.random() * 5);
    const shift = Math.floor(Math.random() * 9) - 4;
    for (let y = top; y < Math.min(GRID, top + height); y++) {
      for (let x = 0; x < GRID; x++) {
        const from = (y * GRID + ((x - shift + GRID) % GRID)) * 4;
        out.data.set(src.data.subarray(from, from + 4), (y * GRID + x) * 4);
      }
    }
  }
  const drift = Math.random() < 0.6 ? 1 + Math.floor(Math.random() * 2) : 0;
  if (drift) {
    for (let i = 0; i < GRID * GRID; i++) {
      const x = i % GRID;
      out.data[i * 4] = src.data[(i - Math.min(x, drift)) * 4];
    }
  }
  return out;
}

interface PixelAvatarProps {
  src: string;
  alt: string;
  /** Redraws when this changes, so the edges fade into the new background. */
  theme: string;
  /** Glitches whenever this number changes. */
  glitch: number;
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({ src, alt, theme, glitch }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frames = useRef<{ base: ImageData; crushed: ImageData } | null>(null);
  const running = useRef(false);

  const runGlitch = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !frames.current || running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    const { base, crushed } = frames.current;
    let n = 0;
    const tick = () => {
      if (n++ < GLITCH_FRAMES) {
        ctx.putImageData(glitchFrame(base, crushed), 0, 0);
        setTimeout(tick, GLITCH_FRAME_MS * (0.5 + Math.random()));
      } else {
        ctx.putImageData(frames.current?.base ?? base, 0, 0);
        running.current = false;
      }
    };
    tick();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.current?.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const side = Math.min(img.width, img.height) * CROP.size;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        img.width * CROP.x,
        img.height * CROP.y,
        side,
        side,
        0,
        0,
        GRID,
        GRID
      );
      const data = ctx.getImageData(0, 0, GRID, GRID);
      // Fade the busy background towards the terminal colour so the face
      // stands out, more strongly the further a pixel is from the centre.
      const bg = themeBackground();
      const pixels: RGB[] = [];
      for (let i = 0; i < data.data.length; i += 4) {
        const x = ((i / 4) % GRID) / (GRID - 1) - 0.5;
        const y = Math.floor(i / 4 / GRID) / (GRID - 1) - 0.5;
        const d = Math.hypot(x * 1.15, y * 0.9) * 2;
        const fade = Math.min(1, Math.max(0, (d - 0.6) / 0.45)) * 0.9;
        pixels.push(
          [0, 1, 2].map(
            (c) => data.data[i + c] * (1 - fade) + bg[c] * fade
          ) as RGB
        );
      }
      const base = toImageData(quantize(pixels, COLOURS));
      frames.current = { base, crushed: toImageData(quantize(pixels, 4)) };
      ctx.putImageData(base, 0, 0);
    };
    img.src = src;
  }, [src, theme]);

  useEffect(() => {
    if (glitch) runGlitch();
  }, [glitch, runGlitch]);

  // Every so often, glitch on its own.
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const [min, max] = IDLE_GLITCH_MS;
      t = setTimeout(() => {
        runGlitch();
        schedule();
      }, min + Math.random() * (max - min));
    };
    schedule();
    return () => clearTimeout(t);
  }, [runGlitch]);

  return (
    <canvas
      ref={canvas}
      width={GRID}
      height={GRID}
      className="avatar"
      role="img"
      aria-label={alt}
      onMouseEnter={runGlitch}
      onClick={runGlitch}
    />
  );
};

export default PixelAvatar;
