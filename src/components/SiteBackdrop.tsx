// Site-wide atmosphere: dark clinical base, a faint technical grid and deep, soft light.
// Rendered once in the root layout so every page shares the same background language;
// sections should not add their own grids (they would sit on a different 64px origin).
export default function SiteBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none">
      {/* Fixed layer: grid + ambient glow that stay with the viewport */}
      <div className="fixed inset-0 -z-10">
        <div className="bg-grid mask-vignette absolute inset-0 opacity-80" />
        <div className="absolute -right-[20%] -bottom-[30%] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.07),transparent)]" />
      </div>
      {/* Scrolling layer: a deep, soft glow over the top of each page */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[1100px] overflow-hidden">
        <div className="absolute top-[-420px] left-1/2 h-[1000px] w-[1400px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,0.11),rgba(16,185,129,0.04)_45%,transparent)]" />
        <div className="absolute top-[-200px] left-[8%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(129,140,248,0.06),transparent)]" />
      </div>
    </div>
  );
}
