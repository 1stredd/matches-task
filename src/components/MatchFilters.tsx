import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MatchFilter } from '../domain/matches';
import { colors } from '../theme';

const filters: { value: MatchFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'upcoming', label: 'Предстоящие' },
  { value: 'finished', label: 'Завершенные' },
];

type Props = { selected: MatchFilter; onChange: (filter: MatchFilter) => void };

export function MatchFilters({ selected, onChange }: Props) {
  return (
    <View accessibilityRole="tablist" accessibilityLabel="Фильтр матчей" style={styles.filters}>
      {filters.map(({ value, label }) => (
        <Pressable
          key={value}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === selected }}
          onPress={() => onChange(value)}
          style={({ pressed }) => [
            styles.tab,
            value === selected && styles.selected,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.label, value === selected && styles.selectedLabel]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
  },
  selected: { borderBottomColor: colors.accent },
  label: { fontSize: 14, color: colors.muted, fontWeight: '500' },
  selectedLabel: { color: colors.accent, fontWeight: '700' },
  pressed: { backgroundColor: colors.accentSoft },
});
