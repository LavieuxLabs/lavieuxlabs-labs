import Reveal from "@/components/Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
  /** Product page accent: a short rule above the eyebrow. */
  accent?: "pharma" | "shield";
};

export default function SectionHeader({ eyebrow, title, description, className = "", accent }: SectionHeaderProps) {
  return (
    <Reveal className={`relative max-w-2xl ${className}`}>
      {accent && (
        <span
          aria-hidden="true"
          className={`absolute -top-5 left-0 h-px w-10 ${accent === "pharma" ? "bg-pharma/70" : "bg-shield/70"}`}
        />
      )}
      <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-serif font-medium tracking-[-0.02em] text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-white/55">{description}</p>}
    </Reveal>
  );
}
