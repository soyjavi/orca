import { C, Log } from '@commons';
import { FTX } from '@repositories';

import { cancelOrders } from './modules';

const NAME = '🤖 CloneOrders';
const CLIENT_ID_PREFIX = `${C.NAME}@`;

const handleError = (error) => {
  throw new Error(error);
};

export const CloneOrders = ({ master = {}, credentials = {} } = {}) =>
  new Promise(async (resolve, reject) => {
    try {
      const log = new Log(NAME);
      const masterFTX = new FTX(master.credentials);
      const branchFTX = new FTX(credentials);

      log.text('Fetching active orders...');
      const orders = await masterFTX.orders().catch(handleError);
      if (orders.length === 0) {
        await cancelOrders(branchFTX).catch(handleError);
        return log.info('No opened orders.');
      }

      log.text(`Found ${orders.length} active orders, fetching branch orders...`);
      const branchOrders = await branchFTX.orders().catch(handleError);
      const clonedOrders = branchOrders
        .filter(({ clientId }) => clientId !== undefined && clientId !== null)
        .map(({ clientId }) => clientId.replace(CLIENT_ID_PREFIX, ''));

      if (clonedOrders.length === orders.length) return log.info('All branch orders are synced.');

      const promises = orders
        .filter(({ id }) => !clonedOrders.includes(id.toString()))
        .map((order, index) => {
          const { id, market, price, side, size, type } = order;

          return new Promise((resolve, reject) => {
            setTimeout(() => {
              log.text(`Cloning order #${id} (${side} ${market} ${size} ${type})`);
              branchFTX
                .order({ clientId: `${CLIENT_ID_PREFIX}${id}`, market, price, side, size, type })
                .then(resolve)
                .catch(reject);
            }, index * 200);
          });
        });

      Promise.all(promises)
        .then((results) => {
          log.succeed(`${results.length} orders cloned correctly.`);
          resolve(true);
        })
        .catch((error) => {
          log.error(error ? error.message : 'Unknown error.');
          reject(error);
        });
    } catch (error) {
      log.error(error ? error.message : 'Unknown error.');
      reject(error);
    }
  });
