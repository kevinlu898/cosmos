export const queryAI = async (question) => {
  const res = await fetch("https://mh-backend-eight.vercel.app/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return await res.json();
};

export const generateQuestion = async (topic, character) => {
  let min = 10;
  let max = 20;
  let random = Math.floor(Math.random() * (max - min + 1)) + min;
  const response = await queryAI(
    `${random}. Generate a question about ${topic} for the user, imagining that you are a ${character}. Make it for young children. Provide three responses, and indicate a correct response by an index 0-2. Return data in the following format, with no changes compared to how I indicated; {"question":"XXX", "responses": ["XXX", "XXX", "XXX"], "correct": X}`,
  );
  console.log(response.answer);
  return JSON.parse(response.answer);
};
