/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * API authentication middleware
 * @author TCSCODER
 * @version 1.0
 */

import config from 'config';
import { decodeToken, isTokenExpired } from 'tc-accounts';
import errors from './errors';

/**
 * get token from header or query
 * @param req
 * @return {*}
 */
const getToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  return req.query.token;
};

/**
 * Auth middleware
 * Check if the token exits, is not expired and has required roles.
 * @param req
 * @param res
 * @param next
 */
async function auth(req, res, next) {
  const adt = config.AUTH_DROP_TIME;
  const token = getToken(req);
  if (!token) {
    const authErr = new errors.UnauthorizedError('Authorization token is required.');
    next(authErr);
  }

  if (isTokenExpired(token, adt)) {
    const authErr = new errors.UnauthorizedError('Token has expired, please provide a new one.');
    next(authErr);
  }

  const user = decodeToken(token);
  if (!user.roles.includes(config.SCOREBOARD.ADMIN_ROLE)) {
    const authErr = new errors.UnauthorizedError('Token is missing administrative rights.');
    next(authErr);
  }

  next();
}

/**
 * Export a function
 * @return {Function}       return the middleware function
 */
module.exports = () => auth;
