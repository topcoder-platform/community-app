function webpackDevMiddleware(req, res, next) {
  if (next) next();
}

module.exports = () => webpackDevMiddleware;
