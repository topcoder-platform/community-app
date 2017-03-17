# Topcoder Community App
New version of Topcoder Community website.

# Current Status

*Note:* Server-side rendering is supported. It means, if you go to `/src/server/App.jsx` and remove the line `<_script type="application/javascript" src="/bundle.js"></script>`, which loads JS bundle in the page, when you start the App and load any page, you'll still see a properly rendered page (without any interactivity). It means that loading of JS bundle and initialization of ReactJS do not block the proper rendering of the page.

*Setup of this App is not finished yet. Here is a brief summary of current configuration and problems found on the way.*

This App already contains:
- A high-level draft of isomorphic App structure;
- A dummy client App;
- Babel with latest JS support both client- and server-side;
- ESLint (AirBnB style);
- Express server;
- Hot reload of JS code and SCSS styles in dev environment;
- Loading of .svg assets as ReactJS components with babel-plugin-inline-react-svg
- React;
- React CSS Modules (via Babel plugin);
- SASS support;
- Stylelint for scss (standard Stylelint style);
- Webpack;

Pending high-priority staff (these block further development of Submission Management page):
- Development environment is not ready yet;
- Font loading;
- Isomorphic fetch and Topcoder API Auth;
- React Router;
- Redux;

Pending low-priority staff (these are important, but can be added along the way):
- Autoprefixer;
- CircleCI deploys;
- react-css-themr (https://github.com/javivelasco/react-css-themr);
- redux-devtools;
- redux-devtools-log-monitor;
- redux-devtools-dock-monitor;
- StyleFMT;
- Unit testing;
- Webpack Dashboard (https://github.com/FormidableLabs/webpack-dashboard);
