import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { SpecRow } from "@/components/SpecCard";

export const linkCellClass =
  "flex items-center justify-between gap-3 px-5 py-3.5 text-[13px] font-medium text-white/80 transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-white sm:px-6";

export function ExternalCell({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCellClass}>
      <span lang="en">{label}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/55" aria-hidden="true" />
    </a>
  );
}

/**
 * One cell of a joined grid (team, partners, audiences), in the SpecCard idiom: label, title, two sentences, spec rows on hairlines,
 * then a link strip that bleeds to the cell edges and sits flush on the bottom hairline.
 */
export default function DetailCell({
  icon: Icon,
  label,
  title,
  subtitle,
  body,
  rows,
  children,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: string;
  body: string;
  rows: SpecRow[];
  children: ReactNode;
}) {
  // From lg the cell is a subgrid: label · name · body · one track per spec row · links. Neighbouring
  // cells then draw every row line at the same height, even when a value wraps in only one of them.
  const tracks = 4 + rows.length;
  return (
    <article
      className="flex h-full flex-col bg-navy-850 p-5 pb-0 sm:p-6 sm:pb-0 lg:grid lg:grid-rows-subgrid lg:gap-0"
      style={{ gridRow: `span ${tracks} / span ${tracks}` }}
    >
      <header className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-white/55" strokeWidth={1.6} aria-hidden="true" />
        <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{label}</p>
      </header>
      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-white/60">{subtitle}</p>}
      </div>
      <p className="mt-3 max-w-xl text-[13.5px] leading-relaxed text-white/55">{body}</p>
      {/* `contents`: the list keeps its semantics while each row becomes a track of the subgrid. */}
      <dl className="contents">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`-mx-5 grid grid-cols-[92px_1fr] items-start gap-3 border-t border-hairline px-5 py-2 sm:-mx-6 sm:px-6 ${i === 0 ? "mt-8" : ""}`}
          >
            <dt className="text-[11.5px] text-white/55">{row.label}</dt>
            <dd className="text-[12.5px] leading-snug text-white/75">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="-mx-5 mt-auto grid divide-y divide-hairline border-t border-hairline sm:-mx-6 sm:auto-cols-fr sm:grid-flow-col sm:divide-x sm:divide-y-0 lg:mt-0 lg:self-end">
        {children}
      </div>
    </article>
  );
}

/** Site-internal link cell for the DetailCell link strip; `href` is already localised. */
export function InternalCell({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={linkCellClass}>
      {label}
      <ArrowRight className="h-4 w-4 shrink-0 text-white/55" aria-hidden="true" />
    </Link>
  );
}
