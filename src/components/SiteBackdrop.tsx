// Site-wide atmosphere: dark clinical navy, a faint technical grid and a neutral shift in surface
// tone toward the top of each page. No coloured glows: depth comes from surface contrast and
// hairlines. Sections should not add their own grids (they would sit on a different 64px origin).
export default function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      <div className="fixed inset-0 -z-10">
        <div className="bg-grid mask-vignette absolute inset-0 opacity-60" />
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 h-[900px] bg-gradient-to-b from-white/[0.025] to-transparent" />
    </div>
  );
}
