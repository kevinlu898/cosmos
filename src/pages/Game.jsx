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
import { addStardust } from "../lib/utils";

export default function Game() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [claims, setClaims] = useState(null);

  function genQuestion() {
    const fetchQuestion = async () => {
      const questionr = await generateQuestion("animals", "teacher");
      console.log(questionr);
      setQuestion(questionr);
    };
    fetchQuestion();
  }

  useEffect(() => {
    genQuestion();
  }, []);

  async function whenCorrect() {
    await addStardust(claims?.user_id, 10);
    console.log("Correct answer!");
  }

  function whenWrong() {
    console.log("Wrong answer!");
  }

  useEffect(() => {
    const fetchUser = async () => {
      supabase.auth.getClaims().then(({ data }) => {
        setClaims(data?.claims);
      });
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
