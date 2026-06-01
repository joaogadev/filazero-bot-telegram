// Formata as datas disponíveis para agendamento

export function formatAvailableDates(result: any): string {
  const dates = result?.availableDates;

  if (!dates || dates.length === 0) {
    return "Não existem datas disponíveis.";
  }

  let message = "Datas disponíveis:\n\n";

  dates.forEach((date: string, index: number) => {

    // Converte data para formato brasileiro
    const formattedDate = new Date(date)
      .toLocaleDateString("pt-BR");

    message += `${index + 1}. ${formattedDate}\n`;
  });

  message += "\nEscolha uma data.";

  return message;
}