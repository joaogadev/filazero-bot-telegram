export function resolveService(
  services: any[],
  value: any
) {

  if (!services?.length || !value) {
    return null;
  }

  // busca por id
  const byId = services.find(
    (service) =>
      String(service.id) === String(value)
  );

  if (byId) {
    return byId;
  }

  const normalizedInput =
    String(value)
      .toLowerCase()
      .trim();

  // match exato
  const exactMatch =
    services.find(
      (service) =>
        service.name
          .toLowerCase()
          .trim() === normalizedInput
    );

  if (exactMatch) {
    return exactMatch;
  }

  // serviço contém frase do usuário
  const containsUserText =
    services.find(
      (service) =>
        service.name
          .toLowerCase()
          .includes(normalizedInput)
    );

  if (containsUserText) {
    return containsUserText;
  }

  // frase do usuário contém serviço
  const userContainsService =
    services.find(
      (service) =>
        normalizedInput.includes(
          service.name.toLowerCase()
        )
    );

  if (userContainsService) {
    return userContainsService;
  }

  // busca por palavras
  const inputWords =
    normalizedInput.split(" ");

  const bestMatch =
    services.find(
      (service) => {

        const serviceName =
          service.name.toLowerCase();

        return inputWords.some(
          word =>
            word.length > 2 &&
            serviceName.includes(word)
        );
      }
    );

  if (bestMatch) {
    return bestMatch;
  }

  return null;
}