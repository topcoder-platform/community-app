/* eslint-env jest */

const path = require('path');
const { generateScopedName } = require('../../config/css-modules');

test('production CSS module names are valid and match css-loader identifiers', () => {
  const originalBabelEnv = process.env.BABEL_ENV;
  process.env.BABEL_ENV = 'production';

  try {
    const topcoderStyles = path.resolve(
      __dirname,
      '../../src/shared/routes/Topcoder/styles.scss',
    );
    const listingStyles = path.resolve(
      __dirname,
      '../../src/shared/containers/challenge-listing/Listing/styles.scss',
    );

    expect(generateScopedName('container', topcoderStyles)).toBe('_10hiPS');
    expect(generateScopedName('container', listingStyles)).toBe('_3pMa6m');
    expect(generateScopedName('bannerContent', listingStyles)).toBe('JwBbj_');
  } finally {
    if (originalBabelEnv === undefined) delete process.env.BABEL_ENV;
    else process.env.BABEL_ENV = originalBabelEnv;
  }
});
