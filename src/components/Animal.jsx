import { Card } from "../components/ui/card";

export function Animal(props) {
  const animal = { emoji: "🦁", color: "bg-amber-200" };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 select-none">
      <Card className={`flex aspect-square w-[min(40vh,300px)] items-center justify-center rounded-full ${animal.color}`}>
        <span
          style={{ fontSize: "min(26vh, 190px)" }}
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
