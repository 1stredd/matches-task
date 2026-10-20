import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMatches, type MatchesLoader } from '../api/matchesApi';
import type { MatchesResponse } from '../domain/matches';

type MatchesState = {
  data: MatchesResponse | null;
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  lastUpdated: Date | null;
};

const REQUEST_TIMEOUT_MS = 15_000;

// Зависимость передается функцией: хук можно проверить без настоящего HTTP.
export function useMatches(load: MatchesLoader = fetchMatches) {
  const [state, setState] = useState<MatchesState>({
    data: null,
    error: null,
    isLoading: true,
    isRefreshing: false,
    lastUpdated: null,
  });
  const activeRequest = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    setState((previous) => ({
      ...previous,
      error: null,
      isLoading: previous.data === null,
      isRefreshing: previous.data !== null,
    }));

    try {
      const data = await load(controller.signal);
      if (activeRequest.current !== controller) return;
      if (timedOut) throw new Error('Время ожидания истекло.');
      if (controller.signal.aborted) return;
      setState({ data, error: null, isLoading: false, isRefreshing: false, lastUpdated: new Date() });
    } catch (error: unknown) {
      if (activeRequest.current !== controller) return;
      if (controller.signal.aborted && !timedOut) return;
      const message = timedOut
        ? 'Сервер долго не отвечает. Попробуйте еще раз.'
        : error instanceof Error && error.message
          ? error.message
          : 'Проверьте подключение к интернету и попробуйте еще раз.';
      // При ошибке обновления сохраняем данные и время последнего успеха.
      setState((previous) => ({ ...previous, error: message }));
    } finally {
      clearTimeout(timeout);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setState((previous) => ({ ...previous, isLoading: false, isRefreshing: false }));
      }
    }
  }, [load]);

  useEffect(() => {
    void refresh();
    return () => {
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [refresh]);

  return { ...state, refresh };
}
