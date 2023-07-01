export function getSectorName(name: string) {
  const indices = ['發行量加權股價指數', '未含金融保險股指數', '未含電子股指數', '未含金融電子股指數', '櫃買指數'];
  return !indices.includes(name) ? name.replace('櫃買', '').replace('類指數', '') : name;
}
