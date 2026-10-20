export function elapsedSeconds(since: number, now: number): number {
  return Math.max(0, Math.floor((now - since) / 1000));
}
