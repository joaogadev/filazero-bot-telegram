// Formata a listagem de tickets do usuário

export function formatMyTickets(result: any): string {
  const tickets = result?.tickets;

  if (!tickets || tickets.length === 0) {
    return "Você não possui agendamentos.";
  }

  let message = "Seus agendamentos:\n\n";

  tickets.forEach((ticket: any, index: number) => {

    // Empresa do atendimento
    message += `${index + 1}. ${ticket.company}\n`;

    // Data do atendimento
    message += `${ticket.date}\n`;

    // Horário do atendimento
    message += `${ticket.time}\n`;

    // Status atual
    message += `${ticket.status}\n\n`;
  });

  return message;
}