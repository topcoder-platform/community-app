/* eslint-env jest */

const crypto = require('crypto');
const fs = require('fs');
const forge = require('node-forge');

jest.unmock('webpack');

const createWebpackConfig = require('../../config/webpack/create');

describe('webpack build information', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('generates a raw 32-byte key accepted by the renderer cipher', () => {
    const bytes = [
      0, 10, 13, 34, 92, 255,
      ...Array.from({ length: 26 }, (_, index) => index + 128),
    ];
    jest.spyOn(crypto, 'randomBytes').mockReturnValue(Buffer.from(bytes));
    const writeFile = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

    const webpackConfig = createWebpackConfig('production');

    const buildInfo = JSON.parse(writeFile.mock.calls[0][1]);
    const definePlugin = webpackConfig.plugins.find(plugin => (
      plugin.definitions && plugin.definitions.BUILD_INFO
    ));
    const clientBuildInfo = JSON.parse(definePlugin.definitions.BUILD_INFO);
    expect(buildInfo.key).toHaveLength(32);
    expect([...buildInfo.key].map(character => character.charCodeAt(0))).toEqual(bytes);
    expect(clientBuildInfo.key).toBe(buildInfo.key);
    expect(() => forge.cipher.createCipher('AES-CBC', buildInfo.key)).not.toThrow();
    expect(() => forge.cipher.createDecipher('AES-CBC', clientBuildInfo.key)).not.toThrow();
  });
});
