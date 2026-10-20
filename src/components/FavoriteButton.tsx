import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = {
  active: boolean;
  onPress: () => void;
  matchLabel: string;
};

// Звёздочка «в избранное».
export function FavoriteButton({ active, onPress, matchLabel }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={4}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${active ? 'Убрать матч' : 'Добавить матч'} ${matchLabel} ${active ? 'из избранного' : 'в избранное'}`}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={[styles.star, active && styles.active]}>{active ? '★' : '☆'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  pressed: { backgroundColor: colors.accentSoft },
  star: {
    fontSize: 22,
    color: colors.muted,
  },
  active: {
    color: colors.accent,
  },
});
