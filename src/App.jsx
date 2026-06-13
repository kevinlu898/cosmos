import Game from "./pages/Game";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import Area from "./pages/Area";
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/area/:areaId" element={<Area />} />
                <Route path="/game" element={<Game />} />
                <Route path="/shop" element={<Shop />} />
            </Routes>
        </BrowserRouter>
    )
}