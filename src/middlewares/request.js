import onFinished from 'on-finished';

export default (req, res, next) => {
  const timestamp = new Date().getTime();

  onFinished(res, () => {
    console.log(`${req.method} ${req.url} ${res.statusCode} - - ${new Date().getTime() - timestamp} ms`);
  });

  return next();
};
