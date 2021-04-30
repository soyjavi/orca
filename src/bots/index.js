import { BuyBitcoin } from './BuyBitcoin.bot';
import { CloneOrders } from './CloneOrders.bot';
import { ClonePositions } from './ClonePositions.bot';

const MINUTE = 60000;
const HOUR = MINUTE * 60;

export const Bots = {
  start: () => {
    // BuyBitcoin();
    // BuyBitcoin({ fromCoin: 'XRP', minValue: 1000 });
    ClonePositions();
    // CloneOrders();

    // -- Intervals
    // setInterval(BuyBitcoin, HOUR);
    setInterval(ClonePositions, MINUTE);
    // setInterval(CloneOrders, MINUTE);
  },
};
