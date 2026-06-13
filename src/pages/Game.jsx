import { Background } from "../components/Background";
import { Speech } from "../components/Speech";
import { Animal } from "../components/Animal";
import { Response } from "../components/Response";
function Game() {
  // choose a question prompt.
  // ai: generate a short conversation prompt
  // provide three different answer choices and a correct answer.

  return (
    <Background image="forest.jpg">
      <Speech text="Welcome to the game!" />
      <Animal image="lion.jpg" name="Lion" />
      <Response text="What would you like to do?" />
    </Background>
  );
}

export default Game;
