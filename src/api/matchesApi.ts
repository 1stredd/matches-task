import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../domain/matches';
import { parseMatchesResponse } from '../domain/parseMatchesResponse';

export type MatchesLoader = (signal: AbortSignal) => Promise<MatchesResponse>;

export const fetchMatches: MatchesLoader = async (signal) => {
  const response = await fetch(MATCHES_URL, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error(`Не удалось загрузить матчи (HTTP ${response.status}).`);
  const body: unknown = await response.json();
  return parseMatchesResponse(body);
};
