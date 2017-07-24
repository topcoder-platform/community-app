/**
 * This module implements ExpressJS middleware for server-side rendering of
 * the App.
 */

import _ from 'lodash';
import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom/server'; // This may cause warning of PropTypes
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import serializeJs from 'serialize-javascript';

import App from '../shared';

/* This is always initial state of the store. Later we'll have to provide a way
 * to put the store into correct state depending on the demanded route. */
import storeFactory from '../shared/store-factory';

const sanitizedConfig = serializeJs(
  _.omit(config, [
    'LOG_ENTRIES_TOKEN',
  ]), {
    isJSON: true,
  },
);

export default (req, res) => {
  storeFactory(req).then((store) => {
    const context = {};
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
    if (context.status) res.status(context.status);
    res.send((
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Topcoder</title>
          <link rel="stylesheet" href="/style.css" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta charset="utf-8" />
          <meta
            content="width=device-width,initial-scale=1"
            name="viewport"
          />
          <!-- Start of topcoder Zendesk Widget script -->
          <script>/*<![CDATA[*/window.zEmbed||function(e,t){var n,o,d,i,s,a=[],r=document.createElement("iframe");window.zEmbed=function(){a.push(arguments)},window.zE=window.zE||window.zEmbed,r.src="javascript:false",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="display: none",d=document.getElementsByTagName("script"),d=d[d.length-1],d.parentNode.insertBefore(r,d),i=r.contentWindow,s=i.document;try{o=s}catch(e){n=document.domain,r.src='javascript:var d=document.open();d.domain="'+n+'";void(0);',o=s}o.open()._l=function(){var e=this.createElement("script");n&&(this.domain=n),e.id="js-iframe-async",e.src="https://assets.zendesk.com/embeddable_framework/main.js",this.t=+new Date,this.zendeskHost="topcoder.zendesk.com",this.zEQueue=a,this.body.appendChild(e)},o.write('<body onload="document._l();">'),o.close()}();
          /*]]>*/</script>
          <!-- End of topcoder Zendesk Widget script -->
        </head>
        <body>
          <div id="react-view">${appHtml}</div>
          <script type="application/javascript">
            window.CONFIG = ${sanitizedConfig}
            window.ISTATE = ${serializeJs(store.getState(), { isJSON: true })}
          </script>
          <script type="application/javascript" src="/bundle.js"></script>
          <script>
            !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
            analytics.load("WEjBoGYCPGzGrNDmf7V4eQsMOsJroeyr");
            analytics.page();
            }}();
          </script>
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
