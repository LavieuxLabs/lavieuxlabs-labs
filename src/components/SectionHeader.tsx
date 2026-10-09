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
      <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-white/60">
        <span className="h-px w-6 bg-white/20" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-white/55">{description}</p>}
    </Reveal>
  );
}
