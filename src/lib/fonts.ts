import { Geist, Geist_Mono } from "next/font/google";

// Shared by both root layouts and the global 404 so every document loads the same font files.
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});
