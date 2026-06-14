import { useState } from "react";
import { Card } from "../components/ui/card";
import animals from "../lib/animals.json";
import { ANIMAL_EMOJI, ANIMAL_EXPRESSIONS, animalKey } from "../lib/animalArt";

// The animated SVG art on its own (no card / name chrome). Falls back to an
// emoji if the file is missing. Resolve `animal`/`name` to an animals.json key.
export function AnimalArt({
  name,
  animal,
  expression = "happy",
  className = "h-full w-full object-contain",
}) {
  const key = animalKey(animal) || animalKey(name);
  const expr = ANIMAL_EXPRESSIONS.includes(expression) ? expression : "happy";
  // Track the src that failed to load so the fallback only kicks in for that
  // specific art (and clears automatically when a different one is requested).
  const [failedSrc, setFailedSrc] = useState(null);

  const src = key ? `/animals/${key}-${expr}.svg` : null;

  if (!src || failedSrc === src) {
    return (
      <span
        className={`flex items-center justify-center ${className}`}
        style={{ fontSize: "min(22vh, 130px)" }}
        role="img"
        aria-label={name || (key && animals[key].name) || "animal"}
      >
        {ANIMAL_EMOJI[key] || "🦁"}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={`${name || animals[key].name} looking ${expr}`}
      className={className}
      onError={() => setFailedSrc(src)}
      draggable={false}
    />
  );
}

export function Animal(props) {
  const { name, thinking, animal, expression = "happy" } = props;

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
          className={`flex aspect-square w-[min(34vh,240px)] items-center justify-center overflow-hidden rounded-full bg-white/70 backdrop-blur-sm ${thinking ? "animate-think" : ""}`}
        >
          <AnimalArt
            name={name}
            animal={animal}
            expression={expression}
            className="h-full w-full object-contain p-2"
          />
        </Card>
      </div>
      <div className="rounded-full bg-white px-6 py-1.5 text-xl font-bold text-purple-900 shadow-md">
        {name}
      </div>
    </div>
  );
}
