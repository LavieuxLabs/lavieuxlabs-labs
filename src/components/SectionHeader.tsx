import Reveal from "@/components/Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export default function SectionHeader({ eyebrow, title, description, className = "" }: SectionHeaderProps) {
  return (
    <Reveal className={`max-w-2xl ${className}`}>
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-teal-300/80">
        <span className="h-px w-6 bg-teal-300/50" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-white/55">{description}</p>}
    </Reveal>
  );
}
