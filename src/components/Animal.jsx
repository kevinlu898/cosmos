export function Animal(props){
    return (
        <div className="flex flex-col flex-1 overflow-hidden bg-gray-200 justify-center items-center">
            <p>{props.name} image</p>
        </div>
    )
}