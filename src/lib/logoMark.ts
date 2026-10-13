// LavieuxLabs "Stratum LL" monogram, the umbrella mark for every product line: two nested, stepped L
// layers on a 32-unit grid, like slides or data layers. 4-unit bars, a 3-unit channel on both axes
// (1.5px at 16px, so the layers stay apart), the inner L starts 4 units lower, both feet end at x=25.
// Each terminal end has a 1.5-unit 45° chamfer on its top-right corner; the four cuts lie parallel.
// Single geometry for every size: LogoMark (src/components/Navbar.tsx), the OG card
// (src/lib/ogImage.tsx) and the favicon (src/app/icon.svg, a static file with the same two paths).
export const MARK_VIEWBOX = "0 0 32 32";
export const MARK_OUTER = "M7 5H9.5L11 6.5V23H23.5L25 24.5V27H7Z";
export const MARK_INNER = "M14 9H16.5L18 10.5V16H23.5L25 17.5V20H14Z";
