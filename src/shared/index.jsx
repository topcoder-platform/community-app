/**
 * The shared part of Topcoder Community App. This code is further wrapped in
 * different ways by Webpack and ExpressJS server to properly support both
 * client- and server-side rendering.
 */

/* Entry point that ensures correct ordering of imported external styles. */

/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  require('topcoder-react-ui-kit/dist/prod/style.css');
} else {
  require('topcoder-react-ui-kit/dist/dev/style.css');
}
/* eslint-enable global-require */

require('react-redux-toastr/lib/css/react-redux-toastr.min.css');

require('styles/awesome.css');

require('styles/global.scss');
require('slick-carousel/slick/slick.css');
require('slick-carousel/slick/slick-theme.css');

require('react-date-range/dist/styles.css');
require('react-date-range/dist/theme/default.css');

const App = require('./app').default;

export default App;
