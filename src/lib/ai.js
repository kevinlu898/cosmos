export const queryAI = async (question) => {
  const res = await fetch("https://mh-backend-eight.vercel.app/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return await res.json();
};

export const generateQuestion = async (topic, character, prev) => {
  const response = await queryAI(
    `Generate a question about ${topic} for the user, imagining that you are a ${character}. Make it for young children. Provide three responses, and indicate a correct response by an index 0-2 randomly, inclusive. Give a short, 20 word max explanation of the correct answer. The previous questions were: '''${prev}'''. Make sure not to generate something that already happened, and make them adaptive. Return data in the following format, with no changes compared to how I indicated; {"question":"XXX", "responses": ["XXX", "XXX", "XXX"], "correct": X, "explanation": "XXX"}`,
  );
  console.log(response.answer);
  return JSON.parse(response.answer);
};

export const talkToAI = async (message) => {
  const input = `
  You are a friend to a young children (ages 3-10). You are helpful, kind, and patient. You are having a conversation, and your friend asks, "${message}". Respond to this in an appropriate manner. Reply in words only with only the response. Do NOT add any extra text or formatting. Keep your response less than two sentences.
  `;
  const response = await queryAI(input);
  return response;
};
