type UserState = {
  companySlug?: string;
  serviceId?: number;
};

const userStates = new Map<number, UserState>();

export function getUserState(chatId: number) {
  return userStates.get(chatId);
}

export function setUserState(chatId: number, state: UserState) {
  userStates.set(chatId, state);
}