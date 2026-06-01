// Formata o status atual do ticket/agendamento
export function formatTicketStatus(result: any): string {
  const ticket = result?.ticket;

  if (!ticket) {
    return "Ticket não encontrado.";
  }

  return `
Status do Agendamento

Senha: ${ticket.number}

Data: ${ticket.date}

Horário: ${ticket.time}

Status: ${ticket.status}
`;
}