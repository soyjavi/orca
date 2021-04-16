import { FTXRest } from './FTX.rest';
import { activePositions, parseOrders, request as fetch } from './modules';

class FTX {
  /*
 credentials: { key = FTX_KEY, secret = FTX_SECRET, password, code } = {},
 subaccount,
 timeout = 90 * 100,
 userAgent,
 */
  constructor(props) {
    this.ftx = new FTXRest(props);
  }

  // -----------------------------------------------------------------------------
  // -- account
  // -----------------------------------------------------------------------------
  account() {
    return new Promise((resolve, reject) => {
      // @TODO: join /wallet/balances
      this.ftx
        .request({ path: '/account' })
        .then(({ positions = [], ...rest }) => resolve({ ...rest, positions: activePositions(positions) }))
        .catch(reject);
    });
  }

  wallet() {
    return this.ftx.request({ path: '/wallet/balances' });
  }

  // -----------------------------------------------------------------------------
  // -- deposits
  // -----------------------------------------------------------------------------
  deposits() {
    return this.ftx.request({ path: '/wallet/deposits' });
  }

  deposit(coin) {
    return this.ftx.request({ path: `/wallet/deposit_address/${coin}` });
  }

  // -----------------------------------------------------------------------------
  // -- withdrawalls
  // -----------------------------------------------------------------------------
  withdrawalFee({ coin, address, size }) {
    return this.ftx.request({ path: '/wallet/withdrawal_fee', data: { coin, address, size } });
  }

  withdrawal({ coin, address, size = 0, tag }) {
    return this.ftx.request({
      method: 'POST',
      path: '/wallet/withdrawals',
      data: { coin, address, size, tag },
    });
  }

  withdrawals() {
    return this.ftx.request({ path: '/wallet/withdrawals' });
  }

  withdrawalAddresses() {
    return this.ftx.request({ path: '/wallet/saved_addresses' });
  }

  createWithdrawalAddress({ coin, address, addressName, isPrimetrust = true, tag }) {
    return this.ftx.request({
      method: 'POST',
      path: '/wallet/saved_addresses',
      data: { coin, address, addressName, isPrimetrust, tag },
    });
  }

  removeWithdrawalAddress(id) {
    return this.ftx.request({
      method: 'DELETE',
      path: `/wallet/saved_addresses/${id}`,
    });
  }

  // -----------------------------------------------------------------------------
  // -- coins
  // -----------------------------------------------------------------------------
  coins() {
    return this.ftx.request({ path: '/wallet/coins' });
  }

  // -----------------------------------------------------------------------------
  // -- order book
  // -----------------------------------------------------------------------------
  positions() {
    return new Promise((resolve, reject) =>
      this.ftx
        .request({ path: '/positions', data: { showAvgPrice: true } })
        .then((positions = []) => resolve(activePositions(positions)))
        .catch(reject),
    );
  }

  orders({ history = false } = {}) {
    return new Promise((resolve, reject) =>
      this.ftx
        .request({ path: history ? '/orders/history' : '/orders' })
        .then((orders = []) => resolve(parseOrders(orders)))
        .catch(reject),
    );
  }

  /*
  market	string	XRP-PERP	e.g. "BTC/USD" for spot, "XRP-PERP" for futures
  side	string	sell	"buy" or "sell"
  price	number	0.306525	Send null for market orders.
  type	string	limit	"limit" or "market"
  size	number	31431.0
  reduceOnly	boolean	false	optional; default is false
  ioc	boolean	false	optional; default is false
  postOnly	boolean	false	optional; default is false
  clientId	string	null	optional; client order id
  */
  order({
    market,
    side = 'buy',
    price = 0,
    type = 'market',
    size = 1,
    reduceOnly = false,
    ioc = false,
    postOnly = false,
    clientId = null,
  }) {
    return this.ftx.request({
      method: 'POST',
      path: '/orders',
      data: {
        market,
        side,
        price,
        type,
        size,
        reduceOnly,
        ioc,
        postOnly,
        clientId,
      },
    });
  }

  updateOrder({ id, price, size }) {
    return this.ftx.request({
      method: 'POST',
      path: `/orders/${id}/modify`,
      data: {
        price,
        size,
      },
    });
  }

  removeOrder(id) {
    return this.ftx.request({ method: 'DELETE', path: `/orders/${id}` });
  }

  removeAllOrders() {
    return this.ftx.request({ method: 'DELETE', path: `/orders` });
  }

  // -----------------------------------------------------------------------------
  // -- exchange
  // -----------------------------------------------------------------------------
  convert({ fromCoin, toCoin, size = 0 }) {
    return new Promise(async (resolve, reject) => {
      const { quoteId } = await this.ftx
        .request({ method: 'POST', path: `/otc/quotes`, data: { fromCoin, toCoin, size } })
        .catch(reject);

      if (quoteId)
        this.ftx
          .request({ path: `/otc/quotes/${quoteId}` })
          .then(resolve)
          .catch(reject);
    });
  }

  confirmConvert(id) {
    return this.ftx.request({ method: 'POST', path: `/otc/quotes/${id}/accept` });
  }
}

export { FTX };
