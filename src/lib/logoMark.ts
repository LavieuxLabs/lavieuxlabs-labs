// LavieuxLabs mark, the umbrella mark for every product line: two nested "L" forms drawn in isometric
// projection (each L one closed outline, upright running into the foot without a seam; edges on a 2:3
// slope), the inner L set back
// along the depth axis, and an equal-armed medical plus on the right wing. Single source for LogoMark
// (src/components/LogoMark.tsx) and the OG card (src/lib/ogImage.tsx). Line drawing on a 32-unit grid,
// 1.75-unit stroke. One colour for the whole mark: pure white, the same as the wordmark, so the plus reads as
// part of the body. The favicon (src/app/icon.svg) is the same silhouettes filled solid white.
export const MARK_VIEWBOX = "0 0 32 32";
export const MARK_STROKE = 1.75;
export const MARK_COLOR = "#FFFFFF";
/** L body: one closed outline per L, outer L first. */
export const MARK_BODY = ["M6 11.5 10.5 8.5V19l9 6-4.5 3-9-6z", "M12.75 7l4.5-3v10.5l9 6-4.5 3-9-6z"] as const;
/** Equal-armed medical plus on the right wing. */
export const MARK_PLUS = "M22 7.5h3v2.5h2.5v3H25v2.5h-3V13h-2.5v-3H22z";
