import { Response } from "../components/Response";
import { Speech } from "../components/Speech";
import { Animal } from "../components/Animal";
import { Background } from "../components/Background";
import animalData from "../lib/animals.json";
import { animalKey, animalDisplayName } from "../lib/animalArt";
import { Button } from "../components/ui/button";
import { SpinWheel } from "../components/SpinWheel";
import { TopBar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { generateQuestion, evaluateTextAndGenerateNext } from "../lib/ai";
import correctSound from "../assets/sounds/correct.mp3";
import wrongSound from "../assets/sounds/wrong.mp3";
import { playSound } from "../lib/sound";
import { playAnimalSound } from "../lib/animalSounds";
import { speak, prefetchSpeech, stopSpeaking } from "../lib/speech";
import { supabase, update, getById } from "../lib/database";
import { addStardust, getOwnedItems } from "../lib/utils";

function questionSpeech(q) {
  if (!q) return "";
  if (q.type === "true-false") return `True or false? ${q.question}`;
  if (q.type === "text") return q.question;
  const choices = Array.isArray(q.responses) ? q.responses : [];
  if (!choices.length) return q.question;
  return `${q.question} Your choices are: ${choices.join(", ")}.`;
}
export default function Game() {
  const navigate = useNavigate();
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
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [answered, setAnswered] = useState(null);
  const [pendingNext, setPendingNext] = useState(null);
  const [streak, setStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [reward, setReward] = useState(null);
  const ageRef = useRef(null);
  const aliveRef = useRef(true);

  // Speak a line with the animal's own call before and after it talks, so the
  // lion roars (or the elephant trumpets) around what it says.
  async function speakAsAnimal(line) {
    playAnimalSound(selectedAnimal);
    await speak(line);
    if (aliveRef.current) playAnimalSound(selectedAnimal);
  }

  async function genQuestion(isActive = () => aliveRef.current) {
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
        ageRef.current,
      );
      console.log(questionr);

      // 2. Wait for Deepgram to produce the audio before revealing anything.
      const line = questionSpeech(questionr);
      await prefetchSpeech(line);

      // This run was superseded (page left, or StrictMode threw it away) —
      // don't reveal or start talking.
      if (!isActive()) return;

      // 3. Both ready — show the question and play the (cached) audio together.
      setQuestion(questionr);
      setSpeechText(questionr.question);
      speakAsAnimal(line);
    } finally {
      if (isActive()) setIsLoadingQuestion(false);
    }
  }

  useEffect(() => {
    // A per-mount token: this run only reveals/speaks while it's the live one.
    let cancelled = false;
    // Load the player's profile (age + currencies) first so the very first
    // question is already tailored to their age, then generate it.
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUserId = data?.session?.user?.id ?? null;
      setUserId(sessionUserId);

      const profile = sessionUserId
        ? await getById("profiles", sessionUserId, { column: "user_id" })
        : null;
      ageRef.current = profile?.age ?? null;
      setStardust(profile?.stardust ?? 0);

      const ownedItems = await getOwnedItems(sessionUserId);
      setStreakSavers(ownedItems.streak_saver ?? 0);
      setSmallHints(ownedItems.small_hint ?? 0);

      if (!cancelled) await genQuestion(() => !cancelled);
    };
    init();
    return () => {
      cancelled = true;
      stopSpeaking();
    };
  }, []);

  // Stop any speech when leaving the page
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      stopSpeaking();
    };
  }, []);

  // `feedbackOverride` lets open-ended text answers use the AI's own spoken
  // grade instead of the canned "Correct!/Wrong" wording built from the
  // question's explanation.
  async function handleAnswer(selectedAnswer, isCorrect, feedbackOverride) {
    playSound(isCorrect ? correctSound : wrongSound);
    // The animal reacts with its own call right after the answer is submitted.
    playAnimalSound(selectedAnimal);
    // Count every answer toward the session tally that sizes the wheel reward.
    setAnsweredCount((c) => c + 1);
    if (isCorrect) setCorrectCount((c) => c + 1);
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
    const feedback =
      feedbackOverride != null
        ? feedbackOverride
        : isCorrect
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

  // Open-ended answers are graded by the AI, which also returns the next
  // question in the same call. We grade, then preload that next question (and
  // its audio) so "Next" is instant.
  async function handleTextAnswer(text) {
    const trimmed = (text || "").trim();
    if (!trimmed || isEvaluating) return;

    setIsEvaluating(true);
    setSpeechText("Let me think about your answer…");
    try {
      const selectedTopic = localStorage.getItem("selectedTopic") || "animals";
      const character = localStorage.getItem("selectedAnimal") || "teacher";
      const result = await evaluateTextAndGenerateNext({
        topic: selectedTopic,
        character,
        prev: questionHistoryText,
        age: ageRef.current,
        question: question?.question || "",
        userResponse: trimmed,
      });

      const isCorrect = !!result?.evaluation?.correct;
      const feedback =
        result?.evaluation?.feedback || (isCorrect ? "Great job!" : "Good try!");
      const next = result?.next ?? null;

      // Warm the next question's audio so revealing it later reads instantly.
      if (next) prefetchSpeech(questionSpeech(next));

      if (!aliveRef.current) return;
      setPendingNext(next);
      handleAnswer(trimmed, isCorrect, feedback);
    } catch (e) {
      console.warn("text evaluation failed", e);
      if (aliveRef.current) {
        handleAnswer(
          trimmed,
          false,
          "Hmm, I couldn't check that one. Let's keep going!",
        );
      }
    } finally {
      if (aliveRef.current) setIsEvaluating(false);
    }
  }

  async function handleNext() {
    stopSpeaking();
    setAnswered(null);
    if (pendingNext) {
      const next = pendingNext;
      setPendingNext(null);
      setSmallHintUsed(false);
      setRemovedChoice(null);
      const line = questionSpeech(next);
      await prefetchSpeech(line); 
      if (!aliveRef.current) return;
      setQuestion(next);
      setSpeechText(next.question);
      speakAsAnimal(line);
      return;
    }

    await genQuestion();
  }

  async function handleSmallHint() {
    if (!userId) {
      return;
    }

    if (question?.type && question.type !== "multiple-choice") {
      alert("Small Hints only work on multiple choice questions!");
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
  const accuracy = answeredCount ? correctCount / answeredCount : 0;
  const maxReward = Math.min(
    99,
    Math.round(answeredCount * 10 * (0.3 + 0.7 * accuracy)),
  );
  const wheelSegments = buildWheelSegments(maxReward);

  function handleEndSession() {
    stopSpeaking();
    if (answeredCount === 0) {
      navigate("/home");
      return;
    }
    setSessionEnded(true);
  }

  async function handleWheelResult(value) {
    setReward(value);
    if (value > 0) playSound(correctSound);
    if (userId && value > 0) {
      try {
        const nextStardust = await addStardust(userId, value);
        setStardust(nextStardust);
      } catch (e) {
        console.warn("wheel reward addStardust failed", e);
      }
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-linear-to-b from-sky-200 via-sky-100 to-emerald-50 font-[Fredoka]">
      <TopBar
        left={
          <Button variant="destructive" size="sm" onClick={handleEndSession}>
            End Session
          </Button>
        }
        title="Explore"
        right={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleSmallHint}>
              Small Hints ({smallHints})
            </Button>
            <div className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-purple-900 shadow-md">
              Streak: {streak}
            </div>
            <div className="rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-purple-900 shadow-md">
              Streak Savers ({streakSavers})
            </div>
            <Button variant="sun" size="sm" onClick={() => navigate("/shop")}>
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
                  isLoadingQuestion
                    ? "Thinking of a fun question…"
                    : isEvaluating
                      ? "Let me think about your answer…"
                      : speechText
                }
                tone={
                  answered === null ? undefined : answered ? "correct" : "wrong"
                }
              />
            </div>

            <Animal
              name={animalName}
              animal={selectedAnimal}
              expression={
                isLoadingQuestion || isEvaluating
                  ? "relaxed"
                  : answered === null
                    ? "happy"
                    : answered
                      ? streak >= 3
                        ? "excited"
                        : "happy"
                      : "sad"
              }
              thinking={isLoadingQuestion || isEvaluating}
            />

            <div className="flex w-full items-center justify-center">
              {isLoadingQuestion || isEvaluating ? (
                <LoadingDots />
              ) : answered === null ? (
                question?.type === "true-false" ? (
                  <Response
                    type="true-false"
                    answer={question?.answer}
                    whenCorrect={(selectedAnswer) =>
                      handleAnswer(selectedAnswer, true)
                    }
                    whenWrong={(selectedAnswer) =>
                      handleAnswer(selectedAnswer, false)
                    }
                    disabled={isLoadingQuestion || isEvaluating}
                  />
                ) : question?.type === "text" ? (
                  <Response
                    key={question?.question}
                    type="text"
                    onSubmit={handleTextAnswer}
                    disabled={isLoadingQuestion || isEvaluating}
                  />
                ) : (
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
                )
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

      {sessionEnded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cosmos-navy/70 p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] border-4 border-white/70 bg-linear-to-b from-white to-sky-50 p-6 text-center shadow-2xl sm:p-8">
            <h2 className="text-3xl font-bold text-cosmos-purple">
              Session complete!
            </h2>
            <div className="flex w-full justify-center gap-3 text-sm font-bold">
              <div className="flex-1 rounded-2xl bg-purple-100 px-3 py-2 text-purple-900">
                <div className="text-2xl">{answeredCount}</div>
                Questions
              </div>
              <div className="flex-1 rounded-2xl bg-emerald-100 px-3 py-2 text-emerald-900">
                <div className="text-2xl">{Math.round(accuracy * 100)}%</div>
                Accuracy
              </div>
            </div>

            {reward === null ? (
              <>
                <p className="text-base font-medium text-slate-600">
                  Spin to win up to{" "}
                  <span className="font-bold text-cosmos-purple">
                    {maxReward}
                  </span>{" "}
                  ⭐ Stardust!
                </p>
                <SpinWheel
                  segments={wheelSegments}
                  onResult={handleWheelResult}
                />
              </>
            ) : (
              <>
                <div className="rounded-2xl bg-amber-100 px-6 py-4">
                  <p className="text-lg font-medium text-amber-800">You won</p>
                  <p className="text-4xl font-bold text-amber-600">
                    ⭐ {reward}
                  </p>
                </div>
                <Button
                  variant="grape"
                  size="lg"
                  onClick={() => navigate("/home")}
                >
                  🏠 Back to Home
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function buildWheelSegments(max) {
  const n = 8;
  if (max <= 0) return Array.from({ length: n }, () => 0);
  const values = Array.from({ length: n }, (_, i) =>
    Math.max(1, Math.round((max * (i + 1)) / n)),
  );
  const order = [0, 4, 1, 5, 2, 6, 3, 7];
  return order.map((i) => values[i]);
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
