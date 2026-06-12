import {
  updateConversationState
} from "../state/conversationState.js";

export async function renderServices(
  bot: any,
  chatId: number,
  services: any[]
) {

  updateConversationState(chatId, {
    services,
    currentStep: "CHOOSING_SERVICE"
  });

  const buttons =
    services.map(
      (service: any) => [
        {
          text: service.name,
          callback_data:
            `service:${service.id}`
        }
      ]
    );

  await bot.sendMessage(
    chatId,
    "🛠 Escolha um serviço:",
    {
      reply_markup: {
        inline_keyboard: buttons
      }
    }
  );
}