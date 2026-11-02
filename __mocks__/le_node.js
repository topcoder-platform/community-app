/* eslint-disable no-console */

module.exports = function LeLogger({ token }) {
  if (!token) throw Error('Invalid token!');
  return {
    err: console.log,
    info: console.log,
    log: console.log,
    warning: console.log,
  };
};
