const connectionError = 'Проверьте подключение к интернету и попробуйте еще раз.';

export function getLoadErrorMessage(error: unknown): string {
  // fetch и JSON.parse выбрасывают системные ошибки с текстом на английском.
  if (error instanceof TypeError) return connectionError;
  if (error instanceof SyntaxError) return 'Сервер вернул некорректный JSON. Попробуйте еще раз.';
  if (error instanceof Error && error.message) return error.message;
  return connectionError;
}
