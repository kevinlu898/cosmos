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
    <Card className="w-auto max-h-3xl gap-3 border-white/70 bg-white/85 p-4 backdrop-blur-md">
      <p className="text-center text-lg font-bold text-purple-900">
        {props.type === "text" ? "Type your answer!" : "Pick your answer!"}
      </p>

      {props.type === "multiple-choice" && (
        <div className="grid grid-cols-3 gap-3">
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
