# Запуск и разбор проекта

## Запуск дома

Нужен Node.js 22.13+ (требование Expo SDK 57; Node.js 24 подходит). Откройте терминал в папке с `package.json`:

```bash
npm install
npm run web
```

Для телефона: `npm start`, затем открыть проект в Expo Go. Физическое устройство при подготовке не проверялось.

## Проверки

```bash
npm run typecheck
npm run lint
npm test
```

Тесты запускаются встроенным Node.js runner. Предупреждение Node о распознавании TS-файлов как ES-модулей не является падением тестов.

## Как читать код

1. `src/domain/matches.ts` — модель данных, фильтрация, подписи статусов.
2. `src/domain/parseMatchesResponse.ts` — проверка неизвестного JSON.
3. `src/api/matchesApi.ts` — HTTP-загрузчик с AbortSignal.
4. `src/hooks/useMatches.ts` — первоначальная загрузка, обновление, ошибки, отмена и тайм-аут.
5. `src/hooks/useFavorites.ts` — неизменяемое обновление избранного.
6. `src/components/UpdatedAgo.tsx` — таймер без устаревшего замыкания.
7. `src/screens/MatchesScreen.tsx` — сборка компонентов экрана.

## История

В архиве сохранена папка `.git` с исходным коммитом и отдельными коммитами реализации. Даты настоящие; изменения делались последовательно. Посмотреть историю:

```bash
git log --date=local --format="%h %ad %s"
```

Резервная копия истории — файл `matches-task-history.bundle` рядом с папкой проекта. Если распаковщик потерял `.git`, восстановить проект можно командой из папки с bundle:

```bash
git clone matches-task-history.bundle matches-restored
```

## Публичный репозиторий

Решение опубликовано: https://github.com/1stredd/matches-task

Семь коммитов разработки перенесены без изменения дат и хешей. Для получения проекта с GitHub:

```bash
git clone https://github.com/1stredd/matches-task.git
cd matches-task
npm install
npm run web
```

Для сдачи отправляется ссылка на репозиторий. Объяснения находятся в `SOLUTION.md`, результаты повторной проверки — в `VERIFICATION.md`.
