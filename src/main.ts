import "dotenv/config";

import { bot } from "./bot/telegram.js";
import { decideTool } from "./ai/decideTool.js";
import { generateResponse } from "./ai/responseGenerator.js";
import { MCPClient } from "./mcp/MCPclient.js";
import { getConversationState, updateConversationState } from "./state/conversationState.js";

const mcp = new MCPClient();

console.log("Bot iniciado");

bot.on("message", async (msg) => {

  const chatId = msg.chat.id;

  const userMessage = msg.text || "";

  try {

    // pega estado atual da conversa
    const state = getConversationState(chatId);

    // IA decide próxima tool
    const aiResponse = await decideTool(
      userMessage,
      state
    );

    console.log("TOOL ESCOLHIDA:");
    console.log(aiResponse);

    // executa tool no MCP
    const result = await mcp.callTool(
      aiResponse.tool,
      aiResponse.arguments
    );

    console.log("RESULTADO TOOL:");
    console.log(result);

    // atualiza memória
    updateConversationState(chatId, {
      lastTool: aiResponse.tool,
      lastArguments: aiResponse.arguments,
      lastResult: result
    });

    // gera resposta amigável
    const finalResponse = await generateResponse(
      aiResponse.tool,
      result
    );

    // envia mensagem
    await bot.sendMessage(
      chatId,
      finalResponse
    );

  } catch (error) {

    console.error("ERRO:");
    console.error(error);

    await bot.sendMessage(
      chatId,
      "Erro interno no servidor"
    );
  }
});