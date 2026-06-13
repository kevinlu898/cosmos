import { Card } from "../components/ui/card";

export function Animal(props) {
  const animal = { emoji: "🦁", color: "bg-amber-200" };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden select-none">
      <Card className={`flex aspect-square w-[min(34vh,240px)] items-center justify-center rounded-full ${animal.color}`}>
        <span
          style={{ fontSize: "min(22vh, 150px)" }}
          role="img"
          aria-label={props.name}
        >
          {animal.emoji}
        </span>
      </Card>
      <div className="rounded-full bg-white px-6 py-1.5 text-xl font-bold text-purple-900 shadow-md">
        {props.name}
      </div>
    </div>
  );
}
