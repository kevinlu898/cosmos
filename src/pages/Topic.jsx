import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/Navbar";
import { Button } from "../components/ui/button";

const AREA_NAMES = {
  "area-1": "Forest",
  "area-2": "Savanna",
  "area-3": "Arctic",
};

const TOPICS = [
  "Emotional learning",
  "Making friends",
  "Daily life",
  "Math",
  "Learning",
];

export default function Topic() {
  const navigate = useNavigate();
  const { areaId, animal } = useParams();
  const areaName = AREA_NAMES[areaId] || "Area";
  const animalName = animal ? decodeURIComponent(animal) : "Animal";

  const topicCards = useMemo(
    () => TOPICS.map((topic) => ({ label: topic, value: topic })),
    []
  );

  const handleTopicClick = (topic) => {
    localStorage.setItem("selectedArea", areaName);
    localStorage.setItem("selectedAnimal", animalName);
    localStorage.setItem("selectedTopic", topic);
    navigate("/game");
    console.log("Selected:", { area: areaName, animal: animalName, topic });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={<Button size="xs" onClick={() => navigate("/")}>🏠 Home</Button>}
        title="Cosmos"
        right={<Button variant="sun" size="xs" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>}
      />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 text-center">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Pick a Topic for {animalName}
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
