import { useState } from "react";
import animals from "../lib/animals.json";
import { ANIMAL_EMOJI, ANIMAL_EXPRESSIONS, animalKey } from "../lib/animalArt";
import { COSMETIC_ITEMS, cosmeticSrc, useOwnedCosmetics } from "../lib/cosmetics";

export function AnimalArt({
  name,
  animal,
  expression = "happy",
  cosmetics,
  className = "h-full w-full object-contain",
}) {
  const owned = useOwnedCosmetics();
  const active = cosmetics ?? owned;
  const key = animalKey(animal) || animalKey(name);
  const expr = ANIMAL_EXPRESSIONS.includes(expression) ? expression : "happy";
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

  const alt = `${name || animals[key].name} looking ${expr}`;
  const equipped = COSMETIC_ITEMS.filter((c) => active.includes(c));

  if (!equipped.length) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setFailedSrc(src)}
        draggable={false}
      />
    );
  }

  return (
    <span className={`relative block ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-contain"
        onError={() => setFailedSrc(src)}
        draggable={false}
      />
      {equipped.map((item) => (
        <img
          key={item}
          src={cosmeticSrc(key, item)}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
          draggable={false}
        />
      ))}
    </span>
  );
}

export function Animal(props) {
  const { name, thinking, animal, expression = "happy", cosmetics } = props;

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 overflow-hidden select-none">
      <div className="relative">
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
        <div
          className={`flex aspect-square w-[min(34vh,240px)] items-center justify-center ${thinking ? "animate-think" : ""}`}
        >
          <AnimalArt
            name={name}
            animal={animal}
            expression={expression}
            cosmetics={cosmetics}
            className="h-full w-full object-contain drop-shadow-xl"
          />
        </div>
      </div>
      <div className="rounded-full bg-white px-6 py-1.5 text-xl font-bold text-purple-900 shadow-md">
        {name}
      </div>
    </div>
  );
}
