import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateResponse(
  userMessage: string,
  toolResult: any
): Promise<string> {

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `
Você é um assistente da Filazero.

Responda de forma:
- natural
- amigável
- objetiva

NÃO responda em JSON.
`
      },

      {
        role: "user",
        content: `
Usuário:
${userMessage}

Resultado da tool:
${JSON.stringify(toolResult)}
`
      }
    ]
  });

  const content = completion.choices[0].message.content;

  console.log("RESPOSTA FINAL IA:");
  console.log(content);

  return content || "Sem resposta";
}