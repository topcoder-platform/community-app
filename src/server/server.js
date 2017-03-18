import _ from 'lodash';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import logger from 'morgan';
import path from 'path';
// import favicon from 'serve-favicon';

import appMiddleware from './appMiddleware';

const IS_DEV = process.env.NODE_ENV === 'development';

const app = express();

/* Uncomment once favicon is included into the project. */
// app.use(favicon(path.resolve(__dirname, '../../build/assets/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Setup of Webpack Hot Reloading for development environment. */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
if (IS_DEV) {
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

app.use(express.static(path.resolve(__dirname, '../../build')));

app.use(appMiddleware);

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
