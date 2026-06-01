// src/state/conversationState.ts

// representa uma empresa
type Company = {
  id: number;
  slug: string;
  name: string;
};

// representa um serviço
type Service = {
  id: number;
  name: string;
};

// estado da conversa
type ConversationState = {

  // controle do fluxo atual
  currentStep?: string;

  // empresa selecionada
  selectedCompany?: Company;

  // lista de empresas carregadas
  companies?: Company[];

  // serviço selecionado
  selectedService?: Service;

  // lista de serviços carregados
  services?: Service[];

  // dados técnicos/debug
  lastTool?: string;
  lastArguments?: unknown;
  lastResult?: unknown;
};

const conversations = new Map<number, ConversationState>();

// busca estado atual
export function getConversationState(chatId: number) {

  if (!conversations.has(chatId)) {
    conversations.set(chatId, {});
  }

  return conversations.get(chatId)!;
}

// atualiza parcialmente
export function updateConversationState(
  chatId: number,
  data: Partial<ConversationState>
) {

  const current = getConversationState(chatId);

  conversations.set(chatId, {
    ...current,
    ...data
  });
}

// limpa conversa
export function clearConversationState(chatId: number) {
  conversations.delete(chatId);
}