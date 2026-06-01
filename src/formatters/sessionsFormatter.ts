// Formata os horários disponíveis do atendimento
export function formatSessions(result: any): string {
  const sessions = result?.sessions;

  if (!sessions || sessions.length === 0) {
    return "Nenhum horário disponível.";
  }

  let message = "Horários disponíveis:\n\n";

  sessions.forEach((session: any, index: number) => {

    // Horário da sessão
    message += `${index + 1}. ${session.startTime}`;

    // Nome do profissional opcional
    if (session.professionalName) {
      message += ` - ${session.professionalName}`;
    }

    message += "\n";
  });

  message += "\nEscolha um horário.";

  return message;
}