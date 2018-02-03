/**
 * This module implements ExpressJS middleware for server-side rendering of
 * the App.
 */

import _ from 'lodash';
import config from 'config';
import forge from 'node-forge';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import serializeJs from 'serialize-javascript';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getRates } from 'services/money';
import { Helmet } from 'react-helmet';

import 'raf/polyfill';

import App from '../shared';

/* This is always initial state of the store. Later we'll have to provide a way
 * to put the store into correct state depending on the demanded route. */
import storeFactory from '../shared/store-factory';

const buildInfoUrl = path.resolve(__dirname, '../../.build-info');

const sanitizedConfig =
  _.omit(config, [
    'LOG_ENTRIES_TOKEN',
    'SECRET',
  ]);

/**
 * Prepares a new Cipher for injected data encryption.
 * @return {Promise} Resolves to the object with two fields:
 *  1. cipher - a new Cipher ready for encryption;
 *  2. iv - initial vector used by the cipher.
 */
function prepareCipher() {
  return new Promise(resolve =>
    fs.readFile(buildInfoUrl, (err1, buildInfo) =>
      forge.random.getBytes(32, (err2, iv) => {
        const key = JSON.parse(buildInfo).rndkey;
        const cipher = forge.cipher.createCipher('AES-CBC', key.toString());
        cipher.start({ iv });
        resolve({ cipher, iv });
      }),
    ),
  );
}

export default (req, res) => {
  Promise.all([
    storeFactory(req),
    getRates(),
    prepareCipher(),
  ]).then(([store, exchangeRates, { cipher, iv }]) => {
    const context = {
      /* Array of chunk names, to use for stylesheet links injection. */
      chunks: [],

      /* Pre-rendered HTML markup for dynamic chunks. */
      splits: {},

      store,
    };
    const appHtml = ReactDOM.renderToString((
      <Provider store={store}>
        <StaticRouter
          context={context}
          location={req.url}
        >
          <App />
        </StaticRouter>
      </Provider>
    ));
    const helmet = Helmet.renderStatic();

    /* Prepares sensitive data for injection. */
    cipher.update(forge.util.createBuffer(JSON.stringify({
      CONFIG: sanitizedConfig,
      ISTATE: store.getState(),
    }), 'utf8'));
    cipher.finish();
    const INJ = forge.util.encode64(`${iv}${cipher.output.data}`);

    if (context.status) res.status(context.status);
    const sanitizedExchangeRates = serializeJs(exchangeRates, { isJSON: true });
    const styles = context.chunks.map(chunk => (
      `<link data-chunk="${chunk}" href="/${chunk}.css" rel="stylesheet" />`
    )).join('');
    res.send((
      `<!DOCTYPE html>
      <html>
        <head>
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          <script
            src="/community-app-assets/polyfills.js"
            type="application/javascript"
          ></script>
          <script
            src="/community-app-assets/loading-indicator-animation.js"
            type="application/javascript"
          ></script>
          <link href="/community-app-assets/main.css" rel="stylesheet" />
          ${styles}
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta charset="utf-8" />
          <meta
            content="width=device-width,initial-scale=1.0"
            name="viewport"
          />
          <!-- Start of topcoder Zendesk Widget script -->
          <script>/*<![CDATA[*/window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(e){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var e=this.createElement("script");n&&(this.domain=n),e.id="js-iframe-async",e.src="https://assets.zendesk.com/embeddable_framework/main.js",this.t=+new Date,this.zendeskHost="topcoder.zendesk.com",this.zEQueue=a,this.body.appendChild(e)},o.write('<body onload="document._l();">'),o.close()}();
          /*]]>*/</script>
          <!-- End of topcoder Zendesk Widget script -->
        </head>
        <body>
          <div id="react-view">${appHtml}</div>
          <script id="inj" type="application/javascript">
            window.EXCHANGE_RATES = ${sanitizedExchangeRates}
            window.SPLITS = ${serializeJs(context.splits, { isJSON: true })}
            window.INJ="${INJ}"
          </script>
          <script>
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
            analytics.load("${config.SEGMENT_IO_API_KEY}");
            }}();
          </script>
          <script src="/community-app-assets/main.js" type="application/javascript"></script>
          <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-6340959-1', 'auto');
            ga('send', 'pageview');

          </script>
        </body>
      </html>`
    ));
  });
};
