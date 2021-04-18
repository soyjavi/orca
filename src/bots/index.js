import { BuyBitcoin } from './BuyBitcoin.bot';
import { CloneOrders } from './CloneOrders.bot';
import { ClonePositions } from './ClonePositions.bot';

export const Bots = {
  start: () => {
    BuyBitcoin();
    BuyBitcoin({ fromCoin: 'XRP', minValue: 1000 });

    ClonePositions();

    CloneOrders();
  },
};
