import {Response} from "../components/Response";
import {Speech} from "../components/Speech";
import {Animal} from "../components/Animal";

import {Button} from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Game(){
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Navbar />
            <div className="flex flex-row flex-1 overflow-hidden">
                <Speech text="What do you want to do together?" />
                <Animal name="Lion" />
                <Response
                    type="text"
                />
            </div>
        </div>
    )
}

function Navbar(){
    const navigate = useNavigate();
    return (
        <nav className="flex flex-row items-center justify-center bg-blue-100 text-white p-4">
            <Button className="absolute left-0" onClick={() => navigate("/home")}>Home</Button>
            <h1 className="text-md font-bold">Learning Time!</h1>
        </nav>
    )
}
