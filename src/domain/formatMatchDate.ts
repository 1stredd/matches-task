// Без timeZone: Intl использует часовой пояс устройства, а не UTC сервера.
export function formatMatchDate(startsAt: string | null): string {
  if (startsAt === null) return 'Дата уточняется';
  const date = new Date(startsAt);
  if (!Number.isFinite(date.getTime())) return 'Дата уточняется';
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}
