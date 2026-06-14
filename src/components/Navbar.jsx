export function TopBar({ left, title, right }) {
  return (
    <nav className="relative z-30 flex items-center justify-between gap-3 h-28 bg-cosmos-purple px-4 py-1">
      <div className="flex flex-1 justify-start">{left}</div>
      <div className="flex items-center gap-2">
        <img
          src="/logo-icon.png"
          alt="Cosmos"
          className="h-12 w-auto drop-shadow-sm"
        />
        {title ? (
          <h1 className="text-lg font-bold whitespace-nowrap text-white">{title}</h1>
        ) : null}
      </div>
      <div className="flex flex-1 justify-end">{right}</div>
    </nav>
  );
}
