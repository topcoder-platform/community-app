/**
 * ExpressJS startup script.
 */

import _ from 'lodash';
import http from 'http';
import logger from 'utils/logger';
import app from './server';

/**
 * Normalizes a port into a number, string, or false.
 * @param {String} value Port name or number.
 * @return Port number (Number), name (String), or false.
 */
function normalizePort(value) {
  const port = parseInt(value, 10);
  if (isNaN(port)) return value; /* named pipe */
  if (port >= 0) return port; /* port number */
  return false;
}

/* Get port from environment and store in Express. */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/* Creates HTTP server. */
const server = http.createServer(app);

/**
 * Error handler for HTTP server.
 * @param {Object} error
 */
function onError(error) {
  if (error.syscall !== 'listen') throw error;
  const bind = _.isString(port) ? `Pipe ${port}` : `Port ${port}`;

  /* Human-readable messages for some specific listen errors. */
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Listening event handler for HTTP server.
 */
function onListening() {
  const addr = server.address();
  const bind = _.isString(addr) ? `pipe ${addr}` : `port ${addr.port}`;
  logger.log(`Server listening on ${bind} in ${process.env.NODE_ENV} mode`);
}

/* Listens on provided port, on all network interfaces. */
server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
