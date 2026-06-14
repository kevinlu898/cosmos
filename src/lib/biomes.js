// The biomes the player can explore, each with the animals that live there.
// `title` doubles as the scene key for <BiomeScene> (Forest / Savanna / Arctic).
// Shared by the Home (biome selection) and Biome (animal selection) screens so
// they stay in sync.
export const BIOMES = [
  {
    id: "biome-1",
    title: "Forest",
    animals: ["Fox", "Deer", "Bear"],
  },
  {
    id: "biome-2",
    title: "Savanna",
    animals: ["Lion", "Giraffe", "Elephant"],
  },
  {
    id: "biome-3",
    title: "Arctic",
    animals: ["Polar Bear", "Walrus", "Penguin"],
  },
];

export const BIOME_BY_ID = Object.fromEntries(BIOMES.map((b) => [b.id, b]));
