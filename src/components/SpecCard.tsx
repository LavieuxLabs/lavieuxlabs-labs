import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import Cite from "@/components/Cite";
import type { CiteKey } from "@/lib/citations";

export type SpecRow = { label: string; value: string; mono?: boolean; cite?: CiteKey };

type Tone = "input" | "prep" | "live";
type Accent = "pharma" | "shield";

/**
 * Row alignment inside a JoinedGrid: `rows` is the largest number of spec rows in the grid and `outcome`
 * whether the cells carry an outcome block. The cell then becomes a subgrid spanning
 * header · title · body · one track per spec row · outcome, so neighbouring cells line up track by track.
 */
export type CellAlign = { rows: number; outcome?: boolean };

type SpecCardProps = {
  id?: string;
  icon?: LucideIcon;
  title: string;
  body?: string;
  rows?: SpecRow[];
  status?: { label: string; tone: Tone };
  /** What the card means for one named audience, below the spec rows. */
  outcome?: { label: string; body: string };
  /**
   * Product the card belongs to: top/left border at rest (30%), id code, icon on hover and outcome label
   * carry its accent; hover lights the whole border.
   */
  accent?: Accent;
  /** Stronger product presence (About R&D cards): full accent border at rest and the title in the accent. */
  prominent?: boolean;
  /**
   * "card" = a standalone card with its own frame; "cell" = one cell of a JoinedGrid: no frame or radius
   * of its own (it shares the grid's 1px hairlines) and its spec rows run edge to edge.
   */
  variant?: "card" | "cell";
  /** Cell only: align header, body, each spec row and the outcome with the neighbouring cells (CSS subgrid). */
  align?: CellAlign;
  /**
   * Cell only, "hover": the accent top line appears only on hover. Use it in grids that mix products and
   * neutral cells, so the shared top edge stays one uniform hairline at rest; the code label keeps the accent.
   */
  accentLine?: "rest" | "hover";
};

// The card / cell always keeps its complete neutral hairline mesh on all four sides. A product accent is
// one clean line on the top edge only (brighter on hover); it never replaces, overlaps or half-covers a
// side of the mesh. `line` draws it in a joined-grid cell, `edge` on a standalone rounded card.
type AccentClasses = { line: string; lineHover: string; edge: string; card: string; icon: string; id: string; title: string; outcome: string };

// Literal class strings so Tailwind can detect them at build time. `card` on the neutral card styles the
// card's own border on hover.
const accents: Record<Accent | "none", AccentClasses> = {
  pharma: {
    line: "bg-pharma/45 group-hover:bg-pharma/55",
    lineHover: "bg-transparent group-hover:bg-pharma/55",
    edge: "border-t-pharma/45 group-hover:border-t-pharma/55",
    card: "",
    icon: "group-hover:text-pharma",
    id: "text-teal-300",
    title: "text-teal-200",
    outcome: "text-teal-300",
  },
  shield: {
    line: "bg-shield/45 group-hover:bg-shield/55",
    lineHover: "bg-transparent group-hover:bg-shield/55",
    edge: "border-t-shield/45 group-hover:border-t-shield/55",
    card: "",
    icon: "group-hover:text-shield",
    id: "text-indigo-300",
    title: "text-indigo-200",
    outcome: "text-indigo-300",
  },
  none: {
    line: "",
    lineHover: "",
    edge: "",
    card: "hover:border-white/20",
    icon: "group-hover:text-white/85",
    id: "text-white/70",
    title: "text-white",
    outcome: "text-white/50",
  },
};

// Labels are uppercased with CSS; MDR class names (IIa, IIb) must keep their case or they read as "IIA".
function keepClassCase(label: string) {
  return label.split(/\b(I{1,3}[ab])\b/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="normal-case">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// Implementation stage, left to right: a reference the design follows → being prepared → built and tested.
// It is a progress track, not a certification mark: none of these steps claims a certificate.
const STAGES: Tone[] = ["input", "prep", "live"];

// Fixed tracks before the spec rows: header, title, body.
const LEAD_TRACKS = 3;

/**
 * A technical specification card in the Rams / datasheet idiom: an identifier, a plain title, one
 * sentence of purpose, then labelled spec rows on hairlines. No glow, no decoration; the surface
 * step (navy-850 on navy-900) and the hairline border carry the depth, and hover answers with a
 * slightly brighter border (in the product accent on product pages).
 */
export default function SpecCard({
  id,
  icon: Icon,
  title,
  body,
  rows,
  status,
  outcome,
  accent,
  prominent,
  variant = "card",
  align,
  accentLine = "rest",
}: SpecCardProps) {
  const a = accents[accent ?? "none"];
  const reached = status ? STAGES.indexOf(status.tone) : -1;
  const cell = variant === "cell";
  const sub = cell && align ? align : null;
  const tracks = sub ? LEAD_TRACKS + sub.rows + (sub.outcome ? 1 : 0) : 0;
  const hasRows = Boolean(rows && rows.length > 0);
  // In a cell, rows and the outcome bleed out of the padding so their hairlines meet the cell edges.
  const bleed = cell ? "-mx-5 px-5 sm:-mx-6 sm:px-6" : "";

  const overlay =
    accent &&
    (cell ? (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-px transition-colors duration-150 ease-out ${accentLine === "hover" ? a.lineHover : a.line}`}
      />
    ) : (
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -inset-px rounded-2xl border-t border-transparent transition-colors duration-150 ease-out ${a.edge}`}
      />
    ));

  const header = (
    <header className="flex items-start justify-between gap-3">
      <span className="flex items-center gap-2">
        {Icon && (
          <Icon
            className={`h-4 w-4 text-white/55 transition-colors duration-150 ease-out ${a.icon}`}
            strokeWidth={1.6}
            aria-hidden="true"
          />
        )}
        {id && <span className={`font-mono text-[11px] whitespace-nowrap tabular-nums ${a.id}`}>{id}</span>}
      </span>
      {status && (
        <span className="flex flex-col items-end gap-1.5">
          <span className="text-right text-[11px] font-medium tracking-wider text-white/50 uppercase">
            {keepClassCase(status.label)}
          </span>
          <span className="flex gap-0.5" aria-hidden="true">
            {STAGES.map((stage, i) => (
              <span
                key={stage}
                className={`h-[3px] w-4 rounded-full ${i <= reached ? "bg-white/70" : "bg-white/[0.12]"}`}
              />
            ))}
          </span>
        </span>
      )}
    </header>
  );

  const titleEl = (
    <h3 className={`mt-4 text-[15px] font-semibold tracking-[-0.01em] ${prominent ? a.title : "text-white"}`}>{title}</h3>
  );

  const rowContent = (row: SpecRow) => (
    <>
      <dt className="text-[11.5px] text-white/55">{row.label}</dt>
      <dd className={`text-[12.5px] leading-snug text-white/75 ${row.mono ? "font-mono tabular-nums" : ""}`}>
        {row.value}
        {row.cite && <Cite id={row.cite} />}
      </dd>
    </>
  );

  const outcomeBody = outcome && (
    <>
      <p className={`text-[11px] font-medium tracking-wider uppercase ${a.outcome}`}>{outcome.label}</p>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/75">{outcome.body}</p>
    </>
  );

  // Subgrid cell: every block sits on its own track of the parent grid, so the body, each row line and
  // the outcome start at the same height in every cell of the same grid row ("ruled" rows).
  if (sub) {
    return (
      <article
        className="group relative grid grid-rows-subgrid bg-navy-850 p-5 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-6"
        style={{ gridRow: `span ${tracks} / span ${tracks}` }}
      >
        {overlay}
        {header}
        {titleEl}
        {body ? <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{body}</p> : <span />}
        {hasRows && (
          // `contents`: the list keeps its semantics while each row becomes a track of the subgrid.
          <dl className="contents">
            {rows!.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-[92px_1fr] items-start gap-3 border-t border-hairline py-2 ${bleed} ${i === 0 ? "mt-5" : ""}`}
              >
                {rowContent(row)}
              </div>
            ))}
          </dl>
        )}
        {outcome && (
          <div className={`self-start border-t border-hairline pt-4 ${bleed} ${hasRows ? "mt-4" : "mt-5"}`} style={{ gridRow: tracks }}>
            {outcomeBody}
          </div>
        )}
      </article>
    );
  }

  return (
    <article
      className={`group relative flex h-full flex-col bg-navy-850 p-5 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-6 ${
        cell ? "" : `rounded-2xl border border-hairline ${accent ? "" : a.card}`
      }`}
    >
      {overlay}
      {header}
      {titleEl}
      {body && <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{body}</p>}
      {hasRows && (
        <div className="mt-auto pt-5">
          <dl className={`divide-y divide-hairline border-t border-hairline ${cell ? "-mx-5 sm:-mx-6" : ""}`}>
            {rows!.map((row) => (
              <div key={row.label} className={`grid grid-cols-[92px_1fr] gap-3 py-2 ${cell ? "px-5 sm:px-6" : ""}`}>
                {rowContent(row)}
              </div>
            ))}
          </dl>
        </div>
      )}
      {outcome && (
        <div className={`border-t border-hairline pt-4 ${bleed} ${hasRows ? (cell ? "" : "mt-4") : "mt-auto"}`}>{outcomeBody}</div>
      )}
    </article>
  );
}

/**
 * Joined monolithic grid: one hairline frame, cells side by side with gap-px, so every cell shares a
 * single 1px hairline with its neighbours instead of floating with its own border. The whole grid
 * fades in as one block (per-cell fades would let the hairline background flash through).
 * `columns` holds the responsive grid-cols classes, e.g. "sm:grid-cols-2 xl:grid-cols-4". Cells given
 * `align` become subgrids, so their blocks and row lines line up across the grid row.
 */
export function JoinedGrid({
  columns,
  children,
  as = "div",
  className = "",
}: {
  columns: string;
  children: ReactNode;
  as?: "div" | "ul";
  className?: string;
}) {
  const Tag = as;
  return (
    <Reveal className={className}>
      <Tag className={`grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline ${columns}`}>{children}</Tag>
    </Reveal>
  );
}
