import { Router } from 'express';

import { FTX } from '@repositories';
import { props } from '@middlewares';

const RouterWebhook = Router();

// -----------------------------------------------------------------------------
// -- FTX
// -----------------------------------------------------------------------------
RouterWebhook.get('/positions', (request, response) =>
  new FTX()
    .positions()
    .then((positions = []) => response.json({ positions }))
    .catch((error) => response.json({ error })),
);

RouterWebhook.get('/orders', (request, response) =>
  new FTX()
    .orders()
    .then((orders = []) => response.json({ orders }))
    .catch((error) => response.json({ error })),
);

RouterWebhook.post(
  '/order',
  props,
  ({ props: { market, side, price, type, size, reduceOnly, ioc, postOnly, clientId } }, response) =>
    new FTX()
      .order({ market, side, price, type, size, reduceOnly, ioc, postOnly, clientId })
      .then((order = {}) => response.json(order))
      .catch((error) => response.json({ error })),
);

RouterWebhook.put('/order/:id', props, ({ props: { id, price, size } }, response) => {
  new FTX()
    .updateOrder({ id, price, size })
    .then((order = {}) => response.json(order))
    .catch((error) => response.json({ error }));
});

RouterWebhook.delete('/order/:id', props, ({ props: { id } }, response) => {
  new FTX()
    .cancelOrder(id)
    .then((order = {}) => response.json(order))
    .catch((error) => response.json({ error }));
});

RouterWebhook.delete('/orders', (request, response) => {
  new FTX()
    .cancelOrders()
    .then((order = {}) => response.json(order))
    .catch((error) => response.json({ error }));
});

export { RouterWebhook };
