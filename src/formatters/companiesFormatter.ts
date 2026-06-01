// Formata a listagem de empresas disponíveis

export function formatCompanies(result: any): string {
  const companies = result?.companies;

  if (!companies || companies.length === 0) {
    return "Nenhuma empresa disponível no momento.";
  }

  let message = "Empresas disponíveis para agendamento:\n\n";

  companies.forEach((company: any, index: number) => {

    // Nome da empresa
    message += `${index + 1}. ${company.name}\n`;

    // Descrição opcional
    if (company.description) {
      message += `${company.description}\n`;
    }

    message += "\n";
  });

  message += "Digite o nome da empresa desejada.";

  return message;
}