![Dev Build Status](https://img.shields.io/circleci/project/github/topcoder-platform/community-app/develop.svg?label=develop)
![Master Build Status](https://img.shields.io/circleci/project/github/topcoder-platform/community-app/master.svg?label=master)

# Topcoder Community App
New version of Topcoder Community website.

### Knowledgebase
-   [CDN: User Avatars](docs/cdn-user-avatars.md)
-   [Code Splitting](docs/code-splitting.md)
-   [Coding Standards](docs/coding-standards.md)
-   [Dashboard Announcements](docs/dashboard-announcements.md)
-   [How to Add a New Topcoder Community?](docs/how-to-add-a-new-topcoder-community.md)
-   [How To Deep-Link (Correct Use of URL Query Params Within The App)](docs/how-to-deep-link.md)
-   [Mocking Terms for Testing and Development](docs/mocking-terms.md)
-   [Why Reducer Factories and How to Use Them?](docs/why-reducer-factories-and-how-to-use-them.md)

### Misc Development Notes

-   [Challenge Listing - Notes from winning submission](docs/challenge-listing-notes.md)
-   [Leaderboard - Notes from the winning submission](docs/leaderboard-notes.md)

### .exchange-rates.cache

Often you may note that the file named `.exchange-rates.cache`, located in the root folder of the app, got updated without you touching it. In such case, please, don't hesitate to keep and commit its updated version. It is a cache of real-world currency exchange rates. Keeping it up-to-date, and preserving between restarts of the app (no matter in which mode) saves a lot of calls to [https://openexchangerates.com](https://openexchangerates.com), thus allowing us to stay within the limits of their free plan.

In case of merge conflicts, just commit the version of cache file that has a more recent `timestamp` among its data fields.

If you need any operations related to currency conversions, pay attention to the `/src/shared/services/money.js` service.

### Deployment and Execution

*Disclaimer:* Current instructions are biased towards Ubuntu 16.04. Hovewer, similar recipes should work for other OS. Should you encounter and overcome any tricky issues on other OS, you are welcome to add notes/hints into this file.

1.  You should have the following prerequisites:
    - NodeJS 8.2.1 (other recent versions should also work fine);
    - Python 2.7.

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
    -   `NODE_CONFIG_ENV` Specifies Topcoder backend to use. Should be either `development` or `production`. Defaults to `production`.

5.  To build the App's frontend run one of (the result of build will be output into `/build` folder in both cases):
    -   `$ npm run build` To rebuild production frontend;
    -   `$ npm run build:dev` This command should only be used to test whether development build of the front end works. You don't have to execute this command to run development version of the App (the server will automatically build frontend in memory anyway). You can't successfully execute this command without installing dev dependencies.

6. To run the App use:
    -   `$ npm start` To run the App in normal mode. The frontend will be served from `/build` folder. The Topcoder backend to use will be chosen depending on `NODE_CONFIG_ENV` value;
    -   `$ npm run dev` To run the App with development tools. In this case the frontend is build in memory by server and uses dev tools like redux-devtools. The Topcoder backend to use will be chosen depending on `NODE_CONFIG_ENV` value. This demands dev dependencies installed at the first step.

If you run the App locally against development Topcoder backend you should access the App as `local.topcoder-dev.com:3000`. Prior doing this you should add into your `/etc/hosts` the line `127.0.0.1 local.topcoder-dev.com`. To login into development Topcoder backend use `accounts.topcoder-dev.com/members` to login. Log out at `www.topcoder-dev.com`, or just wipe out auth cookies.

If you run the App locally against production Topcoder backend you should run it at the port 80 and access the App as `local.topcoder.com`. Prior doing this you should add into your `/etc/hosts` the line `127.0.0.1 local.topcoder.com`. The easiest way to allow the App to listen at the port 80 on Ubuntu 16.04 is (no guarantees, how safe is it):
- `$ sudo apt install libcap2-bin`;
- `$ which node` to figure out your `path/to/node`;
- `$ sudo setcap cap_net_bind_service=+ep /path/to/node`;
- Now you can run the App.
To login into production Topcoder backend use `accounts.topcoder.com/members` with your regular account, and to logout you can just wipe out cookies, or just log out at `www.topcoder.com`.

Development dependencies include StyleFMT. You can execute
`$ npm run lint:scss -- --fix` to automatically correct you stylesheets to
comply with Stylelint rules (but it can fail for some rules).
To automatically correct js files, you can use `npm run lint:js -- --fix`.

### Accessing Wipro Community

Access to Wipro community demands proper authorization. In development environment (both local and remote) the test user `dan_developer / dantopcoder123` is authorized to access this community.

It is intended that Wipro community is accessed as `wipro.topcoder-dev.com` in dev (both local and remote) and `wipro.topcoder.com` in prod. Thus, to deploy it locally you should have in your `/etc/hosts` the alias `127.0.0.1 wipro.topcoder-dev.com`, and run the app with the command `NODE_CONFIG_ENV=development PORT=80 npm run dev`. Take into account the following:

1.  To run the App at port 80 you may need extra configuration (see in the end of the previous section);

2.  Once you have added this alias to your `/etc/hosts`, it is extremely easy to forget about it and to be totally confused when failing to access the remotely deployed dev version of the App (because `wipro.topcoder-dev.com` is used in both places). ***Thus we recommend to comment out this alias in `/etc/hosts` whenever you don't need it!!!*** Technically, it makes total sense just to run the local dev version of the App at, say, `local.wipro.topcoder-dev.com:3000`, and the code does support it... the problem is that, as of now, Topcoder's `accounts-app` does not allow to authenticated from such subdomain/port, thus you won't be permitted to access.

3.  As of now, this community can be also rapidly accessed at `local.topcoder-dev.com/community/wipro/`. It should be fine to use it during development, just keep in mind that you should use relative links to navigate inside the community, as our primary goal is to ensure it is properly funcional at `wipro.topcoder-dev.com`.

### Configuration for *logentries.com*

We use [https://logentries.com](https://logentries.com) to track the logs. Log Entries API token should be provided via the `LOG_ENTRIES_TOKEN` environment variable, which will override the default values set in `/config/default.json` (sample account for local setup testing), and in `/config/production.json` (empty token) - with empty token Log Entries will not be used.

### Configuration for Scoreboard API

Change the property in `URL.COMMUNITY_API` in config.

### TC pages integrated

- Changes list and challenge detail page: http://local.topcoder.com/challenges
- Member profile page: http://local.topcoder.com/members/TonyJ
- Dashboard page: http://local.topcoder.com/my-dashboard
- Settings page: http://local.topcoder.com/settings/profile
- Community page: http://local.topcoder.com/community/blockchain
- TCO hall of fame page: http://local.topcoder.com/hall-of-fame/tco

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
- [react-css-super-themr](https://github.com/birdofpreyru/react-css-super-themr);
- React Router;
- Redux with Flux Standard Actions, redux-promise middleware, support of server-side rendering, and DevTools for dev environment;
- SCSS support;
- CSS support for third party modules;
- StyleFMT;
- Stylelint for scss (standard Stylelint style);
- Unit testing with Jest;
- Various examples;
- Webpack;

Pending low-priority stuff (these are important, but can be added along the way):
- Webpack Dashboard (https://github.com/FormidableLabs/webpack-dashboard);



### CI / CD

Deploy scripts are setup to use AWS ECS + CircleCI. Make sure the following environment variables are setup in CircleCI:
* AWS_ECS_SERVICE
* AWS_REPOSITORY
* DEV_AWS_ACCESS_KEY_ID
* DEV_AWS_ACCOUNT_ID
* DEV_AWS_ECS_CLUSTER
* DEV_AWS_REGION
* DEV_AWS_SECRET_ACCESS_KEY
* DEV_SERVER_API_KEY
* DEV_AUTH0_CLIENT_ID
* PROD_AWS_ACCESS_KEY_ID
* PROD_AWS_ACCOUNT_ID
* PROD_AWS_ECS_CLUSTER
* PROD_AWS_REGION
* PROD_AWS_SECRET_ACCESS_KEY
* PROD_SERVER_API_KEY
* PROD_AUTH0_CLIENT_ID

