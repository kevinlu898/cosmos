import { Image } from "./components/ui/image.jsx";

function Animal(props) {
  return (
    <div className="animal-container">
      <Image
        className="animal"
        src={`/src/assets/${props.image}`}
        alt={props.name}
      ></Image>
    </div>
  );
}

export default Animal;
