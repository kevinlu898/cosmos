import { Response } from "../components/Response";
import { Speech } from "../components/Speech";
import { Animal } from "../components/Animal";
import { Background } from "../components/Background";

import { Button } from "../components/ui/button";
import { TopBar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateQuestion } from "../lib/ai";
import correctSound from "../assets/sounds/correct.mp3";
import wrongSound from "../assets/sounds/wrong.mp3";
import { playSound } from "../lib/sound";
import { supabase } from "../lib/database";
import { addStardust, getStardust } from "../lib/utils";
export default function Game() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [userId, setUserId] = useState(null);
  const [stardustval, setStardust] = useState(0);
  const [speechText, setSpeechText] = useState("Generating new question...");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [answered, setAnswered] = useState(null);

  async function genQuestion() {
    setIsLoadingQuestion(true);

    try {
      const questionr = await generateQuestion("animals", "teacher");
      console.log(questionr);
      setQuestion(questionr);
      setSpeechText(questionr.question);
    } finally {
      setIsLoadingQuestion(false);
    }
  }

  useEffect(() => {
    const initializeQuestion = async () => {
      await genQuestion();
    };

    initializeQuestion();
  }, []);

  async function handleAnswer(isCorrect) {
    playSound(isCorrect ? correctSound : wrongSound);

    if (!userId) {
      return;
    }
    setSpeechText(
      isCorrect
        ? "Correct! " + question?.explanation
        : "Wrong. " + question?.explanation,
    );

    // mark answered and don't generate the next question until the user clicks Next
    setAnswered(isCorrect);

    // update stardust asynchronously if correct
    if (isCorrect) {
      (async () => {
        try {
          const nextStardust = await addStardust(userId, 10);
          setStardust(nextStardust);
          console.log("Correct answer!");
        } catch (e) {
          console.warn("addStardust failed", e);
        }
      })();
    } else {
      console.log("Wrong answer!");
    }
  }

  async function handleNext() {
    // clear answered state, load next question
    setAnswered(null);
    await genQuestion();
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data?.session?.user?.id ?? null);
      setStardust(await getStardust(data?.session?.user?.id ?? null));
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={
          <Button size="xs" onClick={() => navigate("/")}>
            🏠 Home
          </Button>
        }
        title="Learning Time!"
        right={
          <Button variant="sun" size="xs" onClick={() => navigate("/shop")}>
            ⭐ {stardustval} Stardust
          </Button>
        }
      />

      {(question || isLoadingQuestion) && (
        <Background biome="arctic">
          <div className="flex h-full w-full flex-col items-center justify-between gap-3 overflow-hidden p-4 sm:p-6">
            <Speech
              text={isLoadingQuestion ? "Thinking of a fun question…" : speechText}
              tone={answered === null ? undefined : answered ? "correct" : "wrong"}
            />

            <Animal name="Lion" />

            <div className="flex w-full items-center justify-center">
              {isLoadingQuestion ? (
                <LoadingDots />
              ) : answered === null ? (
                <Response
                  type="multiple-choice"
                  options={question?.responses ?? []}
                  correct={question?.correct}
                  whenCorrect={() => handleAnswer(true)}
                  whenWrong={() => handleAnswer(false)}
                  disabled={isLoadingQuestion}
                />
              ) : (
                <Button
                  variant="grape"
                  size="lg"
                  onClick={handleNext}
                  disabled={isLoadingQuestion}
                >
                  Next question →
                </Button>
              )}
            </div>
          </div>
        </Background>
      )}
    </div>
  );
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-3 rounded-full bg-white/85 px-6 py-3 text-lg font-bold text-purple-900 shadow-lg backdrop-blur-md">
      <span className="flex gap-1">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-purple-400"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </span>
      Thinking…
    </div>
  );
}
