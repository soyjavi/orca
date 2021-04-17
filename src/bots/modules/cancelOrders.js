export const cancelOrders = (ftx) =>
  new Promise(async (resolve, reject) => {
    const orders = await ftx.orders();

    const clientIdOrders = orders.filter(({ clientId }) => clientId !== undefined && clientId !== null);

    Promise.all(clientIdOrders.map(({ id }) => ftx.cancelOrder(id)))
      .then(resolve)
      .catch(reject);
  });
