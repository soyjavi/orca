import onFinished from 'on-finished';

import { Log } from '@commons';

export default (req, res, next) => {
  const timestamp = new Date().getTime();

  const log = new Log(req.method, req.url);

  onFinished(res, () => {
    log[res.statusCode >= 400 ? 'error' : 'succeed'](
      `${req.url} ${res.statusCode} - - ${new Date().getTime() - timestamp} ms`,
    );
  });

  return next();
};
