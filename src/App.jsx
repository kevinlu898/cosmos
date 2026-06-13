import Game from "./pages/Game";
import Test from "./pages/Testfile";
import Home from "./pages/Home";
import Area from "./pages/Area";
import Shop from "./pages/Shop";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Topic from "./pages/Topic";
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
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/game" element={<Game />} />
          <Route path="/area/:areaId" element={<Area />} />
          <Route path="/topic/:areaId/:animal" element={<Topic />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="test" element={<Test />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
