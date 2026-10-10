// Site-wide ground as optical depth rather than a bare grid: a surgical-navy focus that falls off
// to hardware black-navy at the edges (lens vignette), a barely-there coordinate grid as micro
// texture, and a ~1.8% analog grain over everything so surfaces read as a physical device housing
// instead of a sterile web page. No glows: the focus is neutral and stays below card luminance.
// Sections must not add their own grids (they would sit on a different 64px origin).
export default function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none print:hidden">
      <div className="bg-optic fixed inset-0 -z-20" />
      <div className="bg-grid mask-vignette fixed inset-0 -z-10" />
      {/* Grain sits above content at very low opacity; it never intercepts input. */}
      <div className="bg-grain fixed inset-0 z-[70] opacity-[0.018]" />
    </div>
  );
}
