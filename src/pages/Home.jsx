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
  const [exploring, setExploring] = useState(false);

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
        left={<Button variant="destructive" size="default" onClick={handleLogout}>Log Out</Button>}
        title="Cosmos"
        right={<Button variant="sun" size="default" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>}
      />
      <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col justify-center px-6 py-6 text-center">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Hello, {name}!
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          {exploring ? "Pick a Biome!" : "What would you like to do?"}
        </p>
      </div>

      {!exploring ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setExploring(true)}
            className="group flex min-h-[300px] flex-col items-center justify-between gap-5 rounded-[2.5rem] border-4 border-emerald-200 bg-white/80 p-8 shadow-[0_8px_0_#a7f3d0] transition-all hover:-translate-y-1 hover:shadow-[0_12px_0_#a7f3d0] active:translate-y-[4px] active:shadow-[0_2px_0_#a7f3d0] focus-visible:ring-4 focus-visible:ring-emerald-300/70"
          >
            <ExploreArt className="h-40 w-full transition-transform duration-200 group-hover:scale-105" />
            <div className="space-y-1">
              <span className="block text-3xl font-semibold text-emerald-700">Explore</span>
              <span className="block text-base text-slate-600">Discover animals across biomes</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="group flex min-h-[300px] flex-col items-center justify-between gap-5 rounded-[2.5rem] border-4 border-cosmos-purple/30 bg-white/80 p-8 shadow-[0_8px_0_#e9d5ff] transition-all hover:-translate-y-1 hover:shadow-[0_12px_0_#e9d5ff] active:translate-y-[4px] active:shadow-[0_2px_0_#e9d5ff] focus-visible:ring-4 focus-visible:ring-cosmos-purple/40"
          >
            <ShopArt className="h-40 w-full transition-transform duration-200 group-hover:scale-105" />
            <div className="space-y-1">
              <span className="block text-3xl font-semibold text-cosmos-purple">Shop</span>
              <span className="block text-base text-slate-600">Spend your Stardust on goodies</span>
            </div>
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8">
            <Button variant="outline" size="sm" onClick={() => setExploring(false)}>
              ← Back
            </Button>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
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
        </>
      )}
      </div>
    </div>
  );
}

// Explore = the biomes: a little nature scene (sky, sun, hills, trees, animal).
function ExploreArt({ className = "" }) {
  return (
    <svg viewBox="0 0 200 130" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="exploreSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="1" stopColor="#ecfdf5" />
        </linearGradient>
        <clipPath id="exploreClip">
          <rect x="0" y="0" width="200" height="130" rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#exploreClip)">
        <rect x="0" y="0" width="200" height="130" fill="url(#exploreSky)" />
        <circle cx="158" cy="34" r="18" fill="#ffc83d" />
        {/* rolling hills */}
        <path d="M0 92 Q50 64 100 86 T200 80 V130 H0 Z" fill="#6ee7b7" />
        <path d="M0 110 Q60 86 120 104 T200 100 V130 H0 Z" fill="#34d399" />
        {/* trees */}
        <g>
          <rect x="42" y="78" width="6" height="20" rx="2" fill="#92400e" />
          <circle cx="45" cy="72" r="15" fill="#059669" />
          <circle cx="34" cy="78" r="11" fill="#10b981" />
          <circle cx="56" cy="78" r="11" fill="#10b981" />
        </g>
        <g>
          <rect x="150" y="92" width="5" height="16" rx="2" fill="#92400e" />
          <circle cx="152" cy="88" r="11" fill="#059669" />
        </g>
        {/* a curious fox-ish critter */}
        <g transform="translate(96 92)">
          <ellipse cx="10" cy="14" rx="14" ry="9" fill="#fb923c" />
          <circle cx="22" cy="6" r="7" fill="#fb923c" />
          <path d="M17 1 l2 -7 4 6 z" fill="#f97316" />
          <path d="M24 1 l4 -6 1 7 z" fill="#f97316" />
          <circle cx="24" cy="6" r="1.6" fill="#1f2937" />
          <path d="M-2 18 q-8 2 -10 -4" stroke="#fb923c" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      </g>
    </svg>
  );
}

// Shop = the rocket ship's shelf: a metal shelf inside the ship holding little
// space goodies (star, planet, rocket), matching the Space Shop theme.
function ShopArt({ className = "" }) {
  return (
    <svg viewBox="0 0 200 130" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="shopSpace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1660" />
          <stop offset="1" stopColor="#1a0833" />
        </linearGradient>
        <clipPath id="shopClip">
          <rect x="0" y="0" width="200" height="130" rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#shopClip)">
        <rect x="0" y="0" width="200" height="130" fill="url(#shopSpace)" />
        {/* twinkling stars */}
        <circle cx="24" cy="22" r="1.6" fill="#fff" opacity="0.8" />
        <circle cx="170" cy="18" r="2" fill="#fff" opacity="0.7" />
        <circle cx="120" cy="14" r="1.4" fill="#fff" opacity="0.6" />
        <circle cx="60" cy="30" r="1.4" fill="#fff" opacity="0.6" />
        <circle cx="186" cy="46" r="1.6" fill="#fff" opacity="0.7" />

        {/* shelf goodies */}
        {/* planet with ring */}
        <g transform="translate(40 40)">
          <circle cx="0" cy="0" r="14" fill="#2ed8ff" />
          <circle cx="-5" cy="-4" r="3" fill="#fff" opacity="0.25" />
          <ellipse cx="0" cy="2" rx="22" ry="6" fill="none" stroke="#a66bff" strokeWidth="3" transform="rotate(-20)" />
        </g>
        {/* star */}
        <path d="M100 26 l5 12 13 1 -10 9 3 13 -11 -7 -11 7 3 -13 -10 -9 13 -1 z" fill="#ffc83d" />
        {/* mini rocket */}
        <g transform="translate(150 30)">
          <path d="M10 0 C16 6 17 14 17 20 H3 C3 14 4 6 10 0 Z" fill="#f8fafc" />
          <circle cx="10" cy="11" r="4" fill="#2e8cff" />
          <path d="M3 18 L-3 26 L4 23 Z" fill="#ff5aa5" />
          <path d="M17 18 L23 26 L16 23 Z" fill="#ff5aa5" />
          <path d="M6 22 C7 30 13 30 14 22 Z" fill="#ff8a5b" />
        </g>

        {/* the metal shelf */}
        <rect x="14" y="62" width="172" height="9" rx="4" fill="#cbd5e1" />
        <rect x="14" y="71" width="172" height="5" rx="2" fill="#475569" />
        <rect x="22" y="76" width="6" height="10" rx="2" fill="#64748b" />
        <rect x="172" y="76" width="6" height="10" rx="2" fill="#64748b" />

        {/* lower shelf goodies */}
        {/* comet */}
        <g transform="translate(54 98)">
          <path d="M14 -6 L-2 10" stroke="#2ed8ff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <circle cx="15" cy="-6" r="8" fill="#2ed8ff" />
          <circle cx="12" cy="-9" r="2" fill="#fff" opacity="0.4" />
        </g>
        {/* space helmet */}
        <g transform="translate(96 100)">
          <circle cx="8" cy="0" r="12" fill="#f8fafc" />
          <path d="M-1 -2 a9 8 0 0 1 18 0 v4 a9 7 0 0 1 -18 0 z" fill="#3b1660" opacity="0.85" />
          <ellipse cx="3" cy="-3" rx="3" ry="4" fill="#fff" opacity="0.6" />
        </g>
        {/* star pet */}
        <path d="M150 92 l4 9 10 1 -8 7 2 10 -8 -5 -8 5 2 -10 -8 -7 10 -1 z" fill="#a66bff" />

        {/* lower shelf */}
        <rect x="14" y="112" width="172" height="9" rx="4" fill="#cbd5e1" />
        <rect x="14" y="121" width="172" height="5" rx="2" fill="#475569" />
      </g>
    </svg>
  );
}
