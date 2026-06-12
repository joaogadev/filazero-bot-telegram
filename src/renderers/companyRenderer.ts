import {
  updateConversationState
} from "../state/conversationState.js";

export async function renderCompanies(
  bot: any,
  chatId: number,
  companies: any[]
) {

  updateConversationState(chatId, {
    companies,
    currentStep: "CHOOSING_COMPANY"
  });

  const buttons =
    companies.map(
      (company: any) => [
        {
          text: company.name,
          callback_data:
            `company:${company.slug}`
        }
      ]
    );

  await bot.sendMessage(
    chatId,
    "🏢 Escolha uma empresa:",
    {
      reply_markup: {
        inline_keyboard: buttons
      }
    }
  );
}