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

  switch (tool) {

    case "list_companies":
      return formatCompanies(result);

    case "get_company_services":
      return formatServices(result);

    case "get_available_dates":
      return formatAvailableDates(result);

    case "get_available_sessions":
      return formatSessions(result);

    case "schedule_appointment":
      return formatBooking(result);

    case "check_ticket_status":
      return formatMyTickets(result);

    case "list_my_tickets":
      return formatTicketStatus(result);

    default:
      return "Não consegui processar a resposta.";
  }
}