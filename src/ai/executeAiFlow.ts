import { decideTool } from "./decideTool.js";
import { resolveToolArguments } from "./resolveToolArguments.js";
import { generateResponse } from "./responseGenerator.js";

import { updateConversationState } from "../state/conversationState.js";

import { renderCompanies } from "../renderers/companyRenderer.js";
import { renderServices } from "../renderers/serviceRenderer.js";
import { renderDates } from "../renderers/dateRenderer.js";
import { renderHours } from "../renderers/hourRenderer.js";
import { parseRelativeDate } from "../parsers/dateParser.js";
import { parseHour } from "../parsers/hourParser.js";

export async function executeAIFlow(
  userMessage: string,
  state: any,
  chatId: number,
  bot: any,
  mcp: any
) {

  // IA decide tool
  const aiResponse =
    await decideTool(userMessage, state);

  if (aiResponse.arguments?.date) {
    const parsedDate =
      parseRelativeDate(
        aiResponse.arguments.date
      );

    if (parsedDate) {

      aiResponse.arguments.date =
        parsedDate;
    }
  }

  if (
    aiResponse.arguments?.hour
  ) {

    const parsedHour =
      parseHour(
        aiResponse.arguments.hour
      );

    if (parsedHour) {

      aiResponse.arguments.hour =
        parsedHour;
    }
  }

  console.log("TOOL ESCOLHIDA:");
  console.log(aiResponse);

  // resolve argumentos
  const resolvedArguments =
    await resolveToolArguments(
      aiResponse.tool,
      aiResponse.arguments,
      state,
      mcp,
      chatId
    );

  // executa MCP
  const result =
    await mcp.callTool(
      aiResponse.tool,
      resolvedArguments
    );

  console.log("RESULTADO TOOL:");
  console.log(result);

  updateConversationState(chatId, {
    lastTool: aiResponse.tool,
    lastArguments: resolvedArguments,
    lastResult: result
  });

  const rawText =
    result.result.content[0].text;

  // proteção contra erro MCP
  if (rawText.startsWith("MCP error")) {

    await bot.sendMessage(
      chatId,
      rawText
    );

    return;
  }

  const parsed =
    JSON.parse(rawText);

  // renderização inteligente

  if (aiResponse.tool === "list_companies") {

    updateConversationState(chatId, {
      companies: parsed.companies
    });

    await renderCompanies(
      bot,
      chatId,
      parsed.companies
    );

    return;
  }

  if (aiResponse.tool === "get_company_services") {

    updateConversationState(chatId, {
      services: parsed.services
    });

    await renderServices(
      bot,
      chatId,
      parsed.services
    );

    return;
  }

  if (aiResponse.tool === "get_available_dates") {

    updateConversationState(chatId, {
      availableHours:
        parsed.horariosDisponiveis
    });

    await renderDates(
      bot,
      chatId,
      parsed.horariosDisponiveis
    );

    return;
  }

  if (aiResponse.tool === "get_available_sessions") {

    await renderHours(
      bot,
      chatId,
      parsed.sessions
    );

    return;
  }

  // fallback padrão

  const finalResponse =
    await generateResponse(
      aiResponse.tool,
      result
    );

  await bot.sendMessage(
    chatId,
    finalResponse
  );
}