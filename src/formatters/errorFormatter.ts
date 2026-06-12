// Formata mensagens de erro para o usuário

export function formatError(error: unknown): string {

  // Erro conhecido do sistema
  if (error instanceof Error) {
    return `${error.message}`;
  }

  // Erro genérico
  return "Ocorreu um erro inesperado.";
}