import {Button} from "../components/ui/button";
import {Input} from "../components/ui/input";

export function Response(props){
    return (
        <div className="flex flex-col flex-1 overflow-hidden border-black border-4 rounded-[50px] p-4">
            <p className="text-3xl font-bold">{props.type === "text" ? "Type your response!" : "Choose a response!"}</p>
            <div className="flex flex-col gap-2 overflow-auto my-10">
                {props.type === "multiple-choice" && (
                    <div className="flex flex-col gap-2">
                        {props.options.map((option, index) => (
                            <Button key={index}>{option}</Button>
                        ))}
                    </div>
                )}
                {props.type === "multi-select" && (
                    <div className="flex flex-col gap-2">
                        {props.options.map((option, index) => (
                            <Button key={index}>{option}</Button>
                        ))}
                    </div>
                )}
                {props.type === "text" && (
                    <div>
                        <Input className="text-xl" type="text" placeholder="Type here" />
                        <Button size="md" className="w-full">Submit</Button>
                    </div>
                )}
                {props.type === "true-false" && (
                    <div className="flex flex-col gap-2">
                        <Button className="w-full">True</Button>
                        <Button className="w-full">False</Button>
                    </div>
                )}
            </div>
        </div>
    );
}