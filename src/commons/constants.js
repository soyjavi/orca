import { name as NAME, version as VERSION } from '../../package.json';

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
};
