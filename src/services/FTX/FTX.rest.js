const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

const { FTX_KEY, FTX_SECRET } = process.env;

class FTXRest {
  constructor({
    credentials: { key = FTX_KEY, secret = FTX_SECRET, password, code } = {},
    subaccount,
    timeout = 90 * 100,
    userAgent,
  } = {}) {
    this.userAgent = `orca@1.0.0${userAgent ? `:${userAgent}` : ''}`;
    this.timeout = timeout;
    this.agent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: 1000 * 60,
      timeout,
    });
    this.credentials = { key, secret, password, code };
    this.subaccount = subaccount;
  }

  request({ data, method = 'GET', path = '/account', subaccount = this.subaccount, timeout = this.timeout }) {
    const timestamp = +new Date();
    const { key, secret, password, code } = this.credentials;
    let uri = `/api${path}`;
    let payload = '';

    if (method === 'GET' && data) uri += `?${querystring.stringify(data)}`;
    else if (method === 'DELETE' && typeof data === 'number') uri += data;
    else if (data) payload = JSON.stringify({ ...data, password, code });

    const headers = {
      'User-Agent': this.userAgent,
      'content-type': 'application/json',
      ...(method === 'DELETE' && payload ? { 'Content-Length': payload.length } : undefined),
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',

      'FTX-TS': timestamp,
      'FTX-KEY': key,
      'FTX-SIGN': crypto
        .createHmac('sha256', secret)
        .update(timestamp + method + uri + payload)
        .digest('hex'),
      ...(subaccount ? { 'FTX-SUBACCOUNT': subaccount } : undefined),
    };

    const options = {
      host: 'ftx.com',
      path: uri,
      method,
      agent: this.agent,
      headers,
    };

    return new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let buffer = '';

        response.setEncoding('utf8');

        response.on('data', (data) => (buffer += data));

        response.on('end', function () {
          const { statusCode } = response;

          if (statusCode >= 300) {
            let message;
            let data;

            try {
              // data = JSON.parse(buffer);
              message = JSON.parse(buffer);
            } catch (error) {
              message = buffer;
            }

            return reject({ statusCode, message: message.error });
          }

          let data;
          try {
            const { success, result } = JSON.parse(buffer);

            return success ? resolve(result) : reject(result);
          } catch (err) {
            return reject({ message: 'ERROR: parsing JSON buffer.' });
          }
        });
      });

      request.on('error', reject);

      request.on('socket', (socket) => {
        if (socket.connecting) {
          socket.setNoDelay(true);
          socket.setTimeout(timeout);
          socket.on('timeout', request.abort);
        }
      });

      request.end(payload);
    });
  }
}

export { FTXRest };
