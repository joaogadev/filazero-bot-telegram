import { formatCompanies } from "../formatters/companiesFormatter.js";
import { formatServices } from "../formatters/servicesFormatter.js";
import { formatAvailableDates } from "../formatters/datesFormatter.js";
import { formatSessions } from "../formatters/sessionsFormatter.js";
import { formatBooking } from "../formatters/bookingFormatter.js";
import { formatMyTickets } from "../formatters/myTicketFormatter.js";
import { formatTicketStatus } from "../formatters/ticketStatusFormatter.js";

export async function generateResponse(
  tool: string,
  result: any
) {

  const rawText =
    result.result.content[0].text;

  /*
    ERRO MCP
  */
  if (
    result.result.isError
  ) {
    return rawText;
  }

  const parsed =
    JSON.parse(rawText);

  /*
    LIST COMPANIES
  */
  if (tool === "list_companies") {

    if (!parsed.companies?.length) {
      return "Nenhuma empresa encontrada.";
    }

    return parsed.companies
      .map(
        (company: any, index: number) =>
          `${index + 1}. ${company.name}`
      )
      .join("\n");
  }

  /*
    GET COMPANY SERVICES
  */
  if (tool === "get_company_services") {

    if (!parsed.services?.length) {
      return "Nenhum serviço encontrado.";
    }

    let message =
      "🛠 Serviços disponíveis:\n\n";

    parsed.services.forEach(
      (service: any, index: number) => {

        message +=
          `${index + 1}. ${service.name}\n`;
      }
    );

    return message;
  }

  /*
    GET AVAILABLE DATES
  */
  if (tool === "get_available_dates") {

    const dates =
      Object.keys(
        parsed.horariosDisponiveis || {}
      );

    if (!dates.length) {
      return "Nenhuma data disponível.";
    }

    return (
      "📅 Datas disponíveis:\n\n" +
      dates.join("\n")
    );
  }

  return "Operação realizada.";
}