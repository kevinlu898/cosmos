import { Response } from "../components/Response";
import { Speech } from "../components/Speech";
import { Animal } from "../components/Animal";
import { Background } from "../components/Background";

import { Button } from "../components/ui/button";
import { TopBar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { generateQuestion } from "../lib/ai";
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
        left={<Button size="xs" onClick={() => navigate("/")}>🏠 Home</Button>}
        title="Learning Time!"
        right={<Button variant="sun" size="xs" onClick={() => navigate("/shop")}>⭐ 120 Stardust</Button>}
      />
    <div className="flex h-full flex-col overflow-hidden bg-linear-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <Navbar stardustval={stardustval} />

      {(question || isLoadingQuestion) && (
        <div className="flex flex-1 flex-row items-center justify-center gap-6 overflow-hidden p-6">
          <Speech text={isLoadingQuestion ? "Loading..." : speechText} />
          <Animal name="Lion" />
          {isLoadingQuestion ? (
            <div className="flex flex-1 items-center justify-center rounded-3xl border border-white/60 bg-white/70 p-6 text-xl font-medium text-purple-900 shadow-lg">
              Loading...
            </div>
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
            <div className="flex items-center">
              <button
                className="rounded-lg bg-purple-700 px-6 py-3 text-white disabled:opacity-50"
                onClick={handleNext}
                disabled={isLoadingQuestion}
              >
                Next
              </button>
            </div>
          )}
      {question && (
        <div className="relative flex-1 overflow-hidden">
          <Background biome="artic">
            <div className="flex h-full w-full flex-col items-center justify-between gap-3 p-4 sm:p-6">
              <Speech text={question.question} />
              <Animal name="Lion" />
              <Response
                type="multiple-choice"
                options={question.responses}
                correct={question.correct}
                whenCorrect={whenCorrect}
                whenWrong={whenWrong}
              />
            </div>
          </Background>
        </div>
      )}
    </div>
  );
}

function Navbar(props) {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between bg-white/70 px-4 py-3 shadow-[0_4px_20px_-8px_rgba(90,70,160,0.4)] backdrop-blur-sm">
      <Button size="sm" onClick={() => navigate("/")}>
        🏠 Home
      </Button>

      <h1 className="flex items-center gap-2 text-2xl font-bold text-purple-900 sm:text-3xl">
        Learning Time!
      </h1>

      <Button variant="sun" size="sm" onClick={() => navigate("/shop")}>
        ⭐ {props.stardustval} Stardust
      </Button>
    </nav>
  );
}
