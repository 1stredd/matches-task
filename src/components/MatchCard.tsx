import { StyleSheet, Text, View } from 'react-native';
import { getStatusLabel, type Match, type Team } from '../domain/matches';
import { formatMatchDate } from '../domain/formatMatchDate';
import { colors } from '../theme';
import { FavoriteButton } from './FavoriteButton';

type Props = { match: Match; favorite: boolean; onToggleFavorite: () => void };

function TeamRow({ team, score }: { team: Team; score: number | undefined }) {
  return (
    <View style={styles.teamRow}>
      <View style={styles.team}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.city}>{team.city}</Text>
      </View>
      <Text style={styles.score} accessibilityLabel={score === undefined ? 'Счет отсутствует' : `Счет: ${score}`}>
        {score ?? '—'}
      </Text>
    </View>
  );
}

export function MatchCard({ match, favorite, onToggleFavorite }: Props) {
  const live = match.status === 'live';
  return (
    <View style={[styles.card, live && styles.liveCard]} testID={`match-${match.id}`}>
      <View style={styles.top}>
        <Text style={styles.date}>{formatMatchDate(match.startsAt)}</Text>
        <FavoriteButton active={favorite} onPress={onToggleFavorite} />
      </View>
      <View style={styles.teams}>
        <TeamRow team={match.home} score={match.score?.home} />
        <TeamRow team={match.away} score={match.score?.away} />
      </View>
      <Text style={[styles.status, live && styles.liveStatus,
        match.status === 'postponed' && styles.postponed]}>{getStatusLabel(match)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, padding: 20, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  liveCard: { borderLeftWidth: 4, borderLeftColor: colors.accent },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 },
  date: { color: colors.muted, fontSize: 13, lineHeight: 20, flex: 1 },
  teams: { gap: 16 }, teamRow: { flexDirection: 'row', alignItems: 'center', gap: 16 }, team: { flex: 1 },
  teamName: { color: colors.text, fontSize: 18, lineHeight: 24, fontWeight: '600' },
  city: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 2 },
  score: { color: colors.text, fontSize: 26, fontWeight: '700', minWidth: 32, textAlign: 'center', fontVariant: ['tabular-nums'] },
  status: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 20, alignSelf: 'flex-start' },
  liveStatus: { color: colors.accent, fontWeight: '700', backgroundColor: colors.accentSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  postponed: { color: colors.warning },
});
