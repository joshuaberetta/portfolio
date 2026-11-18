import React from "react";

import { Line, Span, lineLength } from "./markdown";

function renderSpan(span: Span, text: string, key: number) {
  const className =
    [span.bold && "b", span.italic && "i", span.code && "code"]
      .filter(Boolean)
      .join(" ") || undefined;
  if (span.href) {
    const external = /^https?:/.test(span.href);
    return (
      <a
        key={key}
        href={span.href}
        className="link"
        download={span.download}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {text}
      </a>
    );
  }
  return (
    <span key={key} className={className}>
      {text}
    </span>
  );
}

interface ResponseProps {
  lines: Line[];
  /** How many characters have streamed in so far. */
  shown: number;
}

/** A response, cut off after `shown` characters while it streams. */
const Response: React.FC<ResponseProps> = ({ lines, shown }) => {
  let budget = shown;
  const out: React.ReactNode[] = [];
  for (const [i, line] of lines.entries()) {
    if (budget <= 0) break;
    const spans: React.ReactNode[] = [];
    let left = budget;
    for (const [j, span] of line.spans.entries()) {
      if (left <= 0) break;
      spans.push(renderSpan(span, span.text.slice(0, left), j));
      left -= span.text.length;
    }
    budget -= lineLength(line);
    out.push(
      <div key={i} className={`line ${line.kind}`}>
        {line.kind === "bullet" && <span className="dash">-</span>}
        <span className="content">{spans}</span>
      </div>
    );
  }
  return <div className="response">{out}</div>;
};

export default Response;
