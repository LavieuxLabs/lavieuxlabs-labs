import type { LucideIcon } from "lucide-react";

export type SpecRow = { label: string; value: string; mono?: boolean };

type SpecCardProps = {
  id?: string;
  icon?: LucideIcon;
  title: string;
  body?: string;
  rows?: SpecRow[];
  status?: { label: string; tone: "live" | "prep" | "input" };
};

/**
 * A technical specification card in the Rams / datasheet idiom: an identifier, a plain title, one
 * sentence of purpose, then labelled spec rows on hairlines. No glow, no decoration; the surface
 * step (navy-850 on navy-900) and the hairline border carry the depth.
 */
export default function SpecCard({ id, icon: Icon, title, body, rows, status }: SpecCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-navy-850 p-5 transition-colors duration-150 ease-out hover:bg-navy-800 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-white/55" strokeWidth={1.6} aria-hidden="true" />}
          {id && <span className="font-mono text-[11px] text-white/55 tabular-nums">{id}</span>}
        </span>
        {status && (
          <span className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{status.label}</span>
        )}
      </header>
      <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-white">{title}</h3>
      {body && <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{body}</p>}
      {rows && rows.length > 0 && (
        <div className="mt-auto pt-5">
          <dl className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[92px_1fr] gap-3 py-2">
                <dt className="text-[11.5px] text-white/55">{row.label}</dt>
                <dd className={`text-[12.5px] leading-snug text-white/75 ${row.mono ? "font-mono tabular-nums" : ""}`}>
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}
