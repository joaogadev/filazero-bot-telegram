import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function decideTool(message: string) {

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

    messages: [
      {
        role: "system",
        content: `
Você é um roteador MCP.

Você só pode utilizar UMA dessas tools:

- list_companies
- get_company_services
- get_available_dates
- get_available_sessions
- get_booking_form
- schedule_appointment
- check_ticket_status
- list_my_tickets

Retorne SOMENTE JSON.

Exemplo:
{
  "tool": "list_companies",
  "arguments": {}
}
`
      },

      {
        role: "user",
        content: message,
      },
    ],
  });

  const content = completion.choices[0].message.content || "{}";

  console.log("RESPOSTA BRUTA GROQ:");
  console.log(content);

  // remove markdown ```json
  const cleanContent = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanContent);
}