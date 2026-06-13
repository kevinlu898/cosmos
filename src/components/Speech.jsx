export function Speech(props) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden border-black border-4 text-lg p-4">
      <p className="text-sm">{props.text}</p>
    </div>
  );
}
