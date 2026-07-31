const {
  configureConnector,
  getFreshToken,
} = require('./src/connector-wrapper');
const {
  decodeToken,
  isTokenExpired,
} = require('./src/token');

module.exports = {
  configureConnector,
  decodeToken,
  getFreshToken,
  isTokenExpired,
};
