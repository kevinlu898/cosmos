import { Response } from "../components/Response";
import { Speech } from "../components/Speech";
import { Animal } from "../components/Animal";

import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Game() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <Navbar />
      <div className="flex flex-1 flex-row items-center justify-center gap-6 overflow-hidden p-6">
        <Speech text="What do you want to do together?" />
        <Animal name="Lion" />
        <Response type="multiple-choice" options={["Play", "Eat", "Sleep"]} />
      </div>
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between bg-white/70 px-4 py-3 shadow-[0_4px_20px_-8px_rgba(90,70,160,0.4)] backdrop-blur-sm">
      <Button size="sm" onClick={() => navigate("/")}>🏠 Home</Button>

      <h1 className="flex items-center gap-2 text-2xl font-bold text-purple-900 sm:text-3xl">
        Learning Time!
      </h1>

      <Button variant="sun" size="sm" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>
    </nav>
  );
}
