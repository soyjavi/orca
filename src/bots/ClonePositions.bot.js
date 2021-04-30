import { Storage } from 'vanilla-storage';

import { C, getSymbol, Log } from '@commons';
import { FTX, Telegram } from '@repositories';

const NAME = '🤖 ClonePositions';
const CLIENT_ID_PREFIX = `${C.NAME}@`;

const handleError = (error) => {
  throw new Error(error);
};

export const ClonePositions = ({ master = {}, branch = {} } = {}) =>
  new Promise(async (resolve, reject) => {
    try {
      const log = new Log(NAME);
      const masterFTX = new FTX(master);
      const branchFTX = new FTX(branch);

      log.text('Fetching opened positions...');
      const positions = await masterFTX.positions().catch(handleError);
      if (positions.length === 0) {
        // @TODO
        // await cancelOrders(branchFTX).catch(handleError);
        return log.info('No opened positions.');
      }

      log.text(`Found ${positions.length} openend positions, fetching branch...`);
      const branchAccount = await branchFTX.account();

      const store = new Storage(C.STORE.POSITIONS);

      positions.forEach((position) => {
        const {
          cost,
          size,
          netSize,
          market,
          future,
          side,
          openSize,
          entryPrice,
          recentAverageOpenPrice: averagePrice,
        } = position;

        const order = {
          client: `${CLIENT_ID_PREFIX}${market || future}@`,
          market: market || future,
          price: null,
          side,
          size,
          type: 'market',
          cost,
        };

        log.text(`Analizing position ${order.market}`);

        const storedPosition = store.find({
          market: order.market,
          size: order.size,
          cost: order.cost,
        });

        if (!storedPosition) {
          store.push(order);
          Telegram.message(
            `NEW POSITION: ${order.market} size ${order.size} for ${order.cost} (entryPrice ${newPosition.entryPrice})`,
          );
        }

        console.log(position);
      });
    } catch (error) {
      log.error(error ? error.message : 'Unknown error.');
      reject(error);
    }

    // console.log({ masterPositions });

    // const walletName = `${fromCoin} wallet`;

    // log.text(`Searching ${walletName}...`);
    // const ftx = new FTX({ credentials });

    // ftx
    //   .wallet()
    //   .then((wallets) => {
    //     const wallet = wallets.find((item) => item.coin === fromCoin);
    //     if (!wallet) throw new Error(`${walletName} not found.`);

    //     const { usdValue } = wallet;
    //     log.text(`${walletName} detected with ${getSymbol(fromCoin)}${usdValue.toFixed(2)}`);
    //     if (usdValue < minValue) throw new Error(`${walletName} without enough funds.`);

    //     return ftx.convert({ fromCoin, toCoin: 'BTC', size: usdValue });
    //   })
    //   .then((quote = {}) => {
    //     console.log(quote);
    //     log.text(`Quote ${quote.id} created successfully.`);
    //     return ftx.confirmConvert(quote.id);
    //   })
    //   .then((success) => {
    //     console.log(success);
    //     log.succeed(`Converted ${getSymbol(fromCoin)}${usd} to ${getSymbol('BTC')}${satoshis}.`);
    //     resolve(true);
    //   })
    //   .catch((error) => {
    //     log.error(error ? error.message : 'Unknown error.');
    //     reject(error);
    //   });
  });
