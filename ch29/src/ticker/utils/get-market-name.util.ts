import { Market } from '../enums';

export function getMarketName(market: Market) {
  const markets = {
    [Market.TSE]: '上市',
    [Market.OTC]: '上櫃',
    [Market.ESB]: '興櫃一般板',
    [Market.TIB]: '臺灣創新板',
    [Market.PSB]: '興櫃戰略新板',
  }
  return markets[market];
}
