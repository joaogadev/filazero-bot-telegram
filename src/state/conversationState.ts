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

  // controle da conversa
  currentStep?: string;

  // histórico
  lastTool?: string;
  lastArguments?: any;
  lastResult?: any;

  // empresas
  companies?: any[];
  selectedCompany?: any;

  // serviços
  services?: any[];
  selectedService?: any;

  // unidades
  businessUnits?: any[];
  selectedLocation?: any;

  // datas
  dates?: any[];
  selectedDate?: any;

  // sessões
  sessions?: any[];
  selectedSession?: any;

  // formulário
  formFields?: any[];

  // ticket emitido
  ticket?: any;

  // status ticket
  ticketStatus?: any;

  // tickets usuário
  myTickets?: any[];

  // horários disponíveis para a data escolhida
  availableHours?: any;
  selectedHour?: string;

  selectedCompanyName?: string;
  selectedServiceName?: string;
  selectedLocationName?: string;

  customerName?: string;
  customerPhone?: string;
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