const HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

const AbortControllerProxy = () =>
  typeof AbortController === 'undefined'
    ? {
        abort: () => {},
        signal: undefined,
      }
    : new AbortController();

export const request = async ({ endpoint, headers, hostname, method = 'GET', timeout, ...props } = {}) => {
  const controller = new AbortControllerProxy();

  if (timeout) setTimeout(() => controller.abort(), timeout);

  return new Promise((resolve, reject) => {
    fetch(`${hostname}${endpoint}`, {
      headers: { ...HEADERS, ...headers },
      method,
      signal: timeout ? controller.signal : undefined,
      ...(['DELETE', 'POST', 'PUT'].includes(method) ? { body: JSON.stringify(props) } : props),
    })
      .then(async (response) => {
        const text = await response.text();
        let json;

        if (text.length > 0) json = JSON.parse(text);
        if (response.status >= 400) reject({ code: response.status, message: (json || {}).message, payload: json });
        else resolve(json);
      })
      .catch(({ message = 'Something wrong happened. Try again.', response } = {}) => {
        reject({
          code: response ? response.status : 500,
          message,
        });
      });
  });
};
