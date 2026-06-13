import { Response } from "../components/Response";
import { Speech } from "../components/Speech";
import { Animal } from "../components/Animal";

import { Button } from "../components/ui/button";
import { TopBar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Game() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={<Button size="xs" onClick={() => navigate("/")}>🏠 Home</Button>}
        title="Learning Time!"
        right={<Button variant="sun" size="xs" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>}
      />
      
      <div className="flex flex-1 flex-row items-center justify-center gap-6 overflow-hidden p-6">
        <Speech text="What do you want to do together?" />
        <Animal name="Lion" />
        <Response type="multiple-choice" options={["Play", "Eat", "Sleep"]} />
      </div>
    </div>
  );
}

