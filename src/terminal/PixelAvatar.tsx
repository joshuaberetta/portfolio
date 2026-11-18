import React, { useEffect, useRef } from "react";

// Grid size of the avatar and how many colours it keeps. Small numbers give
// the chunky look of an image drawn with half-block characters in a terminal.
const GRID = 32;
const COLOURS = 20;
// Square crop of the photo, as fractions of its width/height, around the face.
const CROP = { x: 0.14, y: 0.06, size: 0.74 };

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

interface PixelAvatarProps {
  src: string;
  alt: string;
  /** Redraws when this changes, so the edges fade into the new background. */
  theme: string;
}

const PixelAvatar: React.FC<PixelAvatarProps> = ({ src, alt, theme }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
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
      ctx.putImageData(toImageData(quantize(pixels, COLOURS)), 0, 0);
    };
    img.src = src;
  }, [src, theme]);

  return (
    <canvas
      ref={canvas}
      width={GRID}
      height={GRID}
      className="avatar"
      role="img"
      aria-label={alt}
    />
  );
};

export default PixelAvatar;
