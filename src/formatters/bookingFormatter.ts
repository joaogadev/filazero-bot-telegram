// Formata a confirmação do agendamento

export function formatBooking(result: any): string {
  const ticket = result?.ticket;

  if (!ticket) {
    return "Não foi possível realizar o agendamento.";
  }

  return `
Agendamento realizado com sucesso!

Ticket: ${ticket.number}

Data: ${ticket.date}

Horário: ${ticket.time}

Empresa: ${ticket.company}

Guarde seu número de atendimento.
`;
}