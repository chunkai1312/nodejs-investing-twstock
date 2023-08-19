import { SmaCrossStrategy } from './sma-cross.strategy';

export class StrategyFactory {
  public static create(strategy: string) {
    switch (strategy) {
      case 'sma-cross': return SmaCrossStrategy;
      default: return null;
    }
  }
}
