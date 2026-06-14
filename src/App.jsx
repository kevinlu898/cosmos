import Game from "./pages/Game";
import Test from "./pages/Testfile";
import Home from "./pages/Home";
import Biome from "./pages/Biome";
import Shop from "./pages/Shop";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Topic from "./pages/Topic";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import clickSound from "./assets/sounds/click.mp3";
import { playSound } from "./lib/sound";

export default function App() {
  // Play a click sound on every click, anywhere in the app.
  useEffect(() => {
    const onClick = () => playSound(clickSound, 0.5);
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <BrowserRouter>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/game" element={<Game />} />
          <Route path="/biome/:biomeId" element={<Biome />} />
          <Route path="/topic/:biomeId/:animal" element={<Topic />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
