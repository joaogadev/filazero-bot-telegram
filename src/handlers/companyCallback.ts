import {
  updateConversationState
} from "../state/conversationState.js";

import {
  renderServices
} from "../renderers/serviceRenderer.js";


// callback da empresa
export async function handleCompanyCallback({
  query,
  bot,
  mcp
}: any) {

  const chatId =
    query.message.chat.id;

  const data =
    query.data;

  const slug =
    data.split(":")[1];

  updateConversationState(chatId, {
    selectedCompany: slug
  });

  const result =
    await mcp.callTool(
      "get_company_services",
      { slug }
    );

  await renderServices(
    bot,
    chatId,
    result
  );
}