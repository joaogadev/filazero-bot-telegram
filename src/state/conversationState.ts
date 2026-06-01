type ConversationState = {
  lastTool?: string;
  lastArguments?: any;
  lastResult?: any;
};

const conversations = new Map<number, ConversationState>();

export function getConversationState(chatId: number) {
  return conversations.get(chatId) || {};
}

export function updateConversationState(
  chatId: number,
  data: Partial<ConversationState>
) {

  const current = conversations.get(chatId) || {};

  conversations.set(chatId, {
    ...current,
    ...data
  });
}