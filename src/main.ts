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

  const userMessage =
    msg.text || "";

  try {

    const state = getConversationState(chatId);

    //IA decide tool
    const aiResponse = await decideTool(userMessage, state);

    console.log("TOOL ESCOLHIDA:");
    console.log(aiResponse);

    //executa tool
    const result = await mcp.callTool(aiResponse.tool,  aiResponse.arguments);

    console.log("RESULTADO TOOL:");
    console.log(result);

    // salva memória
    updateConversationState(chatId, {
      lastTool: aiResponse.tool,
      lastArguments: aiResponse.arguments,
      lastResult: result
    });

    if (aiResponse.tool === "list_companies") {

      const rawText =
        result.result.content[0].text;

      const parsed =
        JSON.parse(rawText);

      updateConversationState(chatId, {
        companies: parsed.companies,
        currentStep: "CHOOSING_COMPANY"
      });

      const buttons = parsed.companies.map((company: any) => [
            {
              text: company.name,
              callback_data:
                `company:${company.slug}`
            }
          ]);

      await bot.sendMessage(chatId, "🏢 Escolha uma empresa:",
        {
          reply_markup: {
            inline_keyboard: buttons
          }
        }
      );

      return;
    }

    // resposta padrão
    const finalResponse = await generateResponse(aiResponse.tool, result);

    await bot.sendMessage(chatId, finalResponse);

  } catch (error) {

    console.error(error);

    await bot.sendMessage(
      chatId,
      "Erro interno no servidor"
    );
  }
});

//Callback para escolha de empresa e serviço
bot.on(
  "callback_query",
  async (query) => {

    const chatId =
      query.message?.chat.id;

    if (!chatId) return;

    const data =
      query.data || "";

    try {

      if (data.startsWith("company:")) {
        const slug = data.split(":")[1];

        updateConversationState(chatId, {
          selectedCompany: slug
        });

        const result = await mcp.callTool("get_company_services", { slug });

        const rawText = result.result.content[0].text;

        const parsed = JSON.parse(rawText);

        updateConversationState(chatId, {
          services: parsed.services,
          currentStep: "CHOOSING_SERVICE"
        });

        const buttons = parsed.services.map((service: any) => [
              {
                text: service.name,
                callback_data:
                  `service:${service.id}`
              }
            ]
          );

        await bot.sendMessage(chatId, "🛠 Escolha um serviço:",
          {
            reply_markup: {
              inline_keyboard: buttons
            }
          }
        );
      }

      if (data.startsWith("service:")) {
        const serviceId = Number( data.split(":")[1]);

        const state = getConversationState(chatId);

        const result = await mcp.callTool("get_available_dates",
            {
              serviceId,
              slug:
                state.selectedCompany
            }
          );

        const rawText = result.result.content[0].text;

        const parsed = JSON.parse(rawText);

        updateConversationState(chatId, {
          availableHours:
            parsed.horariosDisponiveis,
          currentStep: "CHOOSING_DATE"
        });

        const availableDates = Object.keys(parsed.horariosDisponiveis);

        const buttons = availableDates.map((date) => [
          {
            text: date,
            callback_data: `date:${date}`
          }
        ]);

        await bot.sendMessage(chatId, "📅 Escolha uma data:",
          {
            reply_markup: {
              inline_keyboard: buttons 
            }
          }
        );
      }

      if (data.startsWith("date:")) {

        const selectedDate =
          data.split(":")[1];

        const state =
          getConversationState(chatId);

        const hours =
          state.availableHours[selectedDate];

        const buttons = hours.map((hour: string) => [
          {
            text: hour,
            callback_data: `hour:${hour}`
          }
        ]);

        await bot.sendMessage(
          chatId,
          `🕒 Horários disponíveis para ${selectedDate}:`,
          {
            reply_markup: {
              inline_keyboard: buttons
            }
          }
        );

        updateConversationState(chatId, {
          selectedDate,
          currentStep: "CHOOSING_HOUR"
        });
      }

      if (data.startsWith("hour:")) {

        const selectedHour = data.split(":").slice(1).join(":");

        const state = getConversationState(chatId);

        const selectedDate = state.selectedDate;
        const serviceId = state.lastArguments?.serviceId || null;

        // validação de consistência (evita state quebrado)
        if (!selectedDate || !state.availableHours?.[selectedDate]) {
          await bot.sendMessage(chatId, "⚠️ Sessão expirada ou dados inválidos. Reinicie o agendamento.");
          return;
        }

        updateConversationState(chatId, {
          selectedHour,
          currentStep: "CONFIRMING_APPOINTMENT"
        });

        // aqui você já entra na camada de "checkout do agendamento"
        const confirmationText =
          `📌 Confirmação do agendamento:\n\n` +
          `📅 Data: ${selectedDate}\n` +
          `🕒 Hora: ${selectedHour}\n\n` +
          `Deseja confirmar?`;

        await bot.sendMessage(chatId, confirmationText, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "✅ Confirmar", callback_data: "confirm:appointment" },
                { text: "❌ Cancelar", callback_data: "cancel:appointment" }
              ]
            ]
          }
        });
      }

      await bot.answerCallbackQuery(query.id);

    } catch (error) {

      console.error(error);

      await bot.sendMessage(chatId, "Erro interno no servidor");
    }
  }
);
