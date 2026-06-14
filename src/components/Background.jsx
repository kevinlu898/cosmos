import { useEffect } from "react";
import treeSounds from "../assets/sounds/treeSounds.mp3";
import grassSounds from "../assets/sounds/grassSounds.mp3";
import windSounds from "../assets/sounds/windSounds.mp3";

const SKY = {
  forest: "bg-linear-to-b from-sky-300 via-emerald-50 to-emerald-100",
  arctic: "bg-linear-to-b from-sky-200 via-sky-100 to-blue-100",
  grassland: "bg-linear-to-b from-sky-300 via-amber-50 to-amber-100",
};

function normalize(biome) {
  const b = (biome || "").toLowerCase();
  if (b.startsWith("arc") || b.startsWith("art")) return "arctic";
  if (b.startsWith("sav") || b.startsWith("grass") || b.startsWith("plain")) return "grassland";
  return "forest";
}

const SOUND = {
  forest: treeSounds,
  arctic: windSounds,
  grassland: grassSounds,
};

const SCENES = { forest: ForestScene, arctic: ArcticScene, grassland: GrasslandScene };

// The biome's visuals 
function BiomeScene({ biome = "forest", className = "" }) {
  const b = normalize(biome);
  const Scene = SCENES[b];
  return (
    <div className={`overflow-hidden ${SKY[b]} ${className}`}>
      <Scene />
      <BiomeStyles />
    </div>
  );
}

function Background({ biome = "forest", children }) {
  const b = normalize(biome);

  // Play the biome's sound for exactly 10 seconds.
  useEffect(() => {
    const audio = new Audio(SOUND[b]);
    audio.loop = true; 
    audio.volume = 0.4;

    let stopTimer;
    let removeGesture = () => {};

    const playFor10s = () => {
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          clearTimeout(stopTimer);
          stopTimer = setTimeout(() => audio.pause(), 10000);
        })
        .catch(() => {
          const start = () => {
            removeGesture();
            playFor10s();
          };
          window.addEventListener("pointerdown", start, { once: true });
          window.addEventListener("keydown", start, { once: true });
          removeGesture = () => {
            window.removeEventListener("pointerdown", start);
            window.removeEventListener("keydown", start);
          };
        });
    };

    playFor10s();

    return () => {
      removeGesture();
      clearTimeout(stopTimer);
      audio.pause();
      audio.src = "";
    };
  }, [b]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <BiomeScene biome={biome} className="absolute inset-0" />

      <div className="relative z-20 flex h-full w-full items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}

function biomeSound(biome) {
  return SOUND[normalize(biome)];
}

export { Background, BiomeScene, biomeSound };
export default Background;

function ForestScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* soft sun + drifting clouds */}
      <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-yellow-200/70 blur-2xl" />
      <Cloud className="left-[12%] top-[12%] w-24 biome-drift" />
      <Cloud className="right-[18%] top-[20%] w-16 biome-drift" style={{ animationDelay: "-4s" }} />

      {/* distant tree line */}
      {[10, 22, 78, 90].map((l, i) => (
        <Pine key={i} className="absolute bottom-[24%] w-[12%] origin-bottom biome-sway-2" style={{ left: `${l}%`, animationDelay: `${i * 0.8}s`, filter: "saturate(0.7) brightness(0.92)", opacity: 0.7 }} />
      ))}

      {/* ground */}
      <div className="absolute bottom-0 h-[26%] w-full rounded-t-[40%] bg-linear-to-b from-emerald-400 to-emerald-600" />

      {/* foreground trees framing the sides, keeping the centre open */}
      <Pine className="absolute bottom-[16%] left-[1%] w-[20%] origin-bottom biome-sway" />
      <Pine className="absolute bottom-[14%] left-[14%] w-[15%] origin-bottom biome-sway-2" style={{ animationDelay: "0.6s" }} />
      <Pine className="absolute bottom-[16%] right-[1%] w-[21%] origin-bottom biome-sway" style={{ animationDelay: "1.2s" }} />
      <Pine className="absolute bottom-[14%] right-[15%] w-[14%] origin-bottom biome-sway-2" style={{ animationDelay: "0.3s" }} />

      {/* friendly forest-floor details */}
      <Bush className="absolute bottom-[12%] left-[26%] w-[12%]" />
      <Bush className="absolute bottom-[11%] right-[27%] w-[11%]" />
      <span className="absolute bottom-[14%] left-[34%] text-2xl">🍄</span>
      <span className="absolute bottom-[13%] right-[35%] text-xl">🍄</span>

      {/* slow drifting leaves */}
      <FallingLayer items={makeParticles(["🍂", "🍁", "🍃"], 7)} />
    </div>
  );
}

function ArcticScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-white/80 blur-xl" />
      <Cloud className="left-[14%] top-[14%] w-24 biome-drift" />
      <Cloud className="right-[12%] top-[10%] w-20 biome-drift" style={{ animationDelay: "-6s" }} />

      {/* snowy mountains on the horizon */}
      <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute bottom-[24%] left-0 h-[34%] w-full">
        <polygon points="-20,160 70,40 160,160" fill="#dcebff" />
        <polygon points="60,40 86,62 54,62" fill="#ffffff" />
        <polygon points="120,160 230,20 340,160" fill="#cadfff" />
        <polygon points="230,20 262,52 198,52" fill="#ffffff" />
        <polygon points="300,160 380,60 460,160" fill="#dcebff" />
      </svg>

      {/* snowy ground + drifts */}
      <div className="absolute bottom-0 h-[27%] w-full rounded-t-[45%] bg-linear-to-b from-white to-sky-100" />
      <div className="absolute bottom-[20%] left-[10%] h-10 w-40 rounded-[50%] bg-white blur-[2px]" />
      <div className="absolute bottom-[18%] right-[12%] h-8 w-32 rounded-[50%] bg-white blur-[2px]" />

      {/* snow-topped pines */}
      <SnowyPine className="absolute bottom-[18%] left-[3%] w-[16%] origin-bottom biome-sway-2" />
      <SnowyPine className="absolute bottom-[17%] right-[4%] w-[15%] origin-bottom biome-sway-2" style={{ animationDelay: "1s" }} />

      {/* a cheerful snowman */}
      <Snowman className="absolute bottom-[14%] left-[20%] w-[12%]" />

      {/* gentle falling snow */}
      <FallingLayer items={makeParticles(["❄️", "❅", "✦"], 14, true)} />
    </div>
  );
}

function GrasslandScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* big friendly sun */}
      <SmilingSun className="absolute left-6 top-5 w-24 sm:w-28" />
      <Cloud className="right-[16%] top-[12%] w-24 biome-drift" />

      {/* rolling hills */}
      <div className="absolute bottom-[26%] left-0 h-[22%] w-full rounded-t-[60%] bg-lime-300/80" />
      <div className="absolute bottom-[24%] -left-[10%] h-[18%] w-[70%] rounded-t-[60%] bg-lime-400/80" />
      <div className="absolute bottom-[24%] -right-[10%] h-[20%] w-[70%] rounded-t-[60%] bg-lime-400/70" />

      {/* acacia trees */}
      <Acacia className="absolute bottom-[28%] left-[6%] w-[26%] origin-bottom biome-sway-2" />
      <Acacia className="absolute bottom-[30%] right-[8%] w-[20%] origin-bottom biome-sway-2" style={{ animationDelay: "1.2s" }} />

      {/* golden ground */}
      <div className="absolute bottom-0 h-[26%] w-full bg-linear-to-b from-amber-300 to-yellow-600" />

      {/* swaying tall grass across the foreground */}
      <div className="absolute bottom-0 left-0 flex h-[18%] w-full items-end justify-around">
        {Array.from({ length: 22 }).map((_, i) => (
          <GrassBlade key={i} i={i} />
        ))}
      </div>

      {/* a fluttering butterfly + occasional drifting petals */}
      <span className="biome-flutter absolute left-[30%] top-[40%] text-2xl">🦋</span>
      <FallingLayer items={makeParticles(["🌼", "🌾", "✿"], 6)} />
    </div>
  );
}

function Cloud({ className = "", style }) {
  return (
    <div className={`absolute ${className}`} style={style}>
      <div className="relative aspect-[2/1] w-full rounded-full bg-white/90 shadow-sm">
        <div className="absolute -top-1/3 left-1/4 h-2/3 w-2/3 rounded-full bg-white/90" />
        <div className="absolute -top-1/4 right-1/5 h-1/2 w-1/2 rounded-full bg-white/90" />
      </div>
    </div>
  );
}

function Pine({ className = "", style }) {
  return (
    <svg viewBox="0 0 100 140" className={className} style={style}>
      <rect x="44" y="104" width="12" height="32" rx="3" fill="#7c4a21" />
      <polygon points="50,8 84,58 16,58" fill="#2f8f4e" />
      <polygon points="50,36 88,92 12,92" fill="#3aa861" />
      <polygon points="50,64 92,116 8,116" fill="#2f8f4e" />
    </svg>
  );
}

function SnowyPine({ className = "", style }) {
  return (
    <svg viewBox="0 0 100 140" className={className} style={style}>
      <rect x="44" y="104" width="12" height="32" rx="3" fill="#8a5a2b" />
      <polygon points="50,8 84,58 16,58" fill="#2f8f4e" />
      <polygon points="50,36 88,92 12,92" fill="#3aa861" />
      <polygon points="50,64 92,116 8,116" fill="#2f8f4e" />
      <polygon points="50,8 70,38 30,38" fill="#ffffff" />
      <polygon points="50,40 74,70 26,70" fill="#ffffff" opacity="0.95" />
      <polygon points="50,68 80,96 20,96" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

function Bush({ className = "" }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative aspect-[2/1] w-full">
        <div className="absolute bottom-0 left-0 h-full w-2/3 rounded-full bg-emerald-500" />
        <div className="absolute bottom-0 right-0 h-5/6 w-2/3 rounded-full bg-emerald-600" />
        <div className="absolute bottom-0 left-1/4 h-full w-2/3 rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}

function Acacia({ className = "", style }) {
  return (
    <svg viewBox="0 0 160 120" className={className} style={style}>
      <path d="M80 120 L78 56 M78 64 L52 44 M78 60 L106 42" stroke="#6b4f2a" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="42" rx="68" ry="17" fill="#3f7d3a" />
      <ellipse cx="80" cy="35" rx="54" ry="13" fill="#4e9447" />
      <ellipse cx="80" cy="30" rx="34" ry="9" fill="#5bab52" />
    </svg>
  );
}

function Snowman({ className = "" }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative mx-auto aspect-[3/5] w-full">
        <div className="absolute bottom-0 left-1/2 h-[42%] w-[78%] -translate-x-1/2 rounded-full bg-white shadow" />
        <div className="absolute bottom-[34%] left-1/2 h-[34%] w-[58%] -translate-x-1/2 rounded-full bg-white shadow" />
        <div className="absolute bottom-[62%] left-1/2 h-[26%] w-[42%] -translate-x-1/2 rounded-full bg-white shadow" />
        <div className="absolute bottom-[78%] left-[40%] h-[5%] w-[7%] rounded-full bg-slate-800" />
        <div className="absolute bottom-[78%] right-[40%] h-[5%] w-[7%] rounded-full bg-slate-800" />
        <div className="absolute bottom-[73%] left-1/2 h-[4%] w-[16%] -translate-x-1/2 rounded-r-full bg-orange-400" />
        <div className="absolute bottom-[60%] left-1/2 h-[6%] w-[46%] -translate-x-1/2 rounded-full bg-rose-400" />
      </div>
    </div>
  );
}

function SmilingSun({ className = "" }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative aspect-square w-full">
        <svg viewBox="0 0 100 100" className="biome-spin absolute inset-0 h-full w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x="48" y="2" width="4" height="14" rx="2" fill="#fcd34d" transform={`rotate(${i * 30} 50 50)`} />
          ))}
        </svg>
        <div className="absolute inset-[18%] rounded-full bg-yellow-300 shadow-[0_0_30px_rgba(252,211,77,0.8)]" />
        <div className="absolute left-[38%] top-[42%] h-[7%] w-[7%] rounded-full bg-amber-700" />
        <div className="absolute right-[38%] top-[42%] h-[7%] w-[7%] rounded-full bg-amber-700" />
        <div className="absolute left-1/2 top-[54%] h-[14%] w-[28%] -translate-x-1/2 rounded-b-full border-b-4 border-amber-700" />
      </div>
    </div>
  );
}

function GrassBlade({ i }) {
  const h = 50 + (i % 5) * 14; 
  const colors = ["bg-lime-600", "bg-green-600", "bg-amber-500", "bg-lime-500"];
  return (
    <div
      className={`biome-grass w-[1.6%] origin-bottom rounded-t-full ${colors[i % colors.length]}`}
      style={{ height: `${h}%`, animationDelay: `${(i % 7) * 0.3}s` }}
    />
  );
}

/* ----- slow-falling particle layer ----- */
function makeParticles(chars, count, snow = false) {
  return Array.from({ length: count }, (_, i) => ({
    char: chars[i % chars.length],
    left: (i * 37 + 6) % 96,
    size: (snow ? 12 : 16) + (i % 3) * 6,
    dur: (snow ? 8 : 10) + (i % 5) * 1.6,
    delay: -(i * 1.9),
    drift: (i % 2 ? 1 : -1) * (16 + (i % 4) * 12),
    spin: snow ? 90 : 360,
  }));
}

function FallingLayer({ items }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {items.map((p, i) => (
        <span
          key={i}
          className="biome-fall absolute top-0 leading-none"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
            "--spin": `${p.spin}deg`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
}

/* ----- scoped animations ----- */
function BiomeStyles() {
  return (
    <style>{`
      @keyframes biome-fall {
        0%   { top: -12%; opacity: 0; transform: translateX(0) rotate(0deg); }
        8%   { opacity: 1; }
        90%  { opacity: 1; }
        100% { top: 112%; opacity: 0; transform: translateX(var(--drift, 20px)) rotate(var(--spin, 360deg)); }
      }
      .biome-fall { animation-name: biome-fall; animation-timing-function: linear; animation-iteration-count: infinite; will-change: top, transform; }

      @keyframes biome-sway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
      .biome-sway   { animation: biome-sway 4.2s ease-in-out infinite; }
      .biome-sway-2 { animation: biome-sway 5.6s ease-in-out infinite; }

      @keyframes biome-grass { 0%,100% { transform: skewX(-7deg); } 50% { transform: skewX(7deg); } }
      .biome-grass { animation: biome-grass 3.2s ease-in-out infinite; }

      @keyframes biome-drift { from { transform: translateX(-8px); } to { transform: translateX(8px); } }
      .biome-drift { animation: biome-drift 9s ease-in-out infinite alternate; }

      @keyframes biome-spin { to { transform: rotate(360deg); } }
      .biome-spin { animation: biome-spin 28s linear infinite; transform-origin: 50% 50%; }

      @keyframes biome-flutter {
        0%   { transform: translate(0,0) rotate(-6deg); }
        25%  { transform: translate(40px,-24px) rotate(8deg); }
        50%  { transform: translate(90px,6px) rotate(-6deg); }
        75%  { transform: translate(40px,26px) rotate(8deg); }
        100% { transform: translate(0,0) rotate(-6deg); }
      }
      .biome-flutter { animation: biome-flutter 11s ease-in-out infinite; }

      @media (prefers-reduced-motion: reduce) {
        .biome-fall, .biome-sway, .biome-sway-2, .biome-grass, .biome-drift, .biome-spin, .biome-flutter { animation: none !important; }
      }
    `}</style>
  );
}
