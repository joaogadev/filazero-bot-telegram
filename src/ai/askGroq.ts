import {groq} from "./groq.js";

export async function askGroq(message: string) {
    const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: "system",
                content: `
                Você é um assistente MCP.

                Tools disponíveis:

                - list_companies
                Lista empresas disponíveis.

                Se o usuário quiser:
                - ver empresas
                - listar empresas
                - procurar empresas
                - iniciar agendamento

                retorne:

                {
                "tool": "list_companies",
                "arguments": {}
                }

                Responda APENAS JSON.`
            },
            {
                role: "user",
                content: message
            }
        ]
    });
    const content = response.choices[0].message.content;

    return JSON.parse(content || "{}");
}