export async function callMCPTool(
  tool: string,
  args: any = {}
) {

  const response = await fetch(
    process.env.MCP_URL!,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
      },

      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: tool,
          arguments: {}
,        }
      })
    }
  );
  const data = await response.text();

  return data;
}