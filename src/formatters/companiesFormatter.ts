// Formatter de empresas disponíveis

export function formatCompanies(result: any): string {
  try {

    // pega texto retornado pelo MCP
    const rawText =
      result.result.content[0].text;

    // converte string JSON para objeto
    const parsed = JSON.parse(rawText);

    const companies = parsed.companies;

    if (!companies || companies.length === 0) {
      return "Nenhuma empresa disponível no momento.";
    }

    let message =
`🏢 Empresas disponíveis para agendamento:

`;

    companies.forEach((company: any, index: number) => {
      message +=
        `${index + 1}. ${company.name}
        Categoria: ${company.category}
        `;
    });

    message += "Digite o nome da empresa desejada.";

    return message;

  } catch (error) {

    console.error("Erro ao formatar empresas:");
    console.error(error);

    return "Erro ao processar empresas.";
  }
}