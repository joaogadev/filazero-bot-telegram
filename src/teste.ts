import "dotenv/config";
import { groq } from "./ai/groq.js";

const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",

  messages: [
    {
      role: "user",
      content: "Olá"
    }
  ]
});

console.log(
  response.choices[0].message.content
);