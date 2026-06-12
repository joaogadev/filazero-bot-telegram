import { handleCompanyCallback }
  from "./companyCallback.js";

import { handleServiceCallback }
  from "./serviceCallback.js";


export async function handleCallback({
  query,
  bot,
  mcp
}: any) {

  const data =
    query.data || "";

  if (
    data.startsWith("company:")
  ) {

    await handleCompanyCallback({
      query,
      bot,
      mcp
    });

    return;
  }

  if (
    data.startsWith("service:")
  ) {

    await handleServiceCallback({
      query,
      bot,
      mcp
    });

    return;
  }
}