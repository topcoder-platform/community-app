# Topcoder Community App
New version of Topcoder Community website.

# Deployment amd Execution

*Disclaimer:* Current instructions are biased towards Ubuntu 16.04. Hovewer, similar recipies should work for other OS. Should you encounter and overcome any tricky issues on other OS, you are welcome to add notes/hints into this file.

In all cases, you need NodeJS 6.10.0 (other recent version should also work fine), and you should install dependencies by executing `$ npm install` in the root of this repo.

To run development build of the App against development Topcoder backend do `$ npm run dev` and access website as `local.topcoder-dev.com:3000`. Prior doing this you should add into your `/etc/hosts` the line `127.0.0.1 local.topcoder-dev.com:3000`. In this case you'll have all development bells and whistles enabled, like Redux DevTools, hot module reloading, etc. To access pages which need Topcoder authentication use `accounts.topcoder-dev.com/members` to login, and just wipe out your cookies for the page to log out.

To run production build of the App against production Topcoder backend do `$ npm run build` to build the bundle, then `$ npm start` to run the server. In this case you should access the site as `local.topcoder.com`. Prior doing this you should add into your `/etc/hosts` the line `127.0.0.1 local.topcoder.com`. You should also allow the App to listen on the port 80. The easiest way to do it on Ubuntu 16.04 is (no guarantees, how safe is it):
- `$ sudo apt install libcap2-bin`;
- `$ which node` to figure out your `path/to/node`;
- `$ sudo setcap cap_net_bind_service=+ep /path/to/node`;
- Now you can run the App.
To login in Topcoder you should use `accounts.topcoder.com/members` with your regular account, and to logout you can just wipe out cookies, or just log out at `www.topcoder.com`.

You can also run development build of the frontend against production backend:
```
$ npm run build:dev
$ npm start
```
In this case you still should follow all notes for the production build/run, stated just above.

# Current Status

*Note:* Server-side rendering is supported. It means, if you go to `/src/server/App.jsx` and remove the line `<_script type="application/javascript" src="/bundle.js"></script>`, which loads JS bundle in the page, when you start the App and load any page, you'll still see a properly rendered page (without any interactivity). It means that loading of JS bundle and initialization of ReactJS do not block the proper rendering of the page.

*Setup of this App is not finished yet. Here is a brief summary of current configuration and problems found on the way.*

This App already contains:
- A high-level draft of isomorphic App structure;
- A dummy client App;
- A set of general Topcoder stylesheets in `/src/styles`;
- Babel with latest JS support both client- and server-side;
- ESLint (AirBnB style);
- Express server;
- Hot reload of JS code and SCSS styles in dev environment;
- Isomorphic fetch and Topcoder API Auth;
- Loading of .svg assets as ReactJS components with babel-plugin-inline-react-svg
- Node-Config;
- React;
- React CSS Modules (via Babel plugin);
- React Router;
- Redux with Flux Standard Actions, redux-promise middleware, support of server-side rendering, and DevTools for dev environment;
- SCSS support;
- Stylelint for scss (standard Stylelint style);
- Various examples;
- Webpack;

Pending high-priority staff (these block further development of Submission Management page):
- Font loading;

Pending low-priority staff (these are important, but can be added along the way):
- Autoprefixer;
- CircleCI deploys;
- react-css-themr (https://github.com/javivelasco/react-css-themr);
- StyleFMT;
- Unit testing;
- Webpack Dashboard (https://github.com/FormidableLabs/webpack-dashboard);
