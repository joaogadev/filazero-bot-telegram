import {
  renderCompanies
} from "../renderers/companyRenderer.js";

import {
  renderServices
} from "../renderers/serviceRenderer.js";


export async function handleToolResponse({
  bot,
  chatId,
  tool,
  result
}: any) {

  if (tool === "list_companies") {

    await renderCompanies(
      bot,
      chatId,
      result
    );

    return;
  }

  if (tool === "get_company_services") {

    await renderServices(
      bot,
      chatId,
      result
    );

    return;
  }

  // fallback
  await bot.sendMessage(
    chatId,
    "Tool executada."
  );
}