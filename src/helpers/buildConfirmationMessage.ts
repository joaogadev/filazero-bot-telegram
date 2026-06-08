export function buildConfirmationMessage(
  state: any
) {

  return (
    `📌 Confirmação\n\n` +

    `🏢 Empresa: ${state.selectedCompanyName}\n` +

    `🛠 Serviço: ${state.selectedServiceName}\n` +

    `📍 Unidade: ${state.selectedLocationName}\n` +

    `📅 Data: ${state.selectedDate}\n` +

    `🕒 Hora: ${state.selectedHour}\n\n` +

    `👤 Nome: ${state.customerName}\n` +

    `📱 Telefone: ${state.customerPhone}`
  );
}