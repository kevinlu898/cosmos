import { useEffect, useState } from "react";
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
  const [shuffled, setShuffled] = useState([]);
  const [shuffledCorrect, setShuffledCorrect] = useState(null);
  const [textValue, setTextValue] = useState("");

  useEffect(() => {
    if (props.type !== "multiple-choice") return;

    const doShuffle = async () => {
      const hiddenOptions = Array.isArray(props.hiddenOptions)
        ? props.hiddenOptions
        : [];
      const options = (
        Array.isArray(props.options) ? props.options : []
      ).filter((option) => !hiddenOptions.includes(option));

      const paired = options.map((opt, i) => ({ opt, i }));
      for (let i = paired.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [paired[i], paired[j]] = [paired[j], paired[i]];
      }

      setShuffled(paired.map((p) => p.opt));
      const newIndex = paired.findIndex((p) => p.i === props.correct);
      setShuffledCorrect(newIndex >= 0 ? newIndex : null);
    };

    doShuffle();
  }, [props.hiddenOptions, props.options, props.correct, props.type]);

  return (
    <Card className="w-auto max-h-3xl gap-3 border-white/70 bg-white/85 p-4 backdrop-blur-md">
      <p className="text-center text-lg font-bold text-purple-900">
        {props.type === "text" ? "Type your answer!" : "Pick your answer!"}
      </p>

      {props.type === "multiple-choice" && (
        <div
          className={`grid items-stretch gap-3 transition-all duration-300 ${
            (Array.isArray(props.hiddenOptions) ? props.hiddenOptions : [])
              .length
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {(shuffled.length ? shuffled : props.options || [])
            .filter(
              (option) =>
                !(
                  Array.isArray(props.hiddenOptions) ? props.hiddenOptions : []
                ).includes(option),
            )
            .map((option, index) => (
              <Button
                key={index}
                variant={CHOICE_VARIANTS[index % CHOICE_VARIANTS.length]}
                size="lg"
                className="h-auto min-h-16 w-full max-w-full whitespace-normal break-words px-4 py-3 text-center text-lg leading-snug"
                disabled={props.disabled}
                onClick={() => {
                  const correctIndex = shuffled.length
                    ? shuffledCorrect
                    : props.correct;
                  if (index === correctIndex) {
                    props.whenCorrect(option);
                  } else {
                    props.whenWrong(option);
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
          <Button
            variant="success"
            size="lg"
            disabled={props.disabled}
            onClick={() =>
              props.answer === true
                ? props.whenCorrect("True")
                : props.whenWrong("True")
            }
          >
            👍 True
          </Button>
          <Button
            variant="danger"
            size="lg"
            disabled={props.disabled}
            onClick={() =>
              props.answer === false
                ? props.whenCorrect("False")
                : props.whenWrong("False")
            }
          >
            👎 False
          </Button>
        </div>
      )}

      {props.type === "text" && (
        <form
          className="flex w-[min(80vw,26rem)] h-34 flex-col items-stretch gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const value = textValue.trim();
            if (value && !props.disabled) props.onSubmit(value);
          }}
        >
          <Textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Type here..."
            className="h-20 w-full resize-none field-sizing-fixed"
            disabled={props.disabled}
          />
          <Button
            type="submit"
            variant="success"
            size="lg"
            disabled={props.disabled || !textValue.trim()}
          >
            Go!
          </Button>
        </form>
      )}
    </Card>
  );
}
