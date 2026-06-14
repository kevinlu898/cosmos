export const queryAI = async (question) => {
  const res = await fetch("https://mh-backend-eight.vercel.app/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return await res.json();
};

// Age-based customization
export function ageGroupOf(age) {
  const n = Number(age);
  if (!Number.isFinite(n) || n <= 0) return "5-8"; 
  if (n < 6) return "3-5";
  if (n < 10) return "5-8";
  return "10+";
}

const AGE_GUIDANCE = {
  "3-5":
    "The child is 3 to 5 years old. Use very simple words, very short sentences, and concrete, playful ideas a preschooler can picture.",
  "5-8":
    "The child is 5 to 8 years old. Use simple, clear language and you may introduce a little light reasoning and slightly richer detail.",
  "10+":
    "The learner is 10 years old or older. Use richer vocabulary and questions that require genuine reasoning.",
};

// The exact JSON shape we want back for each question type.
const FORMAT = {
  "multiple-choice": `{"type":"multiple-choice","question":"XXX","responses":["XXX","XXX","XXX"],"correct":X,"explanation":"XXX"}`,
  "true-false": `{"type":"true-false","question":"XXX","answer":true,"explanation":"XXX"}`,
  text: `{"type":"text","question":"XXX","explanation":"XXX"}`,
};

const TYPE_RULES = {
  "multiple-choice":
    "Provide exactly three responses, and set correct to the index (0, 1, or 2, chosen randomly) of the right answer. Give a short explanation of the correct answer, 20 words max.",
  "true-false":
    "Write a single statement that is clearly either true or false. Set answer to true if the statement is true and false if it is false. Give a short explanation, 20 words max.",
  text: "Ask one open-ended question the child answers in a sentence or two. In explanation, briefly describe what a good answer would include, 25 words max.",
};

function pickQuestionType(ageGroup) {
  if (ageGroup === "3-5") return "multiple-choice";
  const pool = ["multiple-choice", "multiple-choice", "true-false", "text"];
  return pool[Math.floor(Math.random() * pool.length)];
}

function parseAIJson(raw) {
  if (raw == null) throw new Error("empty AI response");
  let text = String(raw).trim();
  text = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }
  return JSON.parse(text);
}

export const generateQuestion = async (topic, character, prev, age) => {
  const ageGroup = ageGroupOf(age);
  const type = pickQuestionType(ageGroup);

  const prompt = `Generate a ${type} question about ${topic} for the user, imagining that you are a ${character}. ${AGE_GUIDANCE[ageGroup]} ${TYPE_RULES[type]} The previous questions were: '''${prev}'''. Make sure not to generate something that already happened, and adapt questions based on their performance on previous ones. Return data ONLY in the following format, with no changes compared to how I indicated; ${FORMAT[type]} NEVER use special characters or markdown. Ensure your response is age appropriate.`;

  const response = await queryAI(prompt);
  console.log(response.answer);
  const parsed = parseAIJson(response.answer);
  if (!parsed.type) parsed.type = type;
  return parsed;
};

export const evaluateTextAndGenerateNext = async ({
  topic,
  character,
  prev,
  age,
  question,
  userResponse,
}) => {
  const ageGroup = ageGroupOf(age);
  const nextType = pickQuestionType(ageGroup);

  const prompt = `You are imagining that you are a ${character} helping a child learn about ${topic}. ${AGE_GUIDANCE[ageGroup]}
The child was just asked this open-ended question: "${question}"
The child answered: "${userResponse}"
First, judge whether the answer is acceptable for the child's age. Be warm, encouraging, and lenient for younger children; accept answers that show understanding even if imperfect.
Then immediately create the NEXT question, which must be a ${nextType} question about ${topic}. Do not repeat earlier questions. The previous questions were: '''${prev}'''. ${TYPE_RULES[nextType]}
Return data ONLY in the following format, with no changes compared to how I indicated; {"evaluation":{"correct":true,"feedback":"XXX"},"next":${FORMAT[nextType]}}
In feedback, speak directly to the child in a friendly way, 25 words max. Set correct to true or false. NEVER use special characters or markdown.`;

  const response = await queryAI(prompt);
  console.log(response.answer);
  const parsed = parseAIJson(response.answer);
  if (parsed?.next && !parsed.next.type) parsed.next.type = nextType;
  return parsed;
};

export const talkToAI = async (message) => {
  const input = `
  You are a friend to a young children (ages 3-10). You are helpful, kind, and patient. You are having a conversation, and your friend asks, "${message}". Respond to this in an appropriate manner. Reply in words only with only the response. Do NOT add any extra text or formatting. Keep your response less than two sentences. NEVER use special characters or markdown.
  `;
  const response = await queryAI(input);
  return response;
};
