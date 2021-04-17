import { Router } from 'express';

import { FTX } from '@repositories';
import { props } from '@middlewares';

const RouterFTX = Router();

// -----------------------------------------------------------------------------
// -- Dashboard
// -----------------------------------------------------------------------------
RouterFTX.get('/', async (request, response) =>
  new FTX()
    .account()
    .then((account) => response.json(account))
    .catch((error) => response.json({ error })),
);

RouterFTX.get('/wallet', async (request, response) =>
  new FTX()
    .wallet()
    .then((account) => response.json(account))
    .catch((error) => response.json({ error })),
);

// -----------------------------------------------------------------------------
// -- deposit
// -----------------------------------------------------------------------------
RouterFTX.get('/wallet/deposits', (request, response) =>
  new FTX()
    .deposits()
    .then((deposits = []) => response.json({ deposits }))
    .catch((error) => response.json({ error })),
);

RouterFTX.get('/wallet/:coin/deposit', props, ({ props: { coin } }, response) =>
  new FTX()
    .deposit(coin)
    .then((address = {}) => response.json(address))
    .catch((error) => response.json({ error })),
);

// -----------------------------------------------------------------------------
// -- withdrawal
// -----------------------------------------------------------------------------
RouterFTX.get('/wallet/:coin/withdrawal/fee', props, ({ props: { coin, address, size } }, response) =>
  new FTX()
    .withdrawalFee({ coin, address, size })
    .then((fee = {}) => response.json(fee))
    .catch((error) => response.json({ error })),
);

RouterFTX.post('/wallet/:coin/withdrawal', props, ({ props: { coin, address, size, tag, password, code } }, response) =>
  new FTX({ credentials: { password, code } })
    .withdrawal({ coin, address, size, tag })
    .then((withdrawal = {}) => response.json(withdrawal))
    .catch((error) => response.json({ error })),
);

RouterFTX.get('/wallet/withdrawals', (request, response) => {
  new FTX()
    .withdrawals()
    .then((withdrawals = []) => response.json({ withdrawals }))
    .catch((error) => response.json({ error }));
});

RouterFTX.get('/wallet/withdrawal/addresses', (request, response) =>
  new FTX()
    .withdrawalAddresses()
    .then((addresses = []) => response.json({ addresses }))
    .catch((error) => response.json({ error })),
);

RouterFTX.post(
  '/wallet/withdrawal/address',
  props,
  ({ props: { coin, address, addressName, isPrimetrust, tag, password, code } }, response) =>
    new FTX({ credentials: { password, code } })
      .createWithdrawalAddress({
        coin,
        address,
        addressName,
        isPrimetrust,
        tag,
      })
      .then((address = {}) => response.json(address))
      .catch((error) => response.json({ error })),
);

RouterFTX.delete('/wallet/withdrawal/address/:id', props, ({ props: { id } }, response) =>
  new FTX()
    .removeWithdrawalAddress(id)
    .then((message) => response.json({ message }))
    .catch((error) => response.json({ error })),
);

RouterFTX.get('/wallet/coins', (request, response) =>
  new FTX()
    .coins()
    .then((coins = []) => response.json({ coins }))
    .catch((error) => response.json({ error })),
);

// -----------------------------------------------------------------------------
// -- order
// -----------------------------------------------------------------------------
RouterFTX.get('/positions', (request, response) =>
  new FTX()
    .positions()
    .then((positions = []) => response.json({ positions }))
    .catch((error) => response.json({ error })),
);

RouterFTX.get('/orders', (request, response) =>
  new FTX()
    .orders()
    .then((orders = []) => response.json({ orders }))
    .catch((error) => response.json({ error })),
);

RouterFTX.post(
  '/order',
  props,
  ({ props: { market, side, price, type, size, reduceOnly, ioc, postOnly, clientId } }, response) =>
    new FTX()
      .order({ market, side, price, type, size, reduceOnly, ioc, postOnly, clientId })
      .then((order = {}) => response.json(order))
      .catch((error) => response.json({ error })),
);

RouterFTX.put('/order/:id', props, ({ props: { id, price, size } }, response) => {
  new FTX()
    .updateOrder({ id, price, size })
    .then((order = {}) => response.json(order))
    .catch((error) => response.json({ error }));
});

RouterFTX.delete('/order/:id', props, ({ props: { id } }, response) => {
  new FTX()
    .removeOrder(id)
    .then((order = {}) => response.json(order))
    .catch((error) => response.json({ error }));
});

RouterFTX.delete('/orders', (request, response) => {
  new FTX()
    .removeAllOrders()
    .then((order = {}) => response.json(order))
    .catch((error) => response.json({ error }));
});

RouterFTX.get('/orders/history', (request, response) => {
  new FTX()
    .orders({ history: true })
    .then((orders = []) => response.json({ orders }))
    .catch((error) => response.json({ error }));
});

// -----------------------------------------------------------------------------
// -- exchange
// -----------------------------------------------------------------------------
RouterFTX.post('/convert/quote', props, ({ props: { fromCoin, toCoin, size } }, response) => {
  new FTX()
    .convert({ fromCoin, toCoin, size })
    .then((quote) => response.json(quote))
    .catch((error) => response.json({ error }));
});

RouterFTX.post('/convert/quote/:id', props, ({ props: { id } }, response) => {
  new FTX()
    .confirmConvert(id)
    .then((quote = {}) => response.json(quote))
    .catch((error) => response.json({ error }));
});

export { RouterFTX };
