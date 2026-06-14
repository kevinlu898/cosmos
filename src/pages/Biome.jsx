import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { AnimalArt } from "../components/Animal";
import { BiomeScene } from "../components/Background";
import { BIOME_BY_ID, BIOMES } from "../lib/biomes";

export default function Biome() {
  const navigate = useNavigate();
  const { biomeId } = useParams();
  const biome = BIOME_BY_ID[biomeId] || BIOMES[0];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={<Button size="xs" onClick={() => navigate("/home")}>🏠 Home</Button>}
        title="Cosmos"
        right={<Button variant="sun" size="xs" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>}
      />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 text-center">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {biome.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Pick an animal!
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {biome.animals.map((animal) => (
          <button
            key={animal}
            type="button"
            onClick={() => navigate(`/topic/${biome.id}/${encodeURIComponent(animal)}`)}
            className="group flex min-h-[240px] flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <div className="space-y-4 text-left">
              <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-[1.5rem]">
                <BiomeScene biome={biome.title} className="absolute inset-0" />
                <AnimalArt
                  name={animal}
                  expression="happy"
                  className="relative z-10 h-36 w-full object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
                />
              </div>
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
          Back to Biomes
        </button>
      </div>
    </div>
    </div>
  );
}
