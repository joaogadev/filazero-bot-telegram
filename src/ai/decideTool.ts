import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

export async function decideTool(
  message: string,
  state: any
) {

  const completion = await client.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",

    messages: [
      {
        role: "system",
        content: `
Você é um assistente da Filazero.

Sua função é escolher a tool MCP correta.

TOOLS DISPONÍVEIS:

- list_companies
- get_company_services
- get_available_dates
- get_available_sessions
- get_booking_form
- schedule_appointment
- check_ticket_status
- list_my_tickets

Você deve responder APENAS JSON.

Exemplo:
{
  "tool": "list_companies",
  "arguments": {}
}
`
      },

      {
        role: "user",
        content: `
Mensagem do usuário:
${message}

Estado atual:
${JSON.stringify(state)}
`
      }
    ],

    temperature: 0
  });

  const content =
    completion.choices[0].message.content || "{}";

  const cleanContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanContent);
}