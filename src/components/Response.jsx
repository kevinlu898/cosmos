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

  useEffect(() => {
    if (props.type !== "multiple-choice") return;

    const doShuffle = async () => {
      const options = Array.isArray(props.options) ? props.options : [];

      // Pair each option with its original index
      const paired = options.map((opt, i) => ({ opt, i }));

      // Fisher-Yates shuffle
      for (let i = paired.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [paired[i], paired[j]] = [paired[j], paired[i]];
      }

      setShuffled(paired.map((p) => p.opt));

      // find new index where original index === props.correct
      const newIndex = paired.findIndex((p) => p.i === props.correct);
      setShuffledCorrect(newIndex >= 0 ? newIndex : null);
    };

    doShuffle();
  }, [props.options, props.correct, props.type]);

  return (
    <Card className="w-100 gap-5 p-6">
      <p className="text-center text-2xl font-bold text-purple-900">
        {props.type === "text" ? "Type your answer!" : "Pick your answer!"}
      </p>

      {props.type === "multiple-choice" && (
        <div className="grid grid-rows-2 gap-3">
          {(shuffled.length ? shuffled : props.options || []).map(
            (option, index) => (
              <Button
                key={index}
                variant={CHOICE_VARIANTS[index % CHOICE_VARIANTS.length]}
                size="lg"
                disabled={props.disabled}
                onClick={() => {
                  const correctIndex = shuffled.length
                    ? shuffledCorrect
                    : props.correct;
                  if (index === correctIndex) {
                    props.whenCorrect();
                  } else {
                    props.whenWrong();
                  }
                }}
              >
                {option}
              </Button>
            ),
          )}
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
