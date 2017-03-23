/**
 * A very simple logger: writes messages to the console in dev environment,
 * just ingores them in the production one.
 */

import _ from 'lodash';

import { isDev } from './isomorphy';

const devLogger = console;

const prodLogger = {
  clear: _.noop,
  debug: _.noop,
  error: _.noop,
  info: _.noop,
  log: _.noop,
  warn: _.noop,
};

export default isDev() ? devLogger : prodLogger;
