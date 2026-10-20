import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '../components/ActionButton';
import { MatchCard } from '../components/MatchCard';
import { MatchFilters } from '../components/MatchFilters';
import { StateMessage } from '../components/StateMessage';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { filterMatches, type MatchFilter } from '../domain/matches';
import { useFavorites } from '../hooks/useFavorites';
import { useMatches } from '../hooks/useMatches';
import { colors } from '../theme';

export function MatchesScreen() {
  const { data, error, isLoading, isRefreshing, lastUpdated, refresh } = useMatches();
  const { favorites, isFavorite, toggle } = useFavorites();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const visibleMatches = filterMatches(data?.matches ?? [], filter);
  const retry = () => { void refresh(); };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>ФУТБОЛ{data ? ` / ТУР ${data.round}` : ''}</Text>
        <Text accessibilityRole="header" style={styles.title}>Матчи тура</Text>
        <Text style={styles.subtitle}>Расписание, результаты и ваши избранные матчи.</Text>
      </View>
      <View style={styles.toolbar}>
        <View style={styles.updated}>
          {lastUpdated ? <UpdatedAgo since={lastUpdated} /> : <Text style={styles.hint}>Ожидаем данные</Text>}
        </View>
        <ActionButton title={isRefreshing ? 'Обновляем…' : 'Обновить'} onPress={retry}
          disabled={isLoading || isRefreshing} />
      </View>
      <MatchFilters selected={filter} onChange={setFilter} />
      <Text style={styles.hint}>Время начала — в часовом поясе вашего устройства</Text>

      {isLoading ? (
        <StateMessage loading title="Загружаем матчи" description="Сейчас получим расписание и результаты." />
      ) : !data && error ? (
        <StateMessage title="Не удалось загрузить матчи" description={error} onRetry={retry} />
      ) : (
        <>
          {error ? (
            <View style={styles.error} accessibilityRole="alert">
              <Text style={styles.errorText}>Не удалось обновить данные. Показан предыдущий результат. {error}</Text>
              <ActionButton title="Повторить" onPress={retry} disabled={isRefreshing} />
            </View>
          ) : null}
          <FlatList data={visibleMatches} extraData={favorites} keyExtractor={(match) => match.id}
            renderItem={({ item }) => <MatchCard match={item} favorite={isFavorite(item.id)} onToggleFavorite={() => toggle(item.id)} />}
            contentContainerStyle={styles.list} refreshing={isRefreshing} onRefresh={retry}
            ListHeaderComponent={data && data.matches.length > 0
              ? <Text style={styles.count}>Показано {visibleMatches.length} из {data.matches.length}</Text> : null}
            ListEmptyComponent={<StateMessage
              title={data?.matches.length ? 'Таких матчей пока нет' : 'Матчи пока не добавлены'}
              description={data?.matches.length ? 'Выберите другой фильтр, чтобы посмотреть остальные матчи.' : 'Обновите список позже — здесь появится расписание тура.'} />}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 20 },
  header: { paddingTop: 28, paddingBottom: 24, gap: 10 },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 34, fontWeight: '700', letterSpacing: -1 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  toolbar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  updated: { flexShrink: 1 },
  hint: { color: colors.muted, fontSize: 12, lineHeight: 18, marginVertical: 12 },
  list: { paddingTop: 4, paddingBottom: 24, gap: 12 },
  count: { color: colors.muted, fontSize: 12, marginBottom: 4 },
  error: { backgroundColor: colors.dangerSoft, borderRadius: 8, padding: 16, gap: 12, marginVertical: 12 },
  errorText: { color: colors.danger, fontSize: 14, lineHeight: 22 },
});
