export function getFontColorByNetChange(netChange: number) {
  if (netChange > 0) return 'b71c1c';
  if (netChange < 0) return '1b5e20';
  return '000000';
}
