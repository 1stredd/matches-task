import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { filterMatches, getStatusLabel } from '../src/domain/matches.ts';
import { formatMatchDate } from '../src/domain/formatMatchDate.ts';
import { elapsedSeconds } from '../src/domain/elapsedSeconds.ts';
import { parseMatchesResponse } from '../src/domain/parseMatchesResponse.ts';
import { getLoadErrorMessage } from '../src/api/getLoadErrorMessage.ts';

const fixture = JSON.parse(readFileSync(new URL('../data/matches.json', import.meta.url), 'utf8'));
const { matches } = fixture;

test('сетевая ошибка fetch объясняется по-русски', () => {
  assert.equal(
    getLoadErrorMessage(new TypeError('Failed to fetch')),
    'Проверьте подключение к интернету и попробуйте еще раз.',
  );
});

test('некорректный JSON дает понятное сообщение', () => {
  assert.equal(
    getLoadErrorMessage(new SyntaxError('Unexpected token')),
    'Сервер вернул некорректный JSON. Попробуйте еще раз.',
  );
});

test('сообщение HTTP сохраняется, неизвестная ошибка получает запасной текст', () => {
  assert.equal(getLoadErrorMessage(new Error('HTTP 503')), 'HTTP 503');
  assert.equal(
    getLoadErrorMessage(null),
    'Проверьте подключение к интернету и попробуйте еще раз.',
  );
});

test('«Все» сохраняет все 8 матчей, включая live и postponed', () => {
  assert.equal(filterMatches(matches, 'all').length, 8);
});

test('предстоящие включают scheduled и postponed без даты', () => {
  assert.deepEqual(
    filterMatches(matches, 'upcoming').map((match) => match.id),
    ['m5', 'm6', 'm7', 'm8'],
  );
});

test('завершенные определяются статусом, а не текущей датой', () => {
  assert.deepEqual(
    filterMatches(matches, 'finished').map((match) => match.id),
    ['m1', 'm2', 'm3'],
  );
});

test('фильтрация не изменяет исходные данные', () => {
  const before = structuredClone(matches);
  filterMatches(matches, 'upcoming');
  assert.deepEqual(matches, before);
});

test('счет 0:0 и null сохраняются при проверке JSON', () => {
  const parsed = parseMatchesResponse(fixture);
  assert.deepEqual(parsed.matches[1].score, { home: 0, away: 0 });
  assert.equal(parsed.matches[6].score, null);
  assert.equal(parsed.matches[6].startsAt, null);
});

test('неизвестный статус не скрывает матч из «Все»', () => {
  const match = { ...matches[0], status: 'cancelled' };
  assert.equal(filterMatches([match], 'all').length, 1);
  assert.equal(filterMatches([match], 'upcoming').length, 0);
  assert.equal(filterMatches([match], 'finished').length, 0);
  assert.equal(getStatusLabel(match), 'Статус уточняется');
});

test('нулевая минута live отображается, отсутствие минуты не дает undefined', () => {
  assert.equal(getStatusLabel({ ...matches[3], minute: 0 }), 'Идет матч · 0 мин');
  assert.equal(getStatusLabel({ ...matches[3], minute: undefined }), 'Идет матч');
});

test('null и неверная дата не превращаются в 1970 год или Invalid Date', () => {
  assert.equal(formatMatchDate(null), 'Дата уточняется');
  assert.equal(formatMatchDate('bad date'), 'Дата уточняется');
});

test('дата форматируется в часовом поясе устройства', () => {
  const previousTimezone = process.env.TZ;
  try {
    process.env.TZ = 'Asia/Yekaterinburg';
    assert.match(formatMatchDate('2026-10-11T13:00:00Z'), /18:00/);
    process.env.TZ = 'America/New_York';
    assert.match(formatMatchDate('2026-10-11T13:00:00Z'), /09:00/);
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});

test('пустой массив матчей — корректный ответ', () => {
  assert.deepEqual(parseMatchesResponse({ round: 12, matches: [] }), { round: 12, matches: [] });
});

test('неверная структура и дубли id дают ошибку вместо сломанного списка', () => {
  assert.throws(() => parseMatchesResponse({ matches: null }));
  assert.throws(
    () => parseMatchesResponse({ round: 12, matches: [matches[0], matches[0]] }),
    /повторяются/,
  );
  assert.throws(() =>
    parseMatchesResponse({ round: 12, matches: [{ ...matches[0], score: { home: -1, away: 0 } }] }),
  );
});

test('таймер учитывает реальную паузу, округляет секунды и сбрасывается с новым since', () => {
  assert.equal(elapsedSeconds(1_000, 3_999), 2);
  assert.equal(elapsedSeconds(1_000, 121_000), 120);
  assert.equal(elapsedSeconds(122_000, 121_000), 0);
  assert.equal(elapsedSeconds(121_000, 121_000), 0);
});
