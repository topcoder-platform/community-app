import atob from 'atob';
import Application from 'shared';
import config from 'config';
import fetch from 'isomorphic-fetch';
import 'services/communities';
import { logger } from 'topcoder-react-lib';
import path from 'path';
import qs from 'qs';
import serializeJs from 'serialize-javascript';

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

const CMS_BASE_URL =
  `https://app.contentful.com/spaces/${config.SECRET.CONTENTFUL.SPACE_ID}`;

const EXTRA_SCRIPTS = [
  `<script
      src="/community-app-assets/loading-indicator-animation.js"
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

  return {
    config: { ...suggestedConfig, EXCHANGE_RATES: rates },
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
  server.use('/community-app-assets/api/tc-communities', tcCommunitiesDemoApi);

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
  server.use('/community-app-assets/api/proxy-get', checkAuthorizationHeader, (req, res) => {
    fetch(req.query.url)
      .then(x => x.text())
      .then(x => res.send(x));
  });

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
  server.use('/community-app-assets/api/mock/docu-sign', (req, res) =>
    /* The real DocuSign API does not return the page immediately,
     * thus timeout to imitate this in our mock. 3 seconds just an arbitrary
     * choice. */
    setTimeout(() => res.send(mockDocuSignFactory(req.query.returnUrl)), 3000));
}

global.KEEP_BUILD_INFO = true;
serverFactory(webpackConfigFactory(MODE), {
  Application,
  beforeRender,
  devMode: MODE === 'development',
  favicon: path.resolve(__dirname, '../assets/images/favicon.ico'),
  onExpressJsSetup,
});
