import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { AnimalArt } from "../components/Animal";
import { animalDisplayName } from "../lib/animalArt";
import { BIOME_BY_ID } from "../lib/biomes";

const TOPICS = [
  "Emotional learning",
  "Making friends",
  "Daily life",
  "Math",
  "Science",
];

export default function Topic() {
  const navigate = useNavigate();
  const { biomeId, animal } = useParams();
  const biomeName = BIOME_BY_ID[biomeId]?.title || "Biome";
  const animalName = animal ? decodeURIComponent(animal) : "Animal";
  // The animal's given name to greet the player with once selected.
  const displayName = animalDisplayName(animalName);

  const topicCards = useMemo(
    () => TOPICS.map((topic) => ({ label: topic, value: topic })),
    []
  );

  const handleTopicClick = (topic) => {
    localStorage.setItem("selectedBiome", biomeName);
    localStorage.setItem("selectedAnimal", animalName);
    localStorage.setItem("selectedTopic", topic);
    navigate("/game");
    console.log("Selected:", { biome: biomeName, animal: animalName, topic });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={<Button size="xs" onClick={() => navigate("/home")}>🏠 Home</Button>}
        title="Cosmos"
        right={<Button variant="sun" size="xs" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>}
      />
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col justify-center overflow-y-auto px-6 py-6 text-center">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/70 shadow-sm backdrop-blur-sm">
          <AnimalArt
            name={animalName}
            expression="excited"
            className="h-36 w-36 object-contain"
          />
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Pick a Topic for {displayName}
        </h1>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topicCards.map((topic) => (
          <button
            key={topic.value}
            type="button"
            onClick={() => handleTopicClick(topic.value)}
            className="group rounded-[2rem] border border-slate-200 bg-slate-50/90 p-8 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <p className="text-xl font-semibold text-slate-900">{topic.label}</p>
          </button>
        ))}
      </div>
    </div>
    </div>
  );
}
