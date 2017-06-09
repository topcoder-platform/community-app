/**
 * Isomorphic logger.
 *
 * At the server-side it outputs log messages to the console, and also sends
 * them to the https://logentries.com service (only if LOG_ENTRIES_TOKEN is
 * set).
 *
 * At the front-end side it outputs log messages to the console (only when
 * development build of the frontend is used), and sends them to the
 * https://logentries.com service (both dev and prod build of the frontend
 * send messages to the service, proxying them through the App's server;
 * the proxy will forward them to the service only if LOG_ENTRIES_TOKEN is set).
 *
 * In all case, interface of the logger matches that of the standard JS console.
 */

/* eslint-disable global-require */
/* eslint-disable no-console */

import _ from 'lodash';

/* global fetch */
import 'isomorphic-fetch';

import config from './config';

import { isDev, isServerSide } from './isomorphy';

const logger = {};
_.functions(console).forEach((func) => {
  logger[func] = isDev() || isServerSide() ? console[func] : _.noop;
});

let leLogger;
if (isServerSide()) {
  const token = config.LOG_ENTRIES_TOKEN;
  if (token) {
    const LeLogger = require('le_node');
    leLogger = new LeLogger({ token });
  }
} else {
  const log = (type, ...rest) => {
    fetch('/api/logger', {
      body: JSON.stringify({
        data: rest,
        type,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  };
  leLogger = {
    err: (...rest) => log('err', ...rest),
    info: (...rest) => log('info', ...rest),
    log: (...rest) => log('log', ...rest),
    warning: (...rest) => log('warn', ...rest),
  };
}

if (leLogger) {
  const extend = (base, le) => {
    logger[base] = (...rest) => {
      if (isDev() || isServerSide()) console[base](...rest);
      let msg = '';
      rest.forEach((item) => {
        let it = item;
        if (!_.isString(it)) {
          it = JSON.stringify(it);
          if (!_.isString(it)) it = String(it);
        }
        msg = `${msg}${it} `;
      });
      leLogger[le](msg);
    };
  };
  extend('error', 'err');
  extend('info', 'info');
  extend('log', 'log');
  extend('warn', 'warning');
}

export default logger;
