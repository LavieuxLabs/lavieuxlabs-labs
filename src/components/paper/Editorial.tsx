import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

// Shared pieces of the paper surface (Academic Editorial) for pages other than the home page, which keeps
// its own copies of the same classes. Ink on paper, a 12-column grid with the section label in the left
// three columns, Newsreader for headings and labels, IBM Plex Sans for running text.

export const LINK =
  "underline decoration-ink/30 underline-offset-4 transition-colors duration-150 ease-out hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";
// Standalone text links get a 44px touch target; inline links inside sentences do not need one.
export const TEXT_ACTION = `inline-flex min-h-11 items-center text-[15px] font-medium text-ink ${LINK}`;
export const BUTTON = `inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 py-3 text-[15px] font-medium text-white transition-colors duration-150 ease-out hover:bg-ink-2 ${FOCUS}`;
export const BUTTON_OUTLINE = `inline-flex min-h-11 items-center justify-center rounded-md border border-ink/30 bg-white px-5 py-3 text-[15px] font-medium text-ink transition-colors duration-150 ease-out hover:border-ink ${FOCUS}`;

/** A page section: label in the left three columns, heading and intro in the other nine, content below. */
export function PaperSection({
  id,
  label,
  title,
  intro,
  band = false,
  children,
}: {
  id: string;
  label: string;
  title: string;
  intro?: ReactNode;
  band?: boolean;
  children: ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-16 border-t border-rule ${band ? "bg-paper-band" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-x-10 gap-y-3 lg:grid-cols-12">
          <p className="font-serif text-[17px] text-ink-3 lg:col-span-3 lg:pt-2">{label}</p>
          <div className="lg:col-span-9">
            <h2 id={headingId} className="max-w-[26ch] font-serif text-[30px] leading-[1.1] font-medium tracking-[-0.015em] text-ink sm:text-[40px]">
              {title}
            </h2>
            {intro && <div className="mt-4 max-w-[64ch] space-y-3 text-[17px] leading-[1.65] text-ink-2">{intro}</div>}
          </div>
        </div>
        <div className="mt-8 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}

/**
 * Technical detail on demand: a native <details>, so it opens with Enter or Space and needs no script. The
 * summary is a 44px target; `meta` says what is inside before it is opened. Print opens every disclosure.
 */
export function Disclosure({ summary, meta, children }: { summary: ReactNode; meta?: ReactNode; children: ReactNode }) {
  return (
    <details className="group/d">
      <summary
        className={`flex min-h-11 cursor-pointer list-none flex-wrap items-center gap-x-2 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden ${FOCUS}`}
      >
        <ChevronRight
          className="h-4 w-4 shrink-0 transition-transform duration-150 ease-out group-open/d:rotate-90 print:hidden"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className="underline decoration-ink/30 underline-offset-4 transition-colors duration-150 ease-out group-hover/d:decoration-ink">
          {summary}
        </span>
        {meta && <span className="text-[14px] font-normal text-ink-3">{meta}</span>}
      </summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

/** Label / value rows with full-width rules, for facts. */
export function FactRows({ rows, labelWidth = "sm:grid-cols-[150px_minmax(0,1fr)]" }: { rows: { label: string; value: ReactNode }[]; labelWidth?: string }) {
  return (
    <dl className="divide-y divide-rule border-y border-rule">
      {rows.map((r) => (
        <div key={r.label} className={`grid gap-1 py-3 sm:gap-4 ${labelWidth}`}>
          <dt className="text-[14px] text-ink-3">{r.label}</dt>
          <dd className="text-[15px] leading-snug text-ink">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
