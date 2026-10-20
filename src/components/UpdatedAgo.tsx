import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { elapsedSeconds } from '../domain/elapsedSeconds';
import { colors } from '../theme';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Отсчет зависит от since, поэтому новая успешная загрузка сразу его сбросит.
  // Реальное время также учитывает паузы таймеров в фоновой вкладке.
  const seconds = elapsedSeconds(since.getTime(), now);
  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: colors.muted,
    fontVariant: ['tabular-nums'],
  },
});
