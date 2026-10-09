"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL, solutions, type SolutionValue } from "@/lib/site";
import { solutionContent } from "@/lib/solutionContent";

function isSolution(value: string | null): value is SolutionValue {
  return solutions.some((s) => s.value === value);
}

/** Process steps and the form share one selected solution, so both respond to the tabs. */
export default function ContactExperience({ initialSolution = "pharmadeux" }: { initialSolution?: SolutionValue }) {
  const [solution, setSolution] = useState<SolutionValue>(initialSolution);
  const reduced = useReducedMotion();
  const content = solutionContent[solution];

  const choose = (next: SolutionValue) => {
    setSolution(next);
    // Keep the choice in the URL so a refresh or shared link opens the same tab.
    window.history.replaceState(null, "", `?solution=${next}`);
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.5fr] lg:px-8">
      <div className="space-y-10">
        <section aria-labelledby="process-title">
          <p id="process-title" className="text-[11px] font-medium tracking-wider text-white/50 uppercase">
            Süreç
          </p>
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ol
                key={solution}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 space-y-6"
              >
                {content.steps.map(({ icon: Icon, title, body }, i) => (
                  <li key={title} className="flex gap-4">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center ${content.accent.text}`}>
                      <Icon className="h-4 w-4" strokeWidth={1.7} />
                    </div>
                    <div>
                      <p className="font-mono text-[10.5px] text-white/35">ADIM {String(i + 1).padStart(2, "0")}</p>
                      <h2 className="mt-0.5 text-[15px] font-medium text-white">{title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{body}</p>
                    </div>
                  </li>
                ))}
              </motion.ol>
            </AnimatePresence>
          </div>
        </section>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">E-posta</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-flex items-center gap-2 font-mono text-sm text-white transition-colors hover:text-teal-200"
          >
            <Mail className="h-4 w-4 text-white/45" aria-hidden="true" />
            {CONTACT_EMAIL}
          </a>
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            Lütfen iletişim kanallarımız üzerinden hasta verisi veya özel nitelikli kişisel veri paylaşmayınız.
          </p>
        </div>
      </div>

      <ContactForm solution={solution} onSolutionChange={choose} />
    </div>
  );
}

export function ContactExperienceFromParams() {
  const solution = useSearchParams().get("solution");
  return <ContactExperience initialSolution={isSolution(solution) ? solution : undefined} />;
}
