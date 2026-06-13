import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/database.js";
import {getById} from "../lib/database.js";

const AREAS = [
  {
    id: "area-1",
    biome: "Forest",
  },
  {
    id: "area-2",
    biome: "Savanna",
  },
  {
    id: "area-3",
    biome: "Arctic",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("User");

  useEffect(() => {
    const fetchUserName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const row = await getById("profiles", session.user.id, { column: "user_id" });
        if (row?.name) setName(row.name);
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 text-center">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Hello, {name}!
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Pick an Area!
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {AREAS.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => navigate(`/area/${area.id}`)}
            className="group flex min-h-[260px] flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50/90 p-6 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          >
            <div className="space-y-4">
              <div className="h-36 rounded-[1.5rem] bg-slate-200/80" />
              <div>
                <p className="text-2xl font-semibold text-slate-900">{area.biome}</p>
                <p className="mt-2 text-sm text-slate-500">{area.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="fixed left-4 bottom-4 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow"
      >
        Log out
      </button>
    </div>
  );
}
