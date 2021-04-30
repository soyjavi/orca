import dotenv from 'dotenv';

import { name as NAME, version as VERSION } from '../../package.json';

dotenv.config();
const { SECRET } = process.env;

export const C = {
  NAME,
  VERSION,
  INSTANCE: `🦈 ${NAME} v${VERSION}`,

  SYMBOL: {
    // CRYPTO
    BTC: '₿',
    ETH: 'Ξ',

    // FIAT
    USD: '$',
  },

  STORE: {
    MESSAGES: { filename: 'messages' },
    POSITIONS: { filename: 'positions', secret: SECRET },
    ORDERS: { filename: 'orders', secret: SECRET },
  },
};
