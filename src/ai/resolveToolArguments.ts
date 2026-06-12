import { resolveCompany } from "../resolvers/companyResolver.js";
import { resolveService } from "../resolvers/serviceResolver.js";
import { updateConversationState } from "../state/conversationState.js";

export async function resolveToolArguments(
  tool: string,
  args: any,
  state: any,
  mcp: any,
  chatId: number
) {

  const safeArgs = args || {};

  if (tool === "list_companies") {
    return {};
  }

  let companies =
    state.companies || [];

  if (!companies.length) {

    const companyResult =
      await mcp.callTool(
        "list_companies",
        {}
      );

    const rawText =
      companyResult.result.content[0].text;

    const parsed =
      JSON.parse(rawText);

    companies =
      parsed.companies || [];

    updateConversationState(
      chatId,
      { companies }
    );
  }

  if (tool === "get_company_services") {

    const company =
      resolveCompany(
        companies,
        safeArgs.companyId ||
        safeArgs.company_name ||
        safeArgs.companyName ||
        safeArgs.slug
      );

    if (!company) {
      throw new Error(
        "Empresa não encontrada"
      );
    }

    return {
      slug: company.slug
    };
  }

  if (tool === "get_available_dates") {

    const service =
      resolveService(
        state.services || [],
        safeArgs.serviceId ||
        safeArgs.service_name ||
        safeArgs.serviceName
      );

    if (!service) {
      throw new Error(
        "Serviço não encontrado"
      );
    }

    return {
      slug:
        state.selectedCompany,

      serviceId:
        service.id
    };
  }

  if (tool === "get_available_sessions") {

    console.log("STATE:");
    console.log(JSON.stringify(state, null, 2));

    console.log("SAFE ARGS:");
    console.log(JSON.stringify(safeArgs, null, 2));

    return {

      slug:
        state.selectedCompany,

      serviceId:
        state.selectedService?.id,

      locationId:
        state.selectedLocation,

      date:
        safeArgs.date ||
        state.selectedDate
    };
  }

  if (tool === "get_booking_form") {

    return {

      slug:
        state.selectedCompany,

      serviceId:
        state.selectedService?.id
    };
  }

  if (tool === "schedule_appointment") {

    return {

      slug:
        state.selectedCompany,

      serviceId:
        state.selectedService?.id,

      date:
        state.selectedDate,

      hour:
        state.selectedHour,

      ...safeArgs
    };
  }

  if (tool === "check_ticket_status") {

    return {

      ticketNumber:
        safeArgs.ticketNumber ||
        state.ticketNumber
    };
  }

  return safeArgs;
}