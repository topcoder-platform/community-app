import _ from 'lodash';
import atob from 'atob';
import bodyParser from 'body-parser';
import config from 'config';
import cookieParser from 'cookie-parser';
import express from 'express';
import fetch from 'isomorphic-fetch';
import helmet from 'helmet';
import logger from 'utils/logger';
import loggerMiddleware from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';
import requestIp from 'request-ip';
import stream from 'stream';
import serializeJs from 'serialize-javascript';
import { getRates as getExchangeRates } from 'services/money';
import { toJson as xmlToJson } from 'utils/xml2json';
import qs from 'qs';

import mockDocuSignFactory from './__mocks__/docu-sign-mock';

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
app.use(helmet());

/* tc-accounts App was designed for browser environment, and its decodeToken()
 * function (which we would like to use server-side as well) depends on global
 * atob() method, which is present in browser, but not in NodeJS. This is the
 * fix. */
global.atob = atob;

app.use(favicon(path.resolve(__dirname, '../assets/images/favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(requestIp.mw());

const checkAuthorizationHeader = (req, res, next) => {
  if (req.headers.authorization !== `ApiKey ${config.SERVER_API_KEY}`) {
    return res.status(403).end();
  }
  return next();
};

/* Log Entries service proxy. */
app.use('/community-app-assets/api/logger', checkAuthorizationHeader, (req, res) => {
  logger.log(`${req.clientIp} > `, ...req.body.data);
  res.end();
});

loggerMiddleware.token('ip', req => req.clientIp);

app.use(loggerMiddleware(':ip > :status :method :url :response-time ms :res[content-length] :referrer :user-agent', {
  stream: new stream.Writable({
    decodeStrings: false,
    write: (chunk, encoding, cb) => {
      if (!chunk.match(/ELB-HealthChecker\/2.0/)) {
        logger.log(chunk);
      }
      cb();
    },
  }),
}));

/* Setup of Webpack Hot Reloading for development environment.
 * These dependencies are not used nor installed in production deployment,
 * hence some import-related lint rules are disabled. */
/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
if (USE_DEV_TOOLS) {
  const webpack = require('webpack');
  const webpackConfig = require('../../config/webpack/development');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const compiler = webpack(webpackConfig);
  compiler.apply(new webpack.ProgressPlugin());
  app.use(webpackDevMiddleware(compiler, {
    name: 'main.js',
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
  }));
  app.use(webpackHotMiddleware(compiler));
}
/* eslint-enable global-require */
/* eslint-enable import/no-extraneous-dependencies */
/* eslint-enable import/no-unresolved */

// app.use(express.static(path.resolve(__dirname, '../../build')));
app.use('/community-app-assets', express.static(path.resolve(__dirname, '../../build')));

// serve demo api
app.use('/community-app-assets/api/tc-communities', tcCommunitiesDemoApi);

/**
 * Auxiliary endpoint for xml -> json conversion (the most popular npm library
 * for such conversion works only in the node :(
 */
app.use('/community-app-assets/api/xml2json', checkAuthorizationHeader, (req, res) => {
  xmlToJson(req.body.xml).then(json => res.json(json));
});

/* Proxy endpoint for GET requests (to fetch data from resources prohibiting
 * cross-origin requests). */
app.use('/community-app-assets/api/proxy-get', checkAuthorizationHeader, (req, res) => {
  fetch(req.query.url)
    .then(x => x.text())
    .then(x => res.send(x));
});

/* Proxy endpoint for POST requests (to fetch data from resources prohibiting
 * cross-origin requests). */
app.use('/community-app-assets/api/proxy-post', checkAuthorizationHeader, (req, res) => {
  fetch(req.query.url, {
    body: qs.stringify(req.body),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  }).then(x => x.text())
    .then(x => res.send(x));
});

/* Returns currency exchange rates, cached at the server-side (thus drastically
 * reducing amount of calls to openexchangerates.com). */
app.use('/community-app-assets/api/exchange-rates', checkAuthorizationHeader, (req, res) => {
  getExchangeRates().then(rates => res.send(rates));
});

/* Receive the signing result from DocuSign server, and then send result to client
 */
app.use('/community-app-assets/iframe-break', (req, res) => {
  res.send(`<script>parent.postMessage(${serializeJs({ ...req.query, type: 'DocuSign' })}, '*')</script>`);
});

/* Serves a mock DocuSign page. Which is, actually, just a simple local
 * HTML document (/src/shared/services/__mocks__/data/docu-sign-mock.html)
 * that has two buttons, that do the same redirects, as the real DocuSign
 * page would do on signing / rejecting a document. */
app.use('/community-app-assets/api/mock/docu-sign', (req, res) =>
  /* The real DocuSign API does not return the page immediately,
   * thus timeout to imitate this in our mock. 3 seconds just an arbitrary
   * choice. */
  setTimeout(() => res.send(mockDocuSignFactory(req.query.returnUrl)), 3000));

app.use(renderer);

/* Catches 404 and forwards it to error handler. */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Error handler. */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  let errorResponse = null;
  const status = err.isJoi ? 400 : err.httpStatus || err.status || 500;

  if (err.isJoi && _.isArray(err.details)) {
    _.map(err.details, (e) => {
      if (e.message) {
        if (!errorResponse) {
          errorResponse = e.message;
        } else {
          errorResponse += `, ${e.message}`;
        }
      }
    });
  }
  errorResponse = errorResponse || err.message || 'Internal Server Error';

  /* Sets locals. Errors are provided only in dev. */
  _.assign(res, {
    locals: {
      error: req.app.get('env') === 'development' ? err : {},
      message: err.message,
    },
  });

  /* Returns the error page. */
  res.status(status).send(errorResponse);
});

export default app;
