import type { LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";

export type FlowStep = {
  icon: LucideIcon;
  title: string;
  body: string;
  detail?: string;
};

type FlowDiagramProps = {
  steps: FlowStep[];
  accent?: "teal" | "indigo";
};

// Literal class strings so Tailwind can detect them at build time.
const tones = {
  teal: {
    card: "hover:border-teal-400/30 hover:bg-teal-400/[0.04] hover:shadow-[0_0_32px_-12px_rgba(45,212,191,0.45)]",
    icon: "group-hover:text-teal-300",
    line: "from-teal-300/50",
  },
  indigo: {
    card: "hover:border-indigo-400/30 hover:bg-indigo-400/[0.05] hover:shadow-[0_0_32px_-12px_rgba(129,140,248,0.5)]",
    icon: "group-hover:text-indigo-300",
    line: "from-indigo-300/50",
  },
};

export default function FlowDiagram({ steps, accent = "teal" }: FlowDiagramProps) {
  const tone = tones[accent];

  return (
    <ol className="relative grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {steps.map(({ icon: Icon, title, body, detail }, i) => (
        <li key={title} className="relative">
          <Reveal delay={(i % 3) * 0.06} className="h-full">
            <div
              className={`group relative flex h-full flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition-[border-color,background-color,box-shadow] duration-300 ${tone.card}`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 text-white/45 transition-colors duration-300 ${tone.icon}`} strokeWidth={1.6} />
                <span className="font-mono text-[10.5px] tracking-[0.16em] text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-medium text-white">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">{body}</p>
              {detail && (
                <p className="mt-auto pt-4 font-mono text-[11px] leading-relaxed text-white/40">
                  <span className={`mr-2 inline-block h-px w-4 bg-gradient-to-r ${tone.line} to-transparent align-middle`} />
                  {detail}
                </p>
              )}
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
