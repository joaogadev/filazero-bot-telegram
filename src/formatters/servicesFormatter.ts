// Formata os serviços disponíveis da empresa

export function formatServices(result: any): string {
  const services = result?.services;

  if (!services || services.length === 0) {
    return "Nenhum serviço disponível.";
  }

  let message = "Serviços disponíveis:\n\n";

  services.forEach((service: any, index: number) => {

    // Nome do serviço
    message += `${index + 1}. ${service.name}\n`;

    // Descrição opcional
    if (service.description) {
      message += `${service.description}\n`;
    }

    // Preço opcional
    if (service.price) {
      message += `R$ ${service.price}\n`;
    }

    message += "\n";
  });

  message += "Digite o serviço desejado.";

  return message;
}