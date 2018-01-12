import _ from 'lodash';

const loggerMiddleware = () => (req, res, next) => next();

loggerMiddleware.token = _.noop;

module.exports = loggerMiddleware;
