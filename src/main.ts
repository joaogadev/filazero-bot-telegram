import "dotenv/config";
import { bot } from "./bot/telegram.js";
import { askGroq } from "./ai/askGroq.js";
import { MCPClient} from "./mcp/MCPclient.js";
const mcp = new MCPClient();
console.log("Bot iniciado");

bot.on("message", async (msg) => {

  const chatId = msg.chat.id;

  const userMessage = msg.text || "";
  try {
    //pergunta a IA oq fzr
    const airesponse = await askGroq(userMessage);
    console.log(airesponse);

    //executa a tool no mcp
    const result = await mcp.callTool(
      airesponse.tool,
      airesponse.arguments
    );
    
    //responde o telegram
    //await bot.sendMessage(chatId, JSON.stringify(result, null, 2));
    const finalResponse = await askGroq(
      `
      Usuario disse: ${userMessage}
      Resultado da tool ${JSON.stringify(result)}
      Responda o usuário de forma clara e objetiva.
      `
    );
    await bot.sendMessage(chatId, finalResponse);
  } catch (error) {
      console.error("ERRO COMPLETO:");
      console.error(error);

      if (error instanceof Error) {
        console.error("MESSAGE:", error.message);
        console.error("STACK:", error.stack);
      }

      bot.sendMessage(
        chatId,
        "erro interno no servidor"
      );
  }
});