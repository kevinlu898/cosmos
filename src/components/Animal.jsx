import { Card } from "../components/ui/card";

export function Animal(props) {
  const animal = { emoji: "🦁", color: "bg-amber-200" };
  const thinking = props.thinking;

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden select-none">
      <div className="relative">
        {/* Floating thought bubbles while the AI is thinking */}
        {thinking && (
          <div className="pointer-events-none absolute -top-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[0, 250, 500].map((delay) => (
              <span
                key={delay}
                className="animate-thought text-2xl"
                style={{ animationDelay: `${delay}ms` }}
              >
                💭
              </span>
            ))}
          </div>
        )}
        <Card
          className={`flex aspect-square w-[min(34vh,240px)] items-center justify-center rounded-full ${animal.color} ${thinking ? "animate-think" : ""}`}
        >
          <span
            style={{ fontSize: "min(22vh, 150px)" }}
            role="img"
            aria-label={props.name}
          >
            {animal.emoji}
          </span>
        </Card>
      </div>
      <div className="rounded-full bg-white px-6 py-1.5 text-xl font-bold text-purple-900 shadow-md">
        {props.name}
      </div>
    </div>
  );
}
