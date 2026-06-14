import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { TopBar } from "../components/Navbar";
import earthImg from "../assets/images/earth.png";
import { talkToAI } from "../lib/ai";
import { supabase } from "../lib/database";
import { buyItem, getStardust } from "../lib/utils";

const SHELVES = [
  [
    {
      name: "Hat",
      price: 250,
      icon: "hat",
      desc: "Zoom across the stars in a flash!",
      glow: "from-orange-400 to-pink-500",
    },
    {
      name: "Scarf",
      price: 250,
      icon: "star",
      desc: "A twinkly little friend who follows you.",
      glow: "from-amber-300 to-yellow-500",
    },
    {
      name: "Shoes",
      price: 500,
      icon: "planet",
      desc: "Your very own tiny world with rings.",
      glow: "from-fuchsia-400 to-purple-600",
    },
  ],
  [
    {
      name: "Stardust Insurance",
      price: 100,
      icon: "ufo",
      desc: "Say hi to a friend from far away.",
      glow: "from-green-300 to-emerald-500",
    },
    {
      name: "Comet Tail",
      price: 90,
      icon: "comet",
      desc: "Leave a sparkly trail behind you!",
      glow: "from-cyan-300 to-blue-500",
    },
    {
      name: "Space Helmet",
      price: 110,
      icon: "helmet",
      desc: "Stay cool and safe on space walks.",
      glow: "from-sky-300 to-indigo-500",
    },
  ],
];

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: (i * 47 + 11) % 100,
  y: (i * 71 + 7) % 100,
  size: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
  twinkle: i % 5 === 0,
}));

export default function Shop() {
  const navigate = useNavigate();
  const [stardustVal, setStardust] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUserId = data?.session?.user?.id ?? null;
      setUserId(sessionUserId);
      setStardust(await getStardust(sessionUserId));
    };

    fetchUser();
  }, []);

  const handleBuyItem = async (item) => {
    if (!userId) {
      alert("You do not have enough stardust!");
      return;
    }

    const remainingStardust = await buyItem(userId, item.price);
    if (remainingStardust === -1) {
      alert("You do not have enough stardust!");
      return;
    }

    setStardust(remainingStardust);
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#3b1660_0%,#1a0833_45%,#0a0418_100%)] font-[Fredoka] text-white">
      <Starfield />
      <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-4 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

      <HullPanel side="left" />
      <HullPanel side="right" />

      {/* Top nav bar*/}
      <TopBar
        left={
          <Button size="xs" onClick={() => navigate("/")}>
            🌎 Return to Earth
          </Button>
        }
        title="Space Shop"
        right={
          <div className="flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-sm font-bold text-white shadow-md">
            ⭐ {stardustVal === null ? "…" : stardustVal} Stardust
          </div>
        }
      />

      {/* -Spaceship interior*/}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-6 px-4 py-5 md:px-20 lg:flex-row lg:items-stretch">
        <EarthWindow />
        <section className="flex flex-1 flex-col justify-center gap-12 pb-16 lg:pb-0">
          {SHELVES.map((items, i) => (
            <Shelf
              key={i}
              items={items}
              placement={i === 0 ? "down" : "up"}
              onBuy={handleBuyItem}
            />
          ))}
        </section>
      </div>
      <div className="relative z-10 h-9 shrink-0 border-t-2 border-white/10 bg-linear-to-t from-slate-900 to-slate-800/70 shadow-[0_-6px_20px_rgba(0,0,0,0.5)]" />
      <InteractiveRobot />
    </div>
  );
}

/*  Shelves */
function Shelf({ items, placement, onBuy }) {
  return (
    <div className="relative">
      <div className="flex items-end justify-around gap-2 px-3">
        {items.map((item) => (
          <ShelfItem
            key={item.name}
            item={item}
            placement={placement}
            onBuy={onBuy}
          />
        ))}
      </div>

      <div className="relative">
        <div className="h-3 rounded-md bg-linear-to-b from-slate-300 to-slate-500 shadow-[0_8px_16px_rgba(0,0,0,0.55)]" />
        <div className="mx-3 h-2 rounded-b-lg bg-slate-700/90" />
        <div className="absolute -bottom-3 left-1 h-4 w-2 -skew-x-12 rounded-b bg-slate-600" />
        <div className="absolute -bottom-3 right-1 h-4 w-2 skew-x-12 rounded-b bg-slate-600" />
      </div>
    </div>
  );
}

function ShelfItem({ item, placement = "up", onBuy }) {
  const down = placement === "down";
  const [open, setOpen] = useState(false);
  const timer = useRef(null);

  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className={`relative flex flex-col items-center ${open ? "z-50" : ""}`}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <div
        onMouseEnter={show}
        onMouseLeave={hide}
        className={`absolute left-1/2 z-40 w-48 ${down ? "top-full mt-3" : "bottom-full mb-3"} -translate-x-1/2 rounded-2xl border-2 border-white bg-white p-3 text-center text-purple-900 shadow-[0_16px_36px_rgba(0,0,0,0.55)] transition duration-150 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-90 opacity-0"
        }`}
      >
        <p className="text-base font-bold">{item.name}</p>
        <p className="mt-0.5 text-xs leading-snug text-purple-500">
          {item.desc}
        </p>
        <div className="mt-2 flex items-center justify-center gap-1 text-sm font-bold text-amber-500">
          <StarGlyph className="h-4 w-4" />
          {item.price} Stardust
        </div>
        <Button
          variant="success"
          size="sm"
          className="mt-2 w-full"
          onClick={() => onBuy(item)}
        >
          Buy
        </Button>
        <span
          className={`absolute left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 border-white bg-white ${
            down
              ? "bottom-full translate-y-1/2 border-t-2 border-l-2"
              : "top-full -translate-y-1/2 border-b-2 border-r-2"
          }`}
        />
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onFocus={show}
        onBlur={hide}
        aria-label={`${item.name} — ${item.price} Stardust`}
        className="group flex cursor-pointer flex-col items-center outline-none"
      >
        <span
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${item.glow} shadow-[0_0_22px_rgba(255,255,255,0.25)] transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:scale-110 group-focus-visible:-translate-y-1.5 group-focus-visible:scale-110 sm:h-20 sm:w-20 ${
            open ? "-translate-y-1.5 scale-110" : ""
          }`}
        >
          <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.6),transparent_55%)]" />
          <ItemIcon
            type={item.icon}
            className="relative h-10 w-10 drop-shadow-md sm:h-12 sm:w-12"
          />
        </span>
      </button>

      <span className="mt-1.5 h-1.5 w-12 rounded-[50%] bg-black/45 blur-[2px]" />
    </div>
  );
}

/*  Earth porthole window */
function EarthWindow() {
  const bolts = Array.from({ length: 12 }, (_, i) => i * 30);
  const navigate = useNavigate();

  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-3 lg:w-[40%] mb-10">
      <div className="relative aspect-square w-[min(62vw,340px)] rounded-full border-[14px] border-slate-500 bg-slate-700 p-2 shadow-[inset_0_3px_10px_rgba(255,255,255,0.25),0_16px_40px_rgba(0,0,0,0.6)]">
        {bolts.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const left = 50 + 47 * Math.cos(rad);
          const top = 50 + 47 * Math.sin(rad);
          return (
            <span
              key={deg}
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]"
              style={{ left: `${left}%`, top: `${top}%` }}
            />
          );
        })}

        <div className="relative h-full w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_50%_38%,#101a44,#05010a)]">
          <img
            onClick={() => navigate("/")}
            src={earthImg}
            alt="Earth"
            className="h-full w-full object-cover cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

function InteractiveRobot() {
  const [stardustVal, setStardust] = useState(null);
  const [line, setLine] = useState(0);
  const [reacting, setReacting] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setStardust(await getStardust(data?.session?.user?.id ?? null));
    };

    fetchUser();
  }, []);

  const robotLines = [
    "Hi captain! Tap me again! 👋",
    "Psst… the Star Pet is my favorite. ",
    "That blue marble out the window? That's Earth! 🌍",
    stardustVal === null
      ? "Checking your Stardust balance..."
      : `You've got ${stardustVal} Stardust to spend!`,
    "Beep boop… you're doing great! ",
    "Grab a buddy off the shelf!",
  ];

  const wave = () => {
    setReacting(true);
    setTimeout(() => setReacting(false), 700);
  };

  const tap = () => {
    if (aiResponse) setAiResponse(null);
    else setLine((p) => (p + 1) % robotLines.length);
    wave();
  };

  const ask = async (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || thinking) return;
    setInput("");
    setAiResponse(null);
    setThinking(true);
    wave();
    try {
      const res = await talkToAI(q);
      const text = typeof res === "string" ? res : res?.answer;
      setAiResponse(text?.trim() || "Hmm, I'm not sure about that one!");
    } catch {
      setAiResponse("Beep… my circuits got fuzzy. Try again!");
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="absolute bottom-2 left-2 z-30 flex items-end gap-2 sm:bottom-3 sm:left-4">
      <button
        type="button"
        onClick={tap}
        aria-label="Talk to the robot shopkeeper"
        className={`shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${reacting ? "animate-bounce" : ""}`}
      >
        <RobotKeeper
          waving={reacting}
          className="h-24 w-20 drop-shadow-[0_8px_12px_rgba(0,0,0,0.55)] sm:h-28 sm:w-24"
        />
      </button>

      <div className="mb-2 flex w-[210px] flex-col gap-2 sm:mb-3 sm:w-[240px]">
        <div className="min-h-[2.5rem] rounded-2xl rounded-bl-sm bg-white/95 px-3 py-2 text-sm font-semibold text-purple-900 shadow-lg">
          {thinking ? <ThinkingDots /> : aiResponse || robotLines[line]}
        </div>

        <form onSubmit={ask} className="flex items-center gap-1.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            disabled={thinking}
            className="w-full rounded-full border-2 border-violet-300 bg-white px-3 py-1 text-sm text-purple-900 outline-none placeholder:text-purple-300 focus:border-violet-500 disabled:opacity-60"
          />
          <Button type="submit" variant="grape" size="xs" disabled={thinking}>
            Ask
          </Button>
        </form>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="thinking">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}

/*  Ship framing  */
function HullPanel({ side }) {
  const isLeft = side === "left";
  return (
    <div
      className={
        "pointer-events-none absolute inset-y-0 z-0 hidden w-16 to-transparent lg:block " +
        (isLeft
          ? "left-0 bg-linear-to-r from-slate-800 via-slate-700/80"
          : "right-0 bg-linear-to-l from-slate-800 via-slate-700/80")
      }
    >
      <div
        className={`absolute inset-y-0 ${isLeft ? "right-3" : "left-3"} flex flex-col items-center justify-around py-10`}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-slate-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
          />
        ))}
      </div>
    </div>
  );
}

function Starfield() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
        <span
          key={i}
          className={`absolute rounded-full bg-white ${s.twinkle ? "animate-pulse" : ""}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0.5 + s.size / 6,
          }}
        />
      ))}
    </div>
  );
}

/*  SVG art */
function RobotKeeper({ waving = false, className = "" }) {
  return (
    <svg viewBox="0 0 120 140" className={className} fill="none">
      <line x1="60" y1="22" x2="60" y2="8" stroke="#94a3b8" strokeWidth="3" />
      <circle cx="60" cy="7" r="5" fill="#f472b6" className="animate-pulse" />
      <rect
        x="26"
        y="22"
        width="68"
        height="50"
        rx="18"
        fill="#e2e8f0"
        stroke="#94a3b8"
        strokeWidth="3"
      />
      <rect x="35" y="31" width="50" height="32" rx="12" fill="#0f172a" />
      <circle cx="50" cy="46" r="5" fill="#38bdf8" />
      <circle cx="70" cy="46" r="5" fill="#38bdf8" />
      <path
        d="M49 54 q11 9 22 0"
        stroke="#38bdf8"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <rect
        x="32"
        y="76"
        width="56"
        height="46"
        rx="16"
        fill="#cbd5e1"
        stroke="#94a3b8"
        strokeWidth="3"
      />
      <circle cx="60" cy="98" r="9" fill="#a78bfa" />
      <path
        d="M88 88 q14 4 14 20"
        stroke="#94a3b8"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      {waving ? (
        <path
          d="M32 86 q-18 -8 -14 -28"
          stroke="#94a3b8"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M32 88 q-16 -2 -16 -22"
          stroke="#94a3b8"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ItemIcon({ type, className = "" }) {
  switch (type) {
    case "rocket":
      return <RocketGlyph className={className} />;
    case "star":
      return <StarGlyph className={className} />;
    case "planet":
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="30" cy="30" r="18" fill="#fff" />
          <circle cx="24" cy="24" r="4" fill="#000" opacity="0.12" />
          <circle cx="36" cy="34" r="3" fill="#000" opacity="0.12" />
          <ellipse
            cx="32"
            cy="34"
            rx="30"
            ry="9"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            transform="rotate(-22 32 34)"
          />
        </svg>
      );
    case "ufo":
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <ellipse cx="32" cy="34" rx="22" ry="9" fill="#fff" />
          <path d="M20 30 a12 9 0 0 1 24 0 z" fill="#fff" opacity="0.85" />
          <circle cx="24" cy="36" r="2.5" fill="#0f172a" />
          <circle cx="32" cy="38" r="2.5" fill="#0f172a" />
          <circle cx="40" cy="36" r="2.5" fill="#0f172a" />
          <path d="M26 43 L20 56 H44 L38 43 Z" fill="#fff" opacity="0.45" />
        </svg>
      );
    case "comet":
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <path
            d="M44 18 L18 44"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M50 14 L26 38"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.3"
          />
          <circle cx="44" cy="20" r="11" fill="#fff" />
          <circle cx="40" cy="16" r="3" fill="#000" opacity="0.12" />
        </svg>
      );
    case "helmet":
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none">
          <circle cx="32" cy="32" r="22" fill="#fff" />
          <path
            d="M18 30 a14 13 0 0 1 28 0 v6 a14 11 0 0 1 -28 0 z"
            fill="#0f172a"
            opacity="0.85"
          />
          <ellipse cx="26" cy="28" rx="5" ry="7" fill="#fff" opacity="0.7" />
        </svg>
      );
    default:
      return <StarGlyph className={className} />;
  }
}

function RocketGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M32 6 C42 14 45 26 45 36 C45 41 43 45 41 48 H23 C21 45 19 41 19 36 C19 26 22 14 32 6 Z"
        fill="#fff"
      />
      <circle cx="32" cy="28" r="6" fill="#38bdf8" />
      <path d="M23 44 L12 54 L24 50 Z" fill="#fb7185" />
      <path d="M41 44 L52 54 L40 50 Z" fill="#fb7185" />
      <path d="M27 49 C28 58 36 58 37 49 Z" fill="#fbbf24" />
    </svg>
  );
}

function StarGlyph({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <path
        d="M32 4 L40 24 L62 26 L45 40 L50 62 L32 50 L14 62 L19 40 L2 26 L24 24 Z"
        fill="currentColor"
        className="text-amber-300"
      />
    </svg>
  );
}
