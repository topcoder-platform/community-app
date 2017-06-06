import _ from 'lodash';
import atob from 'atob';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'utils/logger';
import loggerMiddleware from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';
import stream from 'stream';

// Temporarily here to test our API service.
// import '../shared/services/api';

// Dome API for topcoder communities
import tcCommunitiesDemoApi from './tc-communities';

import renderer from './renderer';

/* Isomorphic code may rely on this environment variable to check whether it is
 * executed client- or server-side. */
if (process.env.FRONT_END) {
  throw new Error(
    'process.env.FRONT_END must evaluate to false at the server side');
}

const USE_DEV_TOOLS = Boolean(process.env.DEV_TOOLS);

const app = express();

/* tc-accounts App was designed for browser environment, and its decodeToken()
 * function (which we would like to use server-side as well) depends on global
 * atob() method, which is present in browser, but not in NodeJS. This is the
 * fix. */
global.atob = atob;

app.use(favicon(path.resolve(__dirname, '../assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Log Entries service proxy. */
app.use('/api/logger', (req, res) => {
  logger.log(`${req.ip} - `, ...req.body.data);
  res.end();
});

app.use(loggerMiddleware('combined', {
  stream: new stream.Writable({
    decodeStrings: false,
    write: (chunk, encoding, cb) => {
      logger.log(chunk);
      cb();
    },
  }),
}));

/* Setup of Webpack Hot Reloading for development environment.
 * These dependencies are not used nor installed in production deployment,
 * hence some import-related lint rules are disabled.*/
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
if (USE_DEV_TOOLS) {
  const webpack = require('webpack');
  const webpackConfig = require('../../config/webpack/development');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    name: 'bundle.js',
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
  }));
  app.use(webpackHotMiddleware(compiler));
}
/* eslint-enable global-require */
/* eslint-enable import/no-extraneous-dependencies */
/* eslint-enable import/no-unresolved */

app.use(express.static(path.resolve(__dirname, '../../build')));

// serve demo api
app.use('/api/tc-communities', tcCommunitiesDemoApi);

app.use(renderer);

/* Catches 404 and forwards it to error handler. */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Error handler. */
app.use((err, req, res) => {
  /* Sets locals. Errors are provided only in dev. */
  _.assign(res, {
    locals: {
      error: req.app.get('env') === 'development' ? err : {},
      message: err.message,
    },
  });

  /* Returns the error page. */
  res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

export default app;
