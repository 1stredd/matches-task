import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { ActionButton } from './ActionButton';

type Props = { title: string; description: string; loading?: boolean; onRetry?: () => void };

export function StateMessage({ title, description, loading, onRetry }: Props) {
  return (
    <View style={styles.container} accessibilityRole={onRetry ? 'alert' : undefined}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          accessibilityLabel="Загрузка матчей"
        />
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {onRetry ? <ActionButton title="Повторить" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 48, paddingHorizontal: 20, gap: 16, alignItems: 'center' },
  title: { color: colors.text, fontSize: 20, fontWeight: '600', textAlign: 'center' },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 360,
  },
});
