// Site-wide ground: surgical clinical navy, a barely-there coordinate grid and a monochrome light
// falloff from the top of the page. No glows of any kind: depth comes from surface steps
// (navy-900 → 850 → 800) and hairlines. Sections must not add their own grids (they would sit on
// a different 64px origin).
export default function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className="bg-grid mask-vignette fixed inset-0 -z-10" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-gradient-to-b from-white/[0.03] to-transparent" />
    </div>
  );
}
