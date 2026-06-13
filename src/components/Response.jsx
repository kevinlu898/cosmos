import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

const CHOICE_VARIANTS = [
  "coral",
  "default",
  "success",
  "grape",
  "sun",
  "secondary",
];

export function Response(props) {
  return (
    <Card className="w-100 gap-5 p-6">
      <p className="text-center text-2xl font-bold text-purple-900">
        {props.type === "text" ? "Type your answer!" : "Pick your answer!"}
      </p>

      {props.type === "multiple-choice" && (
        <div className="grid grid-rows-2 gap-3">
          {props.options.map((option, index) => (
            <Button
              key={index}
              variant={CHOICE_VARIANTS[index % CHOICE_VARIANTS.length]}
              size="lg"
              onClick={() => {
                if (index === props.correct) {
                  props.whenCorrect();
                } else {
                  props.whenWrong();
                }
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {props.type === "true-false" && (
        <div className="grid grid-rows-2 gap-3">
          <Button variant="success" size="lg">
            👍 True
          </Button>
          <Button variant="danger" size="lg">
            👎 False
          </Button>
        </div>
      )}

      {props.type === "text" && (
        <div className="grid grid-rows-2 gap-3">
          <Textarea
            type="text"
            placeholder="Type here..."
            className="flex-1 h-40"
          />
          <Button variant="success" size="lg">
            Go!
          </Button>
        </div>
      )}
    </Card>
  );
}
