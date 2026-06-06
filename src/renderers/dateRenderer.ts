export async function renderDates(
  bot: any,
  chatId: number,
  horariosDisponiveis: any
) {

  // pega somente as datas
  const availableDates =
    Object.keys(horariosDisponiveis);

  // transforma em botões
  const buttons =
    availableDates.map((date) => [
      {
        text: date,
        callback_data: `date:${date}`
      }
    ]);

  // envia mensagem
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