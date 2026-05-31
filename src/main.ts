import "dotenv/config";

import { bot } from "./bot/telegram.js";

import { decideTool }
from "./ai/decideTool.js";

import { generateResponse }
from "./ai/responseGenerator.js";

import { MCPClient }
from "./mcp/MCPclient.js";

const mcp = new MCPClient();

console.log("Bot iniciado");

bot.on("message", async (msg) => {

  const chatId = msg.chat.id;

  const userMessage = msg.text || "";

  try {

    // IA escolhe tool
    const aiResponse = await decideTool(userMessage);

    console.log(aiResponse);

    // executa tool no MCP
    const result = await mcp.callTool(aiResponse.tool, aiResponse.arguments
    );

    console.log("RESULTADO TOOL:");
    console.log(result);

    // IA gera resposta humana
    const finalResponse = await generateResponse(userMessage, result);

    // responde telegram
    await bot.sendMessage(chatId,finalResponse);

  } catch (error) {
    console.error("ERRO:");
    console.error(error);

    await bot.sendMessage(chatId,"Erro interno no servidor");
  }
});