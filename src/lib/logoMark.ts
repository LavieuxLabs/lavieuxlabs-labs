// LavieuxLabs mark, the umbrella mark for every product line: two nested "L" forms drawn in isometric
// projection (vertical face + foot, one plane seam each; edges on a 2:3 slope), the inner L set back
// along the depth axis, and an equal-armed medical plus on the right wing. Single source for LogoMark
// (src/components/LogoMark.tsx) and the OG card (src/lib/ogImage.tsx). Line drawing on a 32-unit grid,
// 1.75-unit stroke. Dual tone: the L body is the neutral spine (titanium, via currentColor), the plus is
// the mark's own violet. Not a product accent, and not Tailwind indigo (remapped to Shield mustard here).
// The favicon (src/app/icon.svg) is a filled, 16px-tuned rendering of the same planes.
export const MARK_VIEWBOX = "0 0 32 32";
export const MARK_STROKE = 1.75;
export const MARK_PLUS_COLOR = "#7F88FF";
/** L body: outlines (silhouettes) and plane seams, outer L first. */
export const MARK_BODY = [
  "M6 11.5 10.5 8.5V19l9 6-4.5 3-9-6z",
  "M10.5 19 6 22",
  "M12.75 7l4.5-3v10.5l9 6-4.5 3-9-6z",
  "M17.25 14.5 12.75 17.5",
] as const;
/** Equal-armed medical plus on the right wing. */
export const MARK_PLUS = "M22 7.5h3v2.5h2.5v3H25v2.5h-3V13h-2.5v-3H22z";
