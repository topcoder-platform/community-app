import atob from 'atob';
import Application from 'shared';
import config from 'config';
import express from 'express';
import fetch from 'isomorphic-fetch';
import { logger } from 'topcoder-react-lib';
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
import mockDocuSignFactory from './__mocks__/docu-sign-mock';

/* Dome API for topcoder communities */
import tcCommunitiesDemoApi from './tc-communities';

import webpackConfigFactory from '../../webpack.config';

global.atob = atob;

const CMS_BASE_URL = `https://app.contentful.com/spaces/${config.SECRET.CONTENTFUL.SPACE_ID}`;

let ts = path.resolve(__dirname, '../../.build-info');
ts = JSON.parse(fs.readFileSync(ts));
ts = moment(ts.timestamp).valueOf();

const sw = `sw.js${process.env.NODE_ENV === 'production' ? '' : '?debug'}`;
const swScope = '/challenges'; // we are currently only interested in improving challenges pages

const EXTRA_SCRIPTS = [
  `<script type="application/javascript">
  if('serviceWorker' in navigator){navigator.serviceWorker.register('${swScope}/${sw}', {scope: '${swScope}'}).then((res)=>{console.log('SW registered: ',res)}).catch((err)=>{console.log('SW registration failed: ',err)})}
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
  `<!-- Start of topcoder Zendesk Widget script -->
  <script>/*<![CDATA[*/window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(e){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var e=this.createElement("script");n&&(this.domain=n),e.id="js-iframe-async",e.src="https://assets.zendesk.com/embeddable_framework/main.js",this.t=+new Date,this.zendeskHost="topcoder.zendesk.com",this.zEQueue=a,this.body.appendChild(e)},o.write('<body onload="document._l();">'),o.close()}();
  /*]]>*/</script>
  <!-- End of topcoder Zendesk Widget script -->`,
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

  /* Log Entries service proxy. */
  server.use('/community-app-assets/api/logger', checkAuthorizationHeader, (req, res) => {
    logger.log(`${req.clientIp} > `, ...req.body.data);
    res.end();
  });

  server.use('/api/cdn', cdnRouter);

  // serve demo api
  server.use(
    '/community-app-assets/api/tc-communities',
    (req, res, next) => {
      res.set('Access-Control-Allow-Headers', 'authorization');
      res.set('Access-Control-Allow-Origin', '*');
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
  server.use(
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
  server.use('/community-app-assets/iframe-break', (req, res) => {
    res.send(`<script>parent.postMessage(${serializeJs({ ...req.query, type: 'DocuSign' })}, '*')</script>`);
  });

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
}

global.KEEP_BUILD_INFO = true;
serverFactory(webpackConfigFactory(MODE), {
  Application,
  beforeRender,
  devMode: MODE === 'development',
  favicon: path.resolve(__dirname, '../assets/images/favicon.ico'),
  onExpressJsSetup,
});
