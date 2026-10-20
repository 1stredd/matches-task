export type Team = {
  id: string;
  name: string;
  city: string;
};

export type Match = {
  id: string;
  startsAt: string | null;
  // Неизвестный статус тоже сохраняем: матч не должен исчезнуть из «Все».
  status: string;
  minute?: number;
  home: Team;
  away: Team;
  score: { home: number; away: number } | null;
};

export type MatchesResponse = { round: number; matches: Match[] };
export type MatchFilter = 'all' | 'upcoming' | 'finished';

export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'all') return matches;
  if (filter === 'finished') return matches.filter((match) => match.status === 'finished');
  return matches.filter((match) => match.status === 'scheduled' || match.status === 'postponed');
}

export function getStatusLabel(match: Match): string {
  switch (match.status) {
    case 'finished':
      return 'Завершен';
    case 'scheduled':
      return 'Предстоящий';
    case 'postponed':
      return 'Перенесен';
    case 'live':
      return match.minute === undefined ? 'Идет матч' : `Идет матч · ${match.minute} мин`;
    default:
      return 'Статус уточняется';
  }
}
