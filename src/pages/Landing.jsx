import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/ui/button";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") === "true") {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <AuthShell>
      <div className="flex flex-col items-center text-center">
        <img
          src="/logo-full.png"
          alt="Cosmos"
          className="h-65 w-auto mb-10 drop-shadow-[0_8px_24px_rgba(166,107,255,0.45)]"
        />

        <p className=" max-w-sm text-lg leading-relaxed text-white/80">
          Explore biomes, meet animal friends, and learn something new across
          the <span className="text-cosmos-yellow">universe</span> of knowledge.
        </p>

        <div className="mt-10 flex w-full flex-col gap-4 mb-10">
          <Button variant="cosmos" size="lg" className="w-full" onClick={() => navigate("/signin")}>
            Log In
          </Button>
          <Button variant="sunset" size="lg" className="w-full" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>

        <p className="mt-12 text-sm text-white/50">Made for curious young explorers </p>
      </div>
    </AuthShell>
  );
}
