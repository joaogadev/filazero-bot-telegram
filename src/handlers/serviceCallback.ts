import {
  getConversationState,
  updateConversationState
} from "../state/conversationState.js";


// callback do serviço
export async function handleServiceCallback({
  query,
  bot,
  mcp
}: any) {

  const chatId =
    query.message.chat.id;

  const data =
    query.data;

  const serviceId =
    Number(data.split(":")[1]);

  const state =
    getConversationState(chatId);

  updateConversationState(chatId, {
    selectedService: serviceId
  });

  const result =
    await mcp.callTool(
      "get_available_dates",
      {
        slug:
          state.selectedCompany,

        serviceId
      }
    );

  const rawText =
    result.result.content[0].text;

  const parsed =
    JSON.parse(rawText);

  const availableDates =
    Object.keys(
      parsed.horariosDisponiveis
    );

  const buttons =
    availableDates.map((date) => [
      {
        text: date,
        callback_data: `date:${date}`
      }
    ]);

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