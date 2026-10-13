import { Fragment, type ReactNode } from "react";

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b/g;

/** JSON with neutral syntax emphasis: keys bright, strings softer, numbers and literals in full white. */
export function highlightJson(json: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of json.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > last) out.push(<Fragment key={i++}>{json.slice(last, start)}</Fragment>);
    if (m[1] && m[2]) {
      out.push(
        <span key={i++} className="text-white/85">
          {m[1]}
        </span>,
        <Fragment key={i++}>{m[2]}</Fragment>,
      );
    } else if (m[1]) {
      out.push(
        <span key={i++} className="text-white/60">
          {m[1]}
        </span>,
      );
    } else {
      out.push(
        <span key={i++} className="font-medium text-white">
          {m[0]}
        </span>,
      );
    }
    last = start + m[0].length;
  }
  if (last < json.length) out.push(<Fragment key={i++}>{json.slice(last)}</Fragment>);
  return out;
}
