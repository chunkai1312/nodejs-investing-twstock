import { Order } from '@fugle/trade';

export function getOrderSideName(side: string) {
  const names = {
    [Order.Side.Buy]: '買進',
    [Order.Side.Sell]: '賣出',
  }
  return names[side];
}

export function getOrderTypeName(bsFlag: string) {
  const names = {
    [Order.BsFlag.ROD]: 'ROD',
    [Order.BsFlag.IOC]: 'IOC',
    [Order.BsFlag.FOK]: 'FOK',
  }
  return names[bsFlag];
}

export function getPriceTypeName(priceFlag: string) {
  const names = {
    [Order.PriceFlag.Limit]: '限價',
    [Order.PriceFlag.Flat]: '平盤價',
    [Order.PriceFlag.LimitDown]: '跌停價',
    [Order.PriceFlag.LimitUp]: '漲停價',
    [Order.PriceFlag.Market]: '市價價',
  }
  return names[priceFlag];
}

export function getTradeTypeName(trade: string) {
  const names = {
    [Order.Trade.Cash]: '現股',
    [Order.Trade.Margin]: '融資',
    [Order.Trade.Short]: '融券',
    [Order.Trade.DayTradingSell]: '現股當沖賣',
  }
  return names[trade];
}
