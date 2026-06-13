export function TopBar({ left, title, right }) {
  return (
    <nav className="relative z-30 flex items-center justify-between gap-3 h-28 bg-[#c694ff] px-4 py-1">
      <div className="flex flex-1 justify-start">{left}</div>
      <h1 className="text-lg font-bold whitespace-nowrap text-white">{title}</h1>
      <div className="flex flex-1 justify-end">{right}</div>
    </nav>
  );
}
