"use client";

import { Printer } from "lucide-react";

type PrintButtonProps = {
  /** Value for <html data-print>; globals.css hides everything on the page except the matching sheet. */
  target: string;
  /** Used as document.title while printing, so "Save as PDF" suggests a sensible file name. */
  documentTitle: string;
  label: string;
  className?: string;
};

/**
 * Opens the browser's print dialog (which also offers "Save as PDF") for one section of the page.
 * The section is marked with data-print-sheet; the print stylesheet does the rest.
 */
export default function PrintButton({ target, documentTitle, label, className = "" }: PrintButtonProps) {
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-out hover:bg-white/[0.1] print:hidden ${className}`}
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
