import Game from "./pages/Game";
import Test from "./pages/Testfile";
import Home from "./pages/Home";
import Area from "./pages/Area";
import Shop from "./pages/Shop";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
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
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/area/:id" element={<Area />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
