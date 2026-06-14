import animals from "./animals.json";

// Fallback emoji per animal, used if the generated SVG can't be loaded.
export const ANIMAL_EMOJI = {
  deer: "🦌",
  fox: "🦊",
  bear: "🐻",
  lion: "🦁",
  giraffe: "🦒",
  elephant: "🐘",
  penguin: "🐧",
  polar_bear: "🐻‍❄️",
  walrus: "🦭",
};

export const ANIMAL_EXPRESSIONS = ["happy", "relaxed", "sad", "excited"];

// Accept a key ("polar_bear"), a species ("Polar Bear") or a given name
// ("Peter") and resolve it to the animals.json key (or null if unknown).
export function animalKey(value) {
  if (!value) return null;
  const norm = String(value).trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (animals[norm]) return norm;
  for (const [key, data] of Object.entries(animals)) {
    if (data.name.toLowerCase() === norm) return key;
  }
  return null;
}

// The animal's given name (e.g. "Leo" for a lion). Falls back to the input
// value if it can't be resolved to a known animal.
export function animalDisplayName(value) {
  const key = animalKey(value);
  return key ? animals[key].name : value || "";
}
