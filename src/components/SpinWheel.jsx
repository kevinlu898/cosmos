import { useRef, useState } from "react";
import { Button } from "./ui/button";

const SLICE_COLORS = [
  "#a66bff",
  "#2e8cff",
  "#2ed8ff",
  "#ff5aa5",
  "#ff8a5b",
  "#ffc83d",
  "#36dfff",
  "#c084fc",
];

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function SpinWheel({ segments, onResult }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [done, setDone] = useState(false);
  const pendingIndex = useRef(0);

  const n = segments.length;
  const seg = 360 / n;

  function spin() {
    if (spinning || done) return;
    setSpinning(true);

    const index = Math.floor(Math.random() * n);
    pendingIndex.current = index;

    const current = ((rotation % 360) + 360) % 360;
    const desired = (360 - (index * seg + seg / 2) + 360) % 360;
    const delta = 5 * 360 + ((desired - current + 360) % 360);
    setRotation(rotation + delta);
  }

  function handleTransitionEnd() {
    if (!spinning) return;
    setSpinning(false);
    setDone(true);
    onResult(segments[pendingIndex.current], pendingIndex.current);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        {/* fixed pointer */}
        <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2">
          <div className="h-0 w-0 border-x-[14px] border-t-[22px] border-x-transparent border-t-white drop-shadow-md" />
        </div>

        <div
          className="h-[280px] w-[280px] rounded-full ring-8 ring-white/90 drop-shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4.2s cubic-bezier(0.16, 1, 0.3, 1)"
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            {segments.map((value, i) => {
              const a0 = i * seg;
              const a1 = (i + 1) * seg;
              const [x0, y0] = polar(100, 100, 100, a0);
              const [x1, y1] = polar(100, 100, 100, a1);
              const [lx, ly] = polar(100, 100, 64, (a0 + a1) / 2);
              const largeArc = a1 - a0 > 180 ? 1 : 0;
              return (
                <g key={i}>
                  <path
                    d={`M100,100 L${x0},${y0} A100,100 0 ${largeArc} 1 ${x1},${y1} Z`}
                    fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                  <text
                    x={lx}
                    y={ly}
                    fill="#ffffff"
                    fontSize="20"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "Fredoka, sans-serif" }}
                  >
                    {value}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="14" fill="#ffffff" />
          </svg>
        </div>
      </div>

      <Button
        variant="grape"
        size="lg"
        onClick={spin}
        disabled={spinning || done}
      >
        {spinning ? "Spinning…" : done ? "Spun!" : "🎡 Spin the wheel!"}
      </Button>
    </div>
  );
}
