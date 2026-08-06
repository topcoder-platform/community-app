/* eslint-env jest */

const { execFileSync } = require('child_process');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '../..');

test('UniNav components render in the plain Node production runtime', () => {
  const script = `
    const React = require('react');
    const ReactDOMServer = require('react-dom/server');
    const { MarketingNavigation, ToolNavigation } = require('uninav-react');

    const components = { MarketingNavigation, ToolNavigation };
    for (const [name, Component] of Object.entries(components)) {
      if (typeof Component !== 'function') {
        throw new TypeError(name + ' is not a React component');
      }
      ReactDOMServer.renderToString(React.createElement(Component, {
        currentLocation: '/',
        toolName: 'Topcoder',
      }));
    }
  `;

  expect(() => execFileSync(process.execPath, ['-e', script], {
    cwd: PROJECT_ROOT,
    env: {
      ...process.env,
      BABEL_ENV: 'production',
      NODE_ENV: 'production',
    },
    stdio: 'pipe',
  })).not.toThrow();
});
