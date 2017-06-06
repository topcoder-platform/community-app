/* eslint-disable no-console */

module.exports = ({ token }) => {
  if (!token) throw Error('Invalid token!');
  return {
    err: console.log,
    info: console.log,
    log: console.log,
    warning: console.log,
  };
};
