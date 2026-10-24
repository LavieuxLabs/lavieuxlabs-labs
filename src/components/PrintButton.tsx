"use client";

import { Printer } from "lucide-react";

type PrintButtonProps = {
  /** Value for <html data-print>; globals.css hides everything on the page except the matching sheet. */
  target: string;
  /** Used as document.title while printing, so "Save as PDF" suggests a sensible file name. */
  documentTitle: string;
  label: string;
  /** "paper" on paper pages (ink outline); "dark" everywhere else. */
  tone?: "dark" | "paper";
  className?: string;
};

/**
 * Opens the browser's print dialog (which also offers "Save as PDF") for one section of the page.
 * The section is marked with data-print-sheet; the print stylesheet does the rest.
 */
const tones = {
  dark: "rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white hover:bg-white/[0.1]",
  paper:
    "min-h-11 rounded-md border border-ink/30 bg-white px-4 py-2.5 text-[15px] text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink",
};

export default function PrintButton({ target, documentTitle, label, tone = "dark", className = "" }: PrintButtonProps) {
  const print = () => {
    const root = document.documentElement;
    const previousTitle = document.title;
    root.dataset.print = target;
    document.title = documentTitle;
    const restore = () => {
      delete root.dataset.print;
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  };

  return (
    <button
      type="button"
      onClick={print}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 ease-out print:hidden ${tones[tone]} ${className}`}
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
