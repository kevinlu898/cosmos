import { useState } from "react";
import { generateQuestion } from "../lib/ai";
import { Button } from "../components/ui/button";

export default function Test() {
  const [question, setQuestion] = useState(null);
  function genQuestion() {
    const fetchQuestion = async () => {
      const questionr = await generateQuestion("animals", "teacher");
      console.log(questionr);
      setQuestion(questionr);
    };
    fetchQuestion();
  }

  return (
    <div>
      <h1>Welcome to the Shop Page</h1>
      <p>This is a simple shop page component.</p>

      <Button onClick={genQuestion}>Gen</Button>
      {question && (
        <div>
          <p>{question.question}</p>
          <ul>
            {question.responses.map((response, index) => (
              <li key={index}>{response}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
