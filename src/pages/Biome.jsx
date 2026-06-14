import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { AnimalArt } from "../components/Animal";
import { BiomeScene } from "../components/Background";
import { supabase } from "../lib/database";
import { getStardust } from "../lib/utils";
import { playAnimalSound } from "../lib/animalSounds";
import { BIOME_BY_ID, BIOMES } from "../lib/biomes";

export default function Biome() {
  const navigate = useNavigate();
  const { biomeId } = useParams();
  const biome = BIOME_BY_ID[biomeId] || BIOMES[0];
  const [stardustval, setStardust] = useState(0);

  useEffect(() => {
    const fetchStardust = async () => {
      const { data } = await supabase.auth.getSession();
      setStardust(await getStardust(data?.session?.user?.id ?? null));
    };
    fetchStardust();
  }, []);

  return (
    <div className="relative flex h-full flex-col overflow-hidden font-[Fredoka]">
      <BiomeScene biome={biome.title} className="absolute inset-0 z-0" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-white/35 backdrop-blur-[1px]" />

      <TopBar
        left={<Button size="sm" onClick={() => navigate("/home")}>🏠 Home</Button>}
        title="Cosmos"
        right={<Button variant="sun" size="sm" onClick={() => navigate("/shop")}>⭐ {stardustval} Stardust</Button>}
      />
      <div className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col justify-center px-6 py-6 text-center">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className={`text-4xl font-semibold tracking-tight sm:text-5xl ${biome.theme.text} drop-shadow-sm`}>
          {biome.title}
        </h1>
        <p className="mt-4 text-lg font-medium leading-8 text-slate-700">
          Pick an animal to explore with!
        </p>
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-center gap-10 sm:gap-16">
        {biome.animals.map((animal) => (
          <button
            key={animal}
            type="button"
            onClick={() => navigate(`/topic/${biome.id}/${encodeURIComponent(animal)}`)}
            onMouseEnter={() => playAnimalSound(animal)}
            onFocus={() => playAnimalSound(animal)}
            className="group relative flex cursor-pointer flex-col items-center focus:outline-none"
          >
            <span
              className={`pointer-events-none mb-2 translate-y-1 rounded-full bg-white/95 px-5 py-1.5 text-xl font-bold opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${biome.theme.text}`}
            >
              {animal}
            </span>
            <AnimalArt
              name={animal}
              expression="happy"
              className="h-40 w-40 object-contain drop-shadow-xl transition-transform duration-200 group-hover:-translate-y-2 group-hover:scale-110 sm:h-48 sm:w-48"
            />
            <span className="mt-1 h-3 w-24 rounded-[50%] bg-black/20 blur-[3px] transition-all duration-200 group-hover:w-28 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          className={`rounded-full border-2 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 ${biome.theme.border} ${biome.theme.ring}`}
          onClick={() => navigate('/home')}
        >
          ← Back to Biomes
        </button>
      </div>
    </div>
    </div>
  );
}
