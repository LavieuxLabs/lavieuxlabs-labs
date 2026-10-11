import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";

// Shared by both root layouts and the global 404 so every document loads the same font files.
// Roles: sans = body and cards, serif = hero and section titles (plus the italic signature), mono = numbers.
export const fontSans = IBM_Plex_Sans({
  variable: "--font-brand-sans",
  subsets: ["latin", "latin-ext"],
});

// Variable weight + optical size axis, so headings keep the 600 weight and large sizes get display cuts.
export const fontSerif = Newsreader({
  variable: "--font-brand-serif",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Plex Mono is not variable; load only the weights numbers use.
export const fontMono = IBM_Plex_Mono({
  variable: "--font-brand-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const fontVariables = `${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`;
