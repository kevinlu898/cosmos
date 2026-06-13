import Game from "./pages/Game";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom"

export default function App(){
    return (
        <BrowserRouter>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/shop" element={<Shop />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}