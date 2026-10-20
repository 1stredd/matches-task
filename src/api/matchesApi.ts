import { MATCHES_URL } from '../config';
import type { Match, MatchesResponse, Team } from '../domain/matches';

export type MatchesLoader = (signal: AbortSignal) => Promise<MatchesResponse>;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isTeam(value: unknown): value is Team {
  return isObject(value) && isText(value.id) && isText(value.name) && isText(value.city);
}

function isMatch(value: unknown): value is Match {
  if (!isObject(value)) return false;
  const validDate = value.startsAt === null ||
    (isText(value.startsAt) && Number.isFinite(Date.parse(value.startsAt)));
  const validScore = value.score === null ||
    (isObject(value.score) && isCount(value.score.home) && isCount(value.score.away));

  return isText(value.id) && isText(value.status) && validDate && validScore &&
    isTeam(value.home) && isTeam(value.away) &&
    (value.minute === undefined || isCount(value.minute));
}

// Типы TypeScript не проверяют JSON, пришедший по сети.
export function parseMatchesResponse(value: unknown): MatchesResponse {
  if (!isObject(value) || !isCount(value.round) || !Array.isArray(value.matches) ||
      !value.matches.every(isMatch)) {
    throw new Error('Сервер вернул некорректные данные матчей.');
  }
  const matches = value.matches;
  if (new Set(matches.map((match) => match.id)).size !== matches.length) {
    throw new Error('В данных повторяются идентификаторы матчей.');
  }
  return { round: value.round, matches };
}

export const fetchMatches: MatchesLoader = async (signal) => {
  const response = await fetch(MATCHES_URL, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Не удалось загрузить матчи (HTTP ${response.status}).`);
  const body: unknown = await response.json();
  return parseMatchesResponse(body);
};
