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
    <Card className="w-auto max-w-3xl gap-3 border-white/70 bg-white/85 p-4 backdrop-blur-md">
      <p className="text-center text-lg font-bold text-purple-900">
        {props.type === "text" ? "Type your answer!" : "Pick your answer!"}
      </p>

      {props.type === "multiple-choice" && (
        <div className="flex flex-wrap justify-center gap-3">
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
        <div className="flex justify-center gap-3">
          <Button variant="success" size="lg">
            👍 True
          </Button>
          <Button variant="danger" size="lg">
            👎 False
          </Button>
        </div>
      )}

      {props.type === "text" && (
        <div className="flex flex-col items-stretch gap-3">
          <Textarea type="text" placeholder="Type here..." className="h-24" />
          <Button variant="success" size="lg">
            Go!
          </Button>
        </div>
      )}
    </Card>
  );
}
