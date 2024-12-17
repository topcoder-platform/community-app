/* eslint-disable */
/* Datadog debugging */
import ddTrace from 'dd-trace';

ddTrace.init();

import atob from 'atob';
import Application from 'shared';
import config from 'config';
import express from 'express';
import fetch from 'isomorphic-fetch';
import { logger, services } from 'topcoder-react-lib';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import qs from 'qs';
import serializeJs from 'serialize-javascript';

import { DoSSR } from 'utils/SSR';

import { factory as reducerFactory } from 'reducers';
import { redux, server as serverFactory } from 'topcoder-react-utils';
import { getRates as getExchangeRates } from 'services/money';
import { toJson as xmlToJson } from 'utils/xml2json';

import cdnRouter from './routes/cdn';
import mailChimpRouter from './routes/mailchimp';
import mockDocuSignFactory from './__mocks__/docu-sign-mock';
import recruitCRMRouter from './routes/recruitCRM';
import mmLeaderboardRouter from './routes/mmLeaderboard';
import gSheetsRouter from './routes/gSheet';
import blogRouter from './routes/blog';
import feedsRouter from './routes/feeds';

/* Dome API for topcoder communities */
import tcCommunitiesDemoApi from './tc-communities';

import webpackConfigFactory from '../../webpack.config';
/* eslint-enable */

global.atob = atob;

const CMS_BASE_URL = `https://app.contentful.com/spaces/${config.SECRET.CONTENTFUL.SPACE_ID}`;

const getTimestamp = async () => {
  try {
    // Step 1: Resolve and validate file path
    const filePath = path.resolve(__dirname, '../../.build-info');
    if (!filePath.startsWith(path.resolve(__dirname))) {
      throw new Error('Invalid file path detected');
    }

    // Step 2: Read file asynchronously and add file size limit check
    const MAX_FILE_SIZE = 10 * 1024; // 10 KB max file size
    const stats = await fs.stat(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      throw new Error('File is too large and may cause DoS issues');
    }

    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Step 3: Validate and parse JSON safely
    let tsData;
    try {
      tsData = JSON.parse(fileContent);
    } catch (parseErr) {
      throw new Error('Invalid JSON format in file');
    }

    // Step 4: Validate timestamp format
    if (!tsData || !tsData.timestamp) {
      throw new Error('Timestamp is missing in the JSON file');
    }

    // Step 5: Process timestamp
    return moment(tsData.timestamp).valueOf();
  } catch (err) {
    console.error('Error:', err.message);
  }
};

const ts = await getTimestamp();

const sw = `sw.js${process.env.NODE_ENV === 'production' ? '' : '?debug'}`;
const swScope = '/challenges'; // we are currently only interested in improving challenges pages

const tcoPattern = new RegExp(/^tco\d{2}\.topcoder(?:-dev)?\.com$/i);
const universalNavUrl = config.UNIVERSAL_NAV_URL;

const EXTRA_SCRIPTS = [
  `<script type="application/javascript">
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('${swScope}/${sw}', {scope: '${swScope}'}).then(
    (reg)=>{
      console.log('SW registered: ',reg);
      reg.onupdatefound = () => {
        const installingWorker = reg.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'activated') {
            location.reload();
          }
        };
      };
    }).catch((err)=>{console.log('SW registration failed: ',err)})
  }
  </script>`,
  `<script
      src="${process.env.CDN_URL || '/api/cdn/public'}/static-assets/loading-indicator-animation-${ts}.js"
      type="application/javascript"
  ></script>`,
  `<script>
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
    analytics.load("${config.SEGMENT_IO_API_KEY}");
    }}();
  </script>`,
  `<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-6340959-1', 'auto');
    ga('send', 'pageview');
  </script>`,
  `<!-- Start of topcoder Topcoder Universal Navigation script -->
  <script>
  !function(n,t,e,a,c,i,o){n['TcUnivNavConfig']=c,n[c]=n[c]||function(){
  (n[c].q=n[c].q??[]).push(arguments)},n[c].l=1*new Date();i=t.createElement(e),
  o=t.getElementsByTagName(e)[0];i.async=1;i.type="module";i.src=a;o.parentNode.insertBefore(i,o)
  }(window,document,"script","${universalNavUrl}","tcUniNav");
  </script>
  <!-- End of topcoder Topcoder Universal Navigation script -->`,
];

const MODE = process.env.BABEL_ENV;

async function beforeRender(req, suggestedConfig) {
  const [
    store,
    rates,
  ] = await Promise.all([
    redux.storeFactory({
      getReducerFactory: () => reducerFactory,
      httpRequest: req,
    }),
    getExchangeRates(),
  ]);

  await DoSSR(req, store, Application);

  return {
    configToInject: { ...suggestedConfig, EXCHANGE_RATES: rates },
    extraScripts: EXTRA_SCRIPTS,
    store,
  };
}

/**
 * Custom tuning of ExpressJS server.
 * @param {Object} server
 */
async function onExpressJsSetup(server) {
  /* tc-accounts App was designed for browser environment, and its decodeToken()
   * function (which we would like to use server-side as well) depends on global
   * atob() method, which is present in browser, but not in NodeJS. This is the
   * fix. */
  global.atob = atob;

  const checkAuthorizationHeader = (req, res, next) => {
    if (req.headers.authorization !== `ApiKey ${config.SERVER_API_KEY}`) {
      return res.status(403).end();
    }
    return next();
  };

  server.use((req, res, next) => {
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    if (req.url.startsWith('/__community__/veterans') || req.hostname === 'veterans.topcoder.com' || req.url.startsWith('/__community__/tco') || tcoPattern.test(req.hostname)) {
      res.header(
        'Content-Security-Policy',
        "default-src 'self';"
        + " script-src 'report-sample' 'self' 'unsafe-inline' 'unsafe-eval'"
          + ` ${config.CDN.PUBLIC}`
          + ' http://www.google-analytics.com'
          + ' https://www.google-analytics.com'
          + ' https://43d132d5dbff47c59d9d53ad448f93c2.js.ubembed.com'
          + ' https://assets.ubembed.com'
          + ' https://cdn.heapanalytics.com'
          + ' https://cdn.segment.com'
          + ' https://connect.facebook.net'
          + ' https://d1of0acg2orgco.cloudfront.net'
          + ' https://d1mwkvp2xbqfs9.cloudfront.net'
          + ' https://d24oibycet9bsb.cloudfront.net'
          + ' https://static.zdassets.com'
          + ' https://uni-nav.topcoder-dev.com'
          + ' https://uni-nav.topcoder.com'
          + ' https://js.hs-analytics.net'
          + ' https://cdn-3.convertexperiments.com'
          + ' https://js-na1.hs-scripts.com'
          + ' https://js.hs-banner.com'
          + ' https://js.usemessages.com'
          + ' https://js.hscollectedforms.net'
          + ' https://www.googletagmanager.com;'
        + " style-src 'report-sample' 'self' 'unsafe-inline'"
          + ` ${config.CDN.PUBLIC}`
          + ' https://d1of0acg2orgco.cloudfront.net'
          + ' https://d1mwkvp2xbqfs9.cloudfront.net'
          + ' https://d24oibycet9bsb.cloudfront.net'
          + ' https://d2nl5eqipnb33q.cloudfront.net;'
        + " object-src 'none';"
        + " base-uri 'self';"
        + " connect-src 'self'"
          + ` ${config.API.V2}/`
          + ` ${config.API.V3}/`
          + ` ${config.API.V4}/`
          + ` ${config.API.V5}/`
          + ` ${config.CDN.PUBLIC}`
          + ` ${config.URL.COMMUNITY_APP}`
          + ' https://api.segment.io'
          + ' https://cdn.segment.com'
          + ' https://ekr.zdassets.com'
          + ' https://stats.g.doubleclick.net'
          + ' https://region1.analytics.google.com'
          + ' https://logs.convertexperiments.com'
          + ' https://www.google-analytics.com;'
        + " font-src 'self'"
          + ' data:'
          + ` ${config.CDN.PUBLIC}`
          + ' https://d1of0acg2orgco.cloudfront.net'
          + ' https://d24oibycet9bsb.cloudfront.net'
          + ' https://d1mwkvp2xbqfs9.cloudfront.net'
          + ' https://43d132d5dbff47c59d9d53ad448f93c2.js.ubembed.com;'
        + " frame-src 'self'"
          + ` ${config.URL.AUTH}`
          + ' https://www.youtube.com;'
        + " img-src 'self'"
          + ' data:'
          + ` ${config.CDN.PUBLIC}`
          + ' https://cdn.segment.com'
          + ' https://d1of0acg2orgco.cloudfront.net'
          + ' https://d24oibycet9bsb.cloudfront.net'
          + ' https://d2nl5eqipnb33q.cloudfront.net'
          + ' https://images.ctfassets.net'
          + ' https://heapanalytics.com'
          + ' https://q.quora.com'
          + ' https://topcoder-prod-media.s3.amazonaws.com'
          + ' https://topcoder-dev-media.s3.amazonaws.com'
          + ' https://www.facebook.com'
          + ' https://www.google-analytics.com'
          + ' https://www.google.com'
          + ' https://www.googletagmanager.com'
          + ' https://i.ytimg.com'
          + ' https://images.contentful.com'
          + ' https://member-media.topcoder-dev.com'
          + ' https://member-media.topcoder.com'
          + ' https://track.hubspot.com'
          + ' https://d0.awsstatic.com/logos/;'
        + " manifest-src 'self';"
        + " media-src 'self';"
        + " worker-src 'self';",
      );
    }

    if (req.url.startsWith('/examples')) {
      // eslint-disable-next-line quotes
      res.header('Content-Security-Policy', `frame-ancestors 'self' https://app.contentful.com`);
      res.removeHeader('X-Frame-Options');
    }

    next();
  });

  /* Log Entries service proxy. */
  server.use('/community-app-assets/api/logger', checkAuthorizationHeader, (req, res) => {
    logger.log(`${req.clientIp} > `, ...req.body.data);
    res.end();
  });

  server.use('/api/cdn', cdnRouter);
  server.use('/api/mailchimp', mailChimpRouter);
  server.use('/api/recruit', recruitCRMRouter);
  server.use('/api/mml', mmLeaderboardRouter);
  server.use('/api/gsheets', gSheetsRouter);
  server.use('/api/blog', blogRouter);
  server.use('/api/feeds', feedsRouter);

  // serve demo api
  server.use(
    '/community-app-assets/api/tc-communities',
    (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      );
      next();
    },
    tcCommunitiesDemoApi,
  );

  server.use(
    '/community-app-assets/api/edit-contentful-entry/:id',
    (req, res) => res.redirect(`${CMS_BASE_URL}/entries/${req.params.id}`),
  );

  /**
   * Auxiliary endpoint for xml -> json conversion (the most popular npm library
   * for such conversion works only in the node :(
   */
  server.use('/community-app-assets/api/xml2json', checkAuthorizationHeader, (req, res) => {
    xmlToJson(req.body.xml).then(json => res.json(json));
  });

  /* Proxy endpoint for GET requests (to fetch data from resources prohibiting
   * cross-origin requests). */
  /*  server.use(
    '/community-app-assets/api/proxy-get',
    checkAuthorizationHeader, async (req, res, next) => {
      try {
        let data = await fetch(req.query.url);
        data = await data.text();
        res.send(data);
      } catch (err) {
        next(err);
      }
    },
  );
  */

  /* Proxy endpoint for POST requests (to fetch data from resources prohibiting
   * cross-origin requests). */
  server.use('/community-app-assets/api/proxy-post', checkAuthorizationHeader, (req, res) => {
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
  server.use('/community-app-assets/api/exchange-rates', checkAuthorizationHeader, (req, res) => {
    getExchangeRates().then(rates => res.send(rates));
  });

  /* Receive the signing result from DocuSign server, and then send result to client
   */
  server.use(
    '/community-app-assets/iframe-break',
    (req, res) => {
      res.removeHeader('X-Frame-Options');
      res.send(`<script>parent.postMessage(${serializeJs({ ...req.query, type: 'DocuSign' })}, '*')</script>`);
    },
  );

  /* Serves a mock DocuSign page. Which is, actually, just a simple local
   * HTML document (/src/shared/services/__mocks__/data/docu-sign-mock.html)
   * that has two buttons, that do the same redirects, as the real DocuSign
   * page would do on signing / rejecting a document. */
  server.use('/community-app-assets/api/mock/docu-sign', (req, res) => setTimeout(() => res.send(mockDocuSignFactory(req.query.returnUrl)), 3000));

  /* TODO:
   * This is a temporary fallback route: some of the assets in the app are not
   * properly packed with Webpack, and they rely on just being copied into some
   * path on the server. The easiest solution for now is to keep this route
   * for static assets. */
  const url = path.resolve(__dirname, '../../build');
  server.use('/community-app-assets', express.static(url));

  /* Serve sw.js */
  server.use(`${swScope}/sw.js`, (req, res) => {
    res.set('Service-Worker-Allowed', '/');

    if (`${config.DISABLE_SERVICE_WORKER}`.toLowerCase() === 'true') {
      res.sendFile(`${url}/noopsw.js`);
    } else {
      res.sendFile(`${url}/sw.js`);
    }
  });
  /* Serve manifest.json */
  server.use(`${swScope}/manifest.json`, (req, res) => {
    res.sendFile(`${url}/manifest.json`);
  });
}

global.KEEP_BUILD_INFO = true;
serverFactory(webpackConfigFactory(MODE), {
  Application,
  beforeRender,
  devMode: MODE === 'development',
  favicon: path.resolve(__dirname, '../assets/images/favicon.ico'),
  onExpressJsSetup,
});
