import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Props = { title: string; onPress: () => void; disabled?: boolean };

export function ActionButton({ title, onPress, disabled = false }: Props) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.surface, fontSize: 14, fontWeight: '600' },
  pressed: { opacity: 0.8 }, disabled: { opacity: 0.6 },
});
