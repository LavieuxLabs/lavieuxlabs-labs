// Pages drawn on the paper surface (Academic Editorial). Every other page keeps the dark ground. The navbar
// and the cookie banner read this to take the matching tone; the page itself sets `main.surface-paper`.
// Paths are locale-free (see stripLocale). PAPER_PATHS match exactly; PAPER_PREFIXES cover a whole section, so a new
// standards reference page is on paper without another entry here.
export const PAPER_PATHS: readonly string[] = ["/", "/initiatives/pharmadeux", "/initiatives/shield", "/contact", "/about", "/standartlar"];
export const PAPER_PREFIXES: readonly string[] = ["/standartlar/", "/legal/"];

export const isPaperPath = (path: string) => PAPER_PATHS.includes(path) || PAPER_PREFIXES.some((prefix) => path.startsWith(prefix));
