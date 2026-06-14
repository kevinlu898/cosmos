const STARS = [
  { left: "6%", top: "30%", size: 2, delay: 0, dur: 2.6 },
  { left: "14%", top: "64%", size: 1.5, delay: 0.8, dur: 3.1 },
  { left: "22%", top: "22%", size: 2.5, delay: 1.4, dur: 2.2 },
  { left: "31%", top: "72%", size: 1.5, delay: 0.4, dur: 3.4 },
  { left: "41%", top: "40%", size: 2, delay: 1.1, dur: 2.8 },
  { left: "52%", top: "20%", size: 1.5, delay: 0.2, dur: 3.0 },
  { left: "60%", top: "66%", size: 2.5, delay: 1.7, dur: 2.4 },
  { left: "69%", top: "34%", size: 1.5, delay: 0.6, dur: 3.3 },
  { left: "78%", top: "58%", size: 2, delay: 1.3, dur: 2.7 },
  { left: "86%", top: "26%", size: 2.5, delay: 0.9, dur: 2.5 },
  { left: "93%", top: "62%", size: 1.5, delay: 1.6, dur: 3.2 },
];

export function TopBar({ left, title, right }) {
  return (
    <nav className="relative z-30 flex h-28 items-center justify-between gap-3 overflow-hidden border-b border-white/10 bg-gradient-to-r from-cosmos-navy via-cosmos-purple to-cosmos-blue px-4 py-1 shadow-lg">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />

      {/* Milky Way */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -inset-x-10 top-1/2 h-24 -translate-y-1/2 -rotate-6 bg-[linear-gradient(100deg,_transparent,_rgba(199,210,254,0.35)_35%,_rgba(255,255,255,0.45)_50%,_rgba(216,180,254,0.35)_65%,_transparent)] blur-xl" />
        <div className="absolute -inset-x-10 top-1/2 h-10 -translate-y-1/2 -rotate-6 bg-[linear-gradient(100deg,_transparent,_rgba(255,255,255,0.5)_50%,_transparent)] blur-md" />
      </div>

      {/* Twinkling stars */}
      <div className="pointer-events-none absolute inset-0">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute animate-pulse rounded-full bg-white"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: "0 0 4px 1px rgba(255,255,255,0.8)",
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-1 justify-start">{left}</div>
      <div className="relative flex items-center gap-2">
        <img
          src="/logo-icon.png"
          alt="Cosmos"
          className="h-12 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
        />
        {title ? (
          <h1 className="text-lg font-bold whitespace-nowrap text-white drop-shadow-sm">
            {title}
          </h1>
        ) : null}
      </div>
      <div className="relative flex flex-1 justify-end">{right}</div>
    </nav>
  );
}
