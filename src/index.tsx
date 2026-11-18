import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Mobile keyboards cover the bottom of the page without shrinking it (iOS
// Safari ignores dvh for the keyboard), which hides the prompt. Size the
// screen to the part of the page that is actually visible instead.
const vv = window.visualViewport;
if (vv) {
  const root = document.documentElement;
  const fit = () => {
    root.style.setProperty("--vvh", `${vv.height}px`);
    // iOS scrolls the page to reveal the focused input; undo it, since the
    // screen now fits above the keyboard anyway.
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  };
  fit();
  vv.addEventListener("resize", fit);
  vv.addEventListener("scroll", fit);
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
