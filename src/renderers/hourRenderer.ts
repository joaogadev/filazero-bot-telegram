export async function renderHours(
  bot: any,
  chatId: number,
  hours: string[]
) {

  // cria botões
  const buttons =
    hours.map((hour) => [
      {
        text: hour,
        callback_data: `hour:${hour}`
      }
    ]);

  // envia mensagem
  await bot.sendMessage(
    chatId,
    "🕒 Escolha um horário:",
    {
      reply_markup: {
        inline_keyboard: buttons
      }
    }
  );
}