function webpackHotMiddleware(req, res, next) {
  if (next) next();
}

module.exports = () => webpackHotMiddleware;
