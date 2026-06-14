import { Response } from "../components/Response";
import { Speech } from "../components/Speech";
import { Animal } from "../components/Animal";
import { Background } from "../components/Background";
import animalData from "../lib/animals.json";
import { animalKey, animalDisplayName } from "../lib/animalArt";
import { Button } from "../components/ui/button";
import { TopBar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { generateQuestion } from "../lib/ai";
import correctSound from "../assets/sounds/correct.mp3";
import wrongSound from "../assets/sounds/wrong.mp3";
import { playSound } from "../lib/sound";
import {
  speak,
  prefetchSpeech,
  stopSpeaking,
  isSpeechSupported,
} from "../lib/speech";
import { supabase, update } from "../lib/database";
import { addStardust, getOwnedItems, getStardust } from "../lib/utils";

// Read the question and its answer choices aloud as one friendly prompt.
function questionSpeech(q) {
  if (!q) return "";
  const choices = Array.isArray(q.responses) ? q.responses : [];
  if (!choices.length) return q.question;
  return `${q.question} Your choices are: ${choices.join(", ")}.`;
}
export default function Game() {
  const navigate = useNavigate();
  // The animal the player picked back in the Biome screen drives both the
  // character art and the matching biome background.
  const [selectedAnimal] = useState(
    () => localStorage.getItem("selectedAnimal") || "Lion",
  );
  const animalBiome =
    animalData[animalKey(selectedAnimal)]?.biome || "grassland";
  const animalName = animalDisplayName(selectedAnimal);
  const [question, setQuestion] = useState(null);
  const [userId, setUserId] = useState(null);
  const [stardustval, setStardust] = useState(0);
  const [streakSavers, setStreakSavers] = useState(0);
  const [smallHints, setSmallHints] = useState(0);
  const [smallHintUsed, setSmallHintUsed] = useState(false);
  const [removedChoice, setRemovedChoice] = useState(null);
  const [speechText, setSpeechText] = useState("Generating new question...");
  const [questionHistoryText, setQuestionHistoryText] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [answered, setAnswered] = useState(null);
  // Consecutive correct answers — three in a row makes the animal excited.
  const [streak, setStreak] = useState(0);
  // False once the page has been left, so a question that finishes loading
  // after we navigate away doesn't start talking on a page that's gone.
  const aliveRef = useRef(true);

  async function genQuestion() {
    setIsLoadingQuestion(true);
    setSmallHintUsed(false);
    setRemovedChoice(null);

    try {
      const selectedTopic = localStorage.getItem("selectedTopic") || "animals";
      const selectedAnimal =
        localStorage.getItem("selectedAnimal") || "teacher";
      const questionr = await generateQuestion(
        selectedTopic,
        selectedAnimal,
        questionHistoryText,
      );
      console.log(questionr);

      // 2. Wait for Deepgram to produce the audio before revealing anything.
      const line = questionSpeech(questionr);
      await prefetchSpeech(line);

      // User left while this was loading — don't reveal or start talking.
      if (!aliveRef.current) return;

      // 3. Both ready — show the question and play the (cached) audio together.
      setQuestion(questionr);
      setSpeechText(questionr.question);
      speak(line);
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

  // Stop any speech when leaving the page
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopSpeaking();
    };
  }, []);

  // Re-read whatever the animal is currently "saying".
  function replaySpeech() {
    speak(answered === null ? questionSpeech(question) : speechText);
  }

  async function handleAnswer(selectedAnswer, isCorrect) {
    playSound(isCorrect ? correctSound : wrongSound);
    const usedStreakSaver = !isCorrect && userId && streakSavers > 0;

    // Track the answer streak: +1 for correct, or protected by a streak saver.
    if (isCorrect) {
      setStreak((prev) => prev + 1);
    } else if (usedStreakSaver) {
      const nextStreakSavers = Math.max(streakSavers - 1, 0);
      setStreakSavers(nextStreakSavers);
      (async () => {
        try {
          await update(
            "profiles",
            userId,
            { streak_saver: nextStreakSavers },
            { column: "user_id" },
          );
        } catch (e) {
          console.warn("streak saver update failed", e);
        }
      })();
    } else {
      setStreak(0);
    }
    setQuestionHistoryText((previousHistory) => {
      const nextEntry = `Question: ${question?.question || ""}\nUser response: ${selectedAnswer}\n`;
      return previousHistory ? `${previousHistory}\n${nextEntry}` : nextEntry;
    });

    if (!userId) {
      return;
    }
    const feedback = isCorrect
      ? "Correct! " + question?.explanation
      : usedStreakSaver
        ? "Wrong, streak saver used. " + question?.explanation
        : "Wrong, no more streak savers left. " + question?.explanation;
    setSpeechText(feedback);
    // Read the feedback aloud (free browser text-to-speech).
    speak(feedback);

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
    // stop any feedback audio that's still playing, then load the next question
    stopSpeaking();
    setAnswered(null);
    await genQuestion();
  }

  async function handleSmallHint() {
    if (!userId) {
      return;
    }

    if (smallHintUsed) {
      return;
    }

    if (smallHints <= 0) {
      alert("You have no more small hints!");
      return;
    }

    const wrongChoices = Array.isArray(question?.responses)
      ? question.responses.filter(
          (choice) => choice !== question?.responses?.[question?.correct],
        )
      : [];

    if (!wrongChoices.length) {
      alert("You have no more small hints!");
      return;
    }

    const choiceToRemove =
      wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
    setRemovedChoice(choiceToRemove);
    setSmallHintUsed(true);

    const nextSmallHints = smallHints - 1;
    setSmallHints(nextSmallHints);
    try {
      await update(
        "profiles",
        userId,
        { small_hint: nextSmallHints },
        { column: "user_id" },
      );
    } catch (e) {
      console.warn("small hint update failed", e);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUserId = data?.session?.user?.id ?? null;
      setUserId(sessionUserId);
      setStardust(await getStardust(sessionUserId));
      const ownedItems = await getOwnedItems(sessionUserId);
      setStreakSavers(ownedItems.streak_saver ?? 0);
      setSmallHints(ownedItems.small_hint ?? 0);
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-linear-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={
          <Button size="xs" onClick={() => navigate("/home")}>
            🏠 Home
          </Button>
        }
        title="Explore"
        right={
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-purple-900 shadow-md">
              Streak Savers: {streakSavers}
            </div>
            <Button variant="secondary" size="xs" onClick={handleSmallHint}>
              Small Hints: {smallHints}
            </Button>
            <div className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-purple-900 shadow-md">
              Streak: {streak}
            </div>
            <Button variant="sun" size="xs" onClick={() => navigate("/shop")}>
              ⭐ {stardustval} Stardust
            </Button>
          </div>
        }
      />

      {(question || isLoadingQuestion) && (
        <Background biome={animalBiome}>
          <div className="flex h-full w-full flex-col items-center justify-between gap-3 overflow-hidden p-4 sm:p-6">
            <div className="flex shrink-0 items-start gap-2">
              <Speech
                text={
                  isLoadingQuestion ? "Thinking of a fun question…" : speechText
                }
                tone={
                  answered === null ? undefined : answered ? "correct" : "wrong"
                }
              />
              {isSpeechSupported() && !isLoadingQuestion && (
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={replaySpeech}
                  aria-label="Hear it again"
                  title="Hear it again"
                >
                  🔊
                </Button>
              )}
            </div>

            <Animal
              name={animalName}
              animal={selectedAnimal}
              expression={
                isLoadingQuestion
                  ? "relaxed"
                  : answered === null
                    ? "happy"
                    : answered
                      ? streak >= 3
                        ? "excited"
                        : "happy"
                      : "sad"
              }
              thinking={isLoadingQuestion}
            />

            <div className="flex w-full items-center justify-center">
              {isLoadingQuestion ? (
                <LoadingDots />
              ) : answered === null ? (
                <Response
                  type="multiple-choice"
                  options={question?.responses ?? []}
                  correct={question?.correct}
                  hiddenOptions={removedChoice ? [removedChoice] : []}
                  whenCorrect={(selectedAnswer) =>
                    handleAnswer(selectedAnswer, true)
                  }
                  whenWrong={(selectedAnswer) =>
                    handleAnswer(selectedAnswer, false)
                  }
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
