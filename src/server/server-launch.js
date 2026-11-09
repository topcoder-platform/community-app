// Adapted from topcoder-react-utils (MIT).
/**
 * Standard web servers.
 */

import _ from 'lodash';
import http from 'http';

/* Polyfill required by ReactJS. */
import 'raf/polyfill';

import serverFactory from './server-factory';

/**
 * Normalizes a port into a number, string, or false.
 * @param {String} value Port name or number.
 * @return Port number (Number), name (String), or false.
 */
function normalizePort(value) {
  const port = _.toNumber(value);
  if (_.isFinite(port)) return port; /* port number */
  if (!_.isNumber(port)) return value; /* named pipe */
  return false;
}

/**
 * Creates and starts a new webserver.
 * @param {Object} webpackConfig The Webpack config that was used to build the
 *  frontend bundle.
 * @param {config} options Additional options:
 *  - Application {Function} - Optional. The root ReactJS component of the app
 *    to use for server-side rendering;
 *  - devMode {Boolean} - Whether the server should be started in dev mode;
 *  - favicon {String} - Path of the favicon to be used by the server;
 *  - logger {Object} - Optional. The logger to use. By default, the console
 *    is used (which is not a good decision performancewise, but it will be
 *    changed soon);
 *  - beforeRender {Function} - The hook into server-side rendering. It will get
 *    incoming request as the argument and it should return a promise that will
 *    resolve to the object with the following fields all optional:
 *    - config {Object} - Config object to be injected into the page;
 *    - extraScripts {Array} - Any additional scripts to be injected into
 *      HTML template;
 *    - store {Object} - Redux store, which state should be used for server-side
 *      rendering, if it is performed, and also injected into HTML template as
 *      the initial state.
 *  - onExpressJsSetup {Function} - Custom setup of ExpressJS server.
 *  - port {String} - Optional. The port to listen (number or name). If not
 *    specified the value will be taken from PORT environmental variable, or
 *    default to 3000 otherwise.
 * @return {Promise} Resolves to the result object has two fields:
 *  - express {Object} - ExpressJS server;
 *  - http {Object} - NodeJS HTTP server.
 */
export default async function launch(webpackConfig, options) {
  /* Options normalization. */
  const ops = options ? _.clone(options) : {};
  ops.port = normalizePort(ops.port || process.env.PORT || 3000);
  _.defaults(ops, {
    logger: console,
  });

  /* Creates servers, resolves and sets the port. */
  const expressServer = await serverFactory(webpackConfig, ops);
  const httpServer = http.createServer(expressServer);

  /* Sets error handler for HTTP server. */
  httpServer.on('error', (error) => {
    if (error.syscall !== 'listen') throw error;
    const bind = _.isString(ops.port) ? `Pipe ${ops.port}` : `Port ${ops.port}`;

    /* Human-readable message for some specific listen errors. */
    switch (error.code) {
      case 'EACCES':
        ops.logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        ops.logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  /* Listening event handler for HTTP server. */
  httpServer.on('listening', () => {
    const addr = httpServer.address();
    const bind = _.isString(addr) ? `pipe ${addr}` : `port ${addr.port}`;
    ops.logger.info(`Server listening on ${bind} in ${
      process.env.NODE_ENV} mode`);
  });

  httpServer.listen(ops.port);

  return {
    expressServer,
    httpServer,
  };
}
