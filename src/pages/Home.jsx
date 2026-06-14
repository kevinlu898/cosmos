import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/database.js";
import {getById} from "../lib/database.js";
import { TopBar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { AnimalArt } from "../components/Animal";
import { BiomeScene } from "../components/Background";
import { BIOMES } from "../lib/biomes";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("User");

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const row = await getById("profiles", session.user.id, { column: "user_id" });
        if (row?.name) {
          setName(row.name);
          return;
        }
      }
      if (localStorage.getItem("userLoggedIn") === "true") {
        const storedName = localStorage.getItem("userName");
        if (storedName) setName(storedName);
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={<Button variant="destructive" size="xs" onClick={handleLogout}>Log Out</Button>}
        title="Cosmos"
        right={<Button variant="sun" size="xs" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>}
      />
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 text-center">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Hello, {name}!
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Pick a Biome!
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {BIOMES.map((biome) => (
          <button
            key={biome.id}
            type="button"
            onClick={() => navigate(`/biome/${biome.id}`)}
            className="group flex min-h-[260px] flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <div className="space-y-4">
              <div className="relative flex h-36 items-end justify-center gap-1 overflow-hidden rounded-[1.5rem] px-3">
                <BiomeScene biome={biome.title} className="absolute inset-0" />
                {biome.animals.map((animal) => (
                  <AnimalArt
                    key={animal}
                    name={animal}
                    expression="happy"
                    className="relative z-10 h-28 flex-1 object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-110"
                  />
                ))}
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{biome.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
}
