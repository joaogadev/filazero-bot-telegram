// src/mcp/MCPClient.ts

export class MCPClient {

  // guarda o id da sessão MCP
  private sessionId: string | null = null;

  // URL do seu MCP
  private baseUrl = process.env.MCP_URL!;

  /*
    Inicializa conexão MCP

    Isso é obrigatório no protocolo MCP HTTP.
    Sem isso o servidor retorna:
    "Server not initialized"
  */
  async initialize() {

    // evita inicializar várias vezes
    if (this.sessionId) {
      return;
    }

    console.log("Inicializando sessão MCP...");

    const response = await fetch(this.baseUrl, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream"
      },

      body: JSON.stringify({

        jsonrpc: "2.0",

        id: 1,

        method: "initialize",

        params: {

          protocolVersion: "2025-03-26",

          capabilities: {},

          clientInfo: {
            name: "telegram-bot",
            version: "1.0.0"
          }
        }
      })
    });

    // pega session id retornado pelo MCP
    const sessionId =
      response.headers.get("mcp-session-id");

    if (!sessionId) {
      throw new Error(
        "Servidor MCP não retornou session id"
      );
    }

    this.sessionId = sessionId;

    console.log(
      "Sessão MCP criada:",
      this.sessionId
    );
  }

  /*
    Chama qualquer tool do MCP
  */
  async callTool(
    tool: string,
    args: any = {}
  ) {

    // garante inicialização
    if (!this.sessionId) {
      await this.initialize();
    }

    console.log(
      `Chamando tool: ${tool}`
    );

    const response = await fetch(this.baseUrl, {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        "Accept":
          "application/json, text/event-stream",

        // HEADER MAIS IMPORTANTE
        "mcp-session-id":
          this.sessionId!
      },

      body: JSON.stringify({

        jsonrpc: "2.0",

        id: 2,

        method: "tools/call",

        params: {

          name: tool,

          // agora envia argumentos corretamente
          arguments: args
        }
      })
    });

    const text = await response.text();

    console.log("RESPOSTA MCP:");
    console.log(text);

    /*
    MCP HTTP retorna SSE:
    
    event: message
    data: {...json...}
    */

    const dataLine = text
    .split("\n")
    .find(line => line.startsWith("data:"));

    if (!dataLine) {
    throw new Error(
        "Resposta MCP inválida"
    );
    }

    // remove "data: "
    const jsonString =
    dataLine.replace("data:", "").trim();

    const data = JSON.parse(jsonString);

    return data;
  }
}