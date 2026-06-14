// Shared deep-navy "space" backdrop for the landing, sign-in, and sign-up screens.
// Uses the Cosmos brand palette: navy background with soft gradient nebulae and stars.
export function AuthShell({ children }) {
  return (
    <div className="h-full w-full overflow-x-hidden overflow-y-auto bg-cosmos-navy font-[Fredoka]">
      <div className="relative flex min-h-full w-full flex-col items-center justify-center px-6 py-10">
        {/* Gradient nebulae echoing the logo's colors */}
        <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-cosmos-purple/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 -right-28 h-80 w-80 rounded-full bg-cosmos-blue/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cosmos-pink/20 blur-3xl" />

        {/* Scattered stars */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-[12%] top-[18%] h-1.5 w-1.5 rounded-full bg-cosmos-cyan/80" />
          <span className="absolute left-[82%] top-[22%] h-1 w-1 rounded-full bg-white/70" />
          <span className="absolute left-[68%] top-[12%] h-1.5 w-1.5 rounded-full bg-cosmos-yellow/80" />
          <span className="absolute left-[24%] top-[72%] h-1 w-1 rounded-full bg-cosmos-pink/80" />
          <span className="absolute left-[88%] top-[68%] h-1.5 w-1.5 rounded-full bg-white/60" />
          <span className="absolute left-[44%] top-[8%] h-1 w-1 rounded-full bg-white/60" />
          <span className="absolute left-[8%] top-[52%] h-1 w-1 rounded-full bg-cosmos-turquoise/70" />
        </div>

        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
