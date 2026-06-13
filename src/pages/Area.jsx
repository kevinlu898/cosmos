import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/Navbar";
import { Button } from "../components/ui/button";

const AREA_DATA = {
  "area-1": {
    title: "Forest",
    animals: ["Fox", "Deer", "Bear"],
  },
  "area-2": {
    title: "Savanna",
    animals: ["Lion", "Giraffe", "Elephant"],
  },
  "area-3": {
    title: "Arctic",
    animals: ["Polar Bear", "Walrus", "Penguin"],
  },
};

export default function Area() {
  const navigate = useNavigate();
  const { areaId } = useParams();
  const area = AREA_DATA[areaId] || AREA_DATA["area-1"];

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
          {area.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Pick an Area!
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {area.animals.map((animal) => (
          <button
            key={animal}
            type="button"
            onClick={() => navigate(`/topic/${areaId}/${encodeURIComponent(animal)}`)}
            className="flex min-h-[240px] flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <div className="space-y-4 text-left">
              <div className="h-40 rounded-[1.5rem] bg-slate-200/80" />
              <div>
                <p className="text-2xl font-semibold text-slate-900">{animal}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          onClick={() => navigate('/home')}
        >
          Back to Areas
        </button>
      </div>
    </div>
    </div>
  );
}
