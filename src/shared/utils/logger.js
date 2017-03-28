/**
 * A very simple logger: writes messages to the console in dev environment,
 * just ingores them in the production one.
 */

import _ from 'lodash';

import { isDev } from './isomorphy';

const devLogger = console;

const prodLogger = {};
_.functions(console).forEach((func) => {
  prodLogger[func] = _.noop;
});

export default isDev() ? devLogger : prodLogger;
