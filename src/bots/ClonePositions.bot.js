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

      const orders = [];

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
        // console.log(position);

        const client = `${CLIENT_ID_PREFIX}${market || future}:${side}:${size}`;

        const order = {
          client,
          market: market || future,
          price: undefined,
          side,
          size,
          type: 'market',
          cost,
        };

        log.text(`Analizing position ${order.market}`);
        const storedPosition = store.find({ client });

        if (!storedPosition) {
          store.push(order);
          Telegram.message(
            `Position \`${side.toUpperCase()}\` ${size} \`${order.market}\` for ${getSymbol()}${Math.abs(
              order.cost,
            )} (_Entry price ${getSymbol()}${entryPrice}_)`,
            side === 'buy' ? '🟩 ' : '🟥',
          );
          orders.push(order);
        }
      });

      log.succeed(`${orders.length} positions copied correctly.`);
    } catch (error) {
      log.error(error ? error.message : 'Unknown error.');
      reject(error);
    }
  });
