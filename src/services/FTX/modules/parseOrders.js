export const parseOrders = (orders = []) =>
  orders
    .map((order) => {
      const { filledSize, status } = order;

      return {
        ...order,
        status: status === 'closed' && filledSize === 0 ? 'cancelled' : status,
      };
    })
    .filter(({ status }) => status !== 'cancelled');
