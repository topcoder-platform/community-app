# Topcoder Community App
New version of Topcoder Community website.

### Deployment and Execution

*Disclaimer:* Current instructions are biased towards Ubuntu 16.04. Hovewer, similar recipies should work for other OS. Should you encounter and overcome any tricky issues on other OS, you are welcome to add notes/hints into this file.

1.  You should have NodeJS 6.10.0 (other recent versions should also work fine);

2.  Install dependencies with one of the following commands:
    -   `$ npm install` Installs all dependencies. Recommended for local development;
    -   `$ npm install --production` Installs only production dependencies. These include all you need to run linters & unit tests, to build & run production version of the App. Does not include additional development tools.

3.  Run linters and unit tests with following commands:
    -   `$ npm run lint:js` Runs ESLint (AirBnB style);
    -   `$ npm run lint:scss` Runs Stylelint (standard Stylelint style);
    -   `$ npm run lint` Runs both ESLint and Stylelint;
    -   `$ npm run jest` Runs unit tests;
    -   `$ npm run jest -- -u` Runs unit test with update of component snapshots;
    -   `$ npm test` Runs ESLint, Stylelint and unit tests.

4.  Set environment variables:
    -   `PORT` Specifies the port to run the App at. Defaults to 3000;
    -   `NODE_ENV` Specifies Topcoder backend to use. Should be either `development` either `production`. Defaults to `production`.

5.  To rebuild the App's frontend (initially, it is automatically build as a part of the install step) run one of (the result of build will be output into `/build` folder in both cases):
    -   `$ npm run build` To rebuild production frontend;
    -   `$ npm run build:dev` This command should only be used to test whether development build of the front end works. You don't have to execute this command to run development version of the App (the server will automatically build frontend in memory anyway). You can't successfully execute this command without installing dev dependencies.

6. To run the App use:
    -   `$ npm start` To run the App in normal mode. The frontend will be served from `/build` folder. The Topcoder backend to use will be chosen depending on `NODE_ENV` value;
    -   `$ npm run dev` To run the App with development tools. In this case the frontend is build in memory by server and uses dev tools like redux-devtools. The Topcoder backend to use will be chosen depending on `NODE_ENV` value. This demands dev dependencies installed at the firts step.

If you run the App locally against development Topcoder backend you should access the App as `local.topcoder-dev.com:3000`. Prior doing this you should add into your `/etc/hosts` the line `127.0.0.1 local.topcoder-dev.com:3000`. To login into development Topcoder backend use `accounts.topcoder-dev.com/members` to login. Log out at `www.topcoder-dev.com`, or just wipe out auth cookies.

If you run the App locally against production Topcoder backend you should run it at the port 80 and access the App as `local.topcoder.com`. Prior doing this you should add into your `/etc/hosts` the line `127.0.0.1 local.topcoder.com`. The easiest way to allow the App to listen at the port 80 on Ubuntu 16.04 is (no guarantees, how safe is it):
- `$ sudo apt install libcap2-bin`;
- `$ which node` to figure out your `path/to/node`;
- `$ sudo setcap cap_net_bind_service=+ep /path/to/node`;
- Now you can run the App.
To login into production Topcoder backend use `accounts.topcoder.com/members` with your regular account, and to logout you can just wipe out cookies, or just log out at `www.topcoder.com`.

Development dependencies include StyleFMT. You can execute `$ npm run fix:styles` to automatically correct you stylesheets to comply with Stylelint rules (but it can fail for some rules).
To automatically correct js files, you can use `npm run fix:js`.

### Development Notes

-   [Challenge Listing - Notes from Winning Submission](docs/challenge-listing-notes.md)
-   [Why Reducer Factories and How to Use Them?](docs/why-reducer-factories-and-how-to-use-them.md)

### Current Status

*Note:* Server-side rendering is supported. It means, if you go to `/src/server/App.jsx` and remove the line `<_script type="application/javascript" src="/bundle.js"></script>`, which loads JS bundle in the page, when you start the App and load any page, you'll still see a properly rendered page (without any interactivity). It means that loading of JS bundle and initialization of ReactJS do not block the proper rendering of the page.

*Setup of this App is not finished yet. Here is a brief summary of current configuration and problems found on the way.*

This App already contains:
- A high-level draft of isomorphic App structure;
- A dummy client App;
- A set of general Topcoder stylesheets in `/src/styles`;
- Autoprefixer;
- Babel with latest JS support both client- and server-side;
- ESLint (AirBnB style);
- Express server;
- Font loading (Roboto fonts are included into the repo);
- Hot Module Replacement for JS code and SCSS styles in dev environment;
- Isomorphic fetch and Topcoder API Auth;
- Loading of .svg assets as ReactJS components with babel-plugin-inline-react-svg
- Node-Config;
- React;
- React CSS Modules (via Babel plugin);
- React Router;
- Redux with Flux Standard Actions, redux-promise middleware, support of server-side rendering, and DevTools for dev environment;
- SCSS support;
- CSS support for third party modules;
- StyleFMT;
- Stylelint for scss (standard Stylelint style);
- Unit testing with Jest;
- Various examples;
- Webpack;

Pending low-priority staff (these are important, but can be added along the way):
- CircleCI deploys;
- react-css-themr (https://github.com/javivelasco/react-css-themr);
- Webpack Dashboard (https://github.com/FormidableLabs/webpack-dashboard);
