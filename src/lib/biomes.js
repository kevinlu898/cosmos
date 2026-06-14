// Biomes charactersitics and data
export const BIOMES = [
  {
    id: "biome-1",
    title: "Forest",
    animals: ["Fox", "Deer", "Bear"],
    theme: {
      border: "border-emerald-200",
      shadow: "shadow-[0_8px_0_#a7f3d0]",
      shadowHover: "hover:shadow-[0_12px_0_#a7f3d0]",
      shadowActive: "active:shadow-[0_2px_0_#a7f3d0]",
      ring: "focus-visible:ring-emerald-300/70",
      text: "text-emerald-700",
      chip: "bg-emerald-100 text-emerald-700",
    },
  },
  {
    id: "biome-2",
    title: "Savanna",
    animals: ["Lion", "Giraffe", "Elephant"],
    theme: {
      border: "border-amber-200",
      shadow: "shadow-[0_8px_0_#fde68a]",
      shadowHover: "hover:shadow-[0_12px_0_#fde68a]",
      shadowActive: "active:shadow-[0_2px_0_#fde68a]",
      ring: "focus-visible:ring-amber-300/70",
      text: "text-amber-600",
      chip: "bg-amber-100 text-amber-700",
    },
  },
  {
    id: "biome-3",
    title: "Arctic",
    animals: ["Polar Bear", "Walrus", "Penguin"],
    theme: {
      border: "border-sky-200",
      shadow: "shadow-[0_8px_0_#bae6fd]",
      shadowHover: "hover:shadow-[0_12px_0_#bae6fd]",
      shadowActive: "active:shadow-[0_2px_0_#bae6fd]",
      ring: "focus-visible:ring-sky-300/70",
      text: "text-sky-600",
      chip: "bg-sky-100 text-sky-700",
    },
  },
];

export const BIOME_BY_ID = Object.fromEntries(BIOMES.map((b) => [b.id, b]));
