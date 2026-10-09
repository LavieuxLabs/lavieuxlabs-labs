import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";

export type FlowStep = {
  icon: LucideIcon;
  title: string;
  body: string;
  /** Payload or guarantee of the stage; " · "-separated values render as mono tokens. */
  detail?: string;
};

type FlowDiagramProps = {
  steps: FlowStep[];
  accent?: "teal" | "indigo";
};

// Literal class strings so Tailwind can detect them at build time.
const tones = {
  teal: {
    rail: "group-hover:bg-pharma/70",
    node: "group-hover:border-pharma group-hover:bg-pharma",
    icon: "group-hover:text-pharma",
  },
  indigo: {
    rail: "group-hover:bg-shield/70",
    node: "group-hover:border-shield group-hover:bg-shield",
    icon: "group-hover:text-shield",
  },
};

/**
 * A data pipeline (e.g. HL7 FHIR ingest → rule engine → clinician → audit) drawn as stages on a
 * single hairline rail instead of boxed cards. Each stage lists what it carries as mono tokens.
 */
export default function FlowDiagram({ steps, accent = "teal" }: FlowDiagramProps) {
  const tone = tones[accent];

  return (
    <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {steps.map(({ icon: Icon, title, body, detail }, i) => (
        <li key={title} className="group relative min-w-0">
          <Reveal delay={(i % 6) * 0.04} className="h-full">
            {/* Rail segment with a stage node */}
            <div className="relative flex items-center" aria-hidden="true">
              <span
                className={`relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border border-white/30 bg-navy-900 transition-colors duration-150 ease-out ${tone.node}`}
              />
              <span className={`h-px flex-1 bg-white/[0.12] transition-colors duration-150 ease-out ${tone.rail}`} />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <Icon
                className={`h-4 w-4 text-white/40 transition-colors duration-150 ease-out ${tone.icon}`}
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] text-white/35 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-2 text-[15px] font-medium text-white">{title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/55">{body}</p>
            {detail && (
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${title} · veri`}>
                {detail.split(" · ").map((token) => (
                  <li
                    key={token}
                    className="rounded-md border border-white/[0.06] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[11px] text-white/55"
                  >
                    {token}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
