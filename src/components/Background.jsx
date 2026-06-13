export function Background(props) {
  return (
    <div
      className="background"
      style={{ backgroundImage: `url(/src/assets/${props.image})` }}
    >
      {props.children}
    </div>
  );
}
