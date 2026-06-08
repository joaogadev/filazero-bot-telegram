import "dotenv/config";
import { bot } from "./bot/telegram.js";
import { MCPClient } from "./mcp/MCPclient.js";
import { getConversationState, updateConversationState } from "./state/conversationState.js";
import { executeAIFlow } from "./ai/executeAiFlow.js";
import { buildConfirmationMessage } from "./helpers/buildConfirmationMessage.js";

const mcp = new MCPClient();
console.log("Bot iniciado");

bot.on("message", async (msg) => {

  const chatId =
    msg.chat.id;

  const userMessage =
    msg.text || "";

  try {

    const state =
      getConversationState(chatId);

    // captura nome
    if (
      state.currentStep ===
      "ASKING_NAME"
    ) {

      updateConversationState(chatId, {
        customerName: userMessage,
        currentStep: "ASKING_PHONE"
      });

      await bot.sendMessage(
        chatId,
        "📱 Informe seu telefone:"
      );

      return;
    }

    // captura telefone
    if (
      state.currentStep ===
      "ASKING_PHONE"
    ) {

      updateConversationState(chatId, {
        customerPhone: userMessage,
        currentStep:
          "CONFIRMING_APPOINTMENT"
      });

      const updatedState =
        getConversationState(chatId);

      console.log(
        JSON.stringify(
          updatedState,
          null,
          2
        )
      );

      await bot.sendMessage(
        chatId,
        buildConfirmationMessage(
          updatedState
        ),
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✅ Confirmar",
                  callback_data:
                    "confirm:appointment"
                }
              ],
              [
                {
                  text: "❌ Cancelar",
                  callback_data:
                    "cancel:appointment"
                }
              ]
            ]
          }
        }
      );

      return;
    }

    await executeAIFlow(
      userMessage,
      state,
      chatId,
      bot,
      mcp
    );

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

        const state = getConversationState(chatId);

        const company = state.companies?.find(
            (c: any) =>
              c.slug === slug
          );

        updateConversationState(chatId, {
          selectedCompany: slug,
          selectedCompanyName:
            company?.name
        });

        const result = await mcp.callTool("get_company_services", { slug });

        const rawText = result.result.content[0].text;

        const parsed = JSON.parse(rawText);

        console.log("PARSED MCP:");
        console.log(JSON.stringify(parsed,null,2));

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

        const serviceId =
          Number(data.split(":")[1]);

        const state =
          getConversationState(chatId);

        const selectedService =
          state.services?.find(
            (s: any) => s.id === serviceId
          );

        updateConversationState(chatId, {
          selectedService,
          selectedServiceName:
            selectedService?.name,
          currentStep: "CHOOSING_LOCATION"
        });

        const result =
          await mcp.callTool(
            "get_business_units",
            {
              slug: state.selectedCompany
            }
          );

        const rawText =
          result.result.content[0].text;

        const parsed =
          JSON.parse(rawText);

        updateConversationState(chatId, {
          businessUnits:
            parsed.businessUnits
        });

        const buttons =
          parsed.businessUnits.map(
            (unit: any) => [
              {
                text: unit.name,
                callback_data:
                  `location:${unit.id}`
              }
            ]
          );

        await bot.sendMessage(
          chatId,
          "📍 Escolha uma unidade:",
          {
            reply_markup: {
              inline_keyboard: buttons
            }
          }
        );
      }

      if (data.startsWith("location:")) {

        const locationId =
          Number(data.split(":")[1]);

        const state =
          getConversationState(chatId);

        const location = state.businessUnits?.find(
          (unit: any) =>
            unit.id === locationId
        );

        updateConversationState(chatId, {
          selectedLocation: locationId,
          selectedLocationName:
            location?.name,
          currentStep: "CHOOSING_DATE"
        });

        const sessionResult =
          await mcp.callTool(
            "get_available_sessions",
            {
              slug: state.selectedCompany,
              serviceId: state.selectedService.id,
              locationId,
              date: "06/06/2026"
            }
          );

        console.log(
          "SESSIONS TEST:"
        );

        console.log(
          JSON.stringify(
            sessionResult,
            null,
            2
          )
        );

        const result =
          await mcp.callTool(
            "get_available_dates",
            {
              slug:
                state.selectedCompany,

              serviceId:
                state.selectedService.id
            }
          );

        const rawText =
          result.result.content[0].text;

        const parsed =
          JSON.parse(rawText);

        updateConversationState(chatId, {
          availableHours:
            parsed.horariosDisponiveis
        });

        const availableDates =
          Object.keys(
            parsed.horariosDisponiveis
          );

        const buttons =
          availableDates.map(
            (date) => [
              {
                text: date,
                callback_data:
                  `date:${date}`
              }
            ]
          );

        await bot.sendMessage(
          chatId,
          "📅 Escolha uma data:",
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
          currentStep: "ASKING_NAME"
        });

        await bot.sendMessage(
          chatId,
          "👤 Informe seu nome completo:"
        );

        return;
      }

      if (data === "confirm:appointment") {

        const state =
          getConversationState(chatId);

        const appointmentBody = {

          serviceId:
            state.selectedService.id,

          locationId:
            state.selectedLocation,

          date:
            state.selectedDate,

          time:
            state.selectedHour,

          customerName:
            state.customerName,

          customerPhone:
            state.customerPhone
        };

        const result =
          await mcp.callTool(
            "schedule_appointment",
            {
              body: appointmentBody,
              token:
                process.env.USER_TOKEN
            }
          );

        console.log(
          JSON.stringify(
            result,
            null,
            2
          )
        );

        const rawText =
          result.result.content[0].text;

        await bot.sendMessage(
          chatId,
          rawText
        );

        return;
      }

      await bot.answerCallbackQuery(query.id);

    } catch (error) {

      console.error(error);

      await bot.sendMessage(chatId, "Erro interno no servidor");
    }
  }
);
