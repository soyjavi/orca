import { getSymbol, Log } from '@commons';
import { FTX } from '@repositories';

const NAME = '🤖 BuyBitoin';

const BuyBitcoin = ({ credentials = {}, fromCoin = 'USD', minValue = 100 } = {}) =>
  new Promise((resolve, reject) => {
    const log = new Log(NAME, 'Starting...');
    const walletName = `${fromCoin} wallet`;

    log.text(`Searching ${walletName}...`);
    const ftx = new FTX({ credentials });

    ftx
      .wallet()
      .then((wallets) => {
        const wallet = wallets.find((item) => item.coin === fromCoin);
        if (!wallet) throw new Error(`${walletName} not found.`);

        const { usdValue } = wallet;
        log.text(`${walletName} detected with ${getSymbol(fromCoin)}${usdValue.toFixed(2)}`);
        if (usdValue < minValue) throw new Error(`${walletName} without enough funds.`);

        return ftx.convert({ fromCoin, toCoin: 'BTC', size: usdValue });
      })
      .then((quote = {}) => {
        console.log(quote);
        log.text(`Quote ${quote.id} created successfully.`);
        return ftx.confirmConvert(quote.id);
      })
      .then((success) => {
        console.log(success);
        log.succeed(`Converted ${getSymbol(fromCoin)}${usd} to ${getSymbol('BTC')}${satoshis}.`);
      })
      .catch((error) => {
        log.error(error ? error.message : 'Unknown error.');
        reject(error);
      });
  });

export { BuyBitcoin };
