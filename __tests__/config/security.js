/* eslint-env jest */

const fs = require('fs');
const nodePath = require('path');

const backupDefaults = require('../../config/backup-default');
const customEnvironmentVariables = require('../../config/custom-environment-variables');
const defaults = require('../../config/default');
const development = require('../../config/development');
const production = require('../../config/production');
const qa = require('../../config/qa');
const testConfig = require('../../config/test');

/**
 * Gets a nested configuration value from a dot-separated path.
 *
 * @param {Object} object configuration object
 * @param {String} path dot-separated configuration path
 * @returns {*} resolved value
 */
function get(object, path) {
  return path.split('.').reduce((value, key) => value && value[key], object);
}

const DEFAULT_CREDENTIAL_PATHS = [
  'LOG_ENTRIES_TOKEN',
  'NEWSLETTER_SIGNUP.COGNITIVE.APIKEY',
  'SEGMENT_IO_API_KEY',
  'SERVER_API_KEY',
  'FILESTACK.API_KEY',
  'SECRET.CONTENTFUL.MANAGEMENT_TOKEN',
  'SECRET.CONTENTFUL.default.master.CDN_API_KEY',
  'SECRET.CONTENTFUL.default.master.PREVIEW_API_KEY',
  'SECRET.CONTENTFUL.EDU.master.CDN_API_KEY',
  'SECRET.CONTENTFUL.EDU.master.PREVIEW_API_KEY',
  'SECRET.CONTENTFUL.zurich.master.CDN_API_KEY',
  'SECRET.CONTENTFUL.zurich.master.PREVIEW_API_KEY',
  'SECRET.CONTENTFUL.topgear.master.CDN_API_KEY',
  'SECRET.CONTENTFUL.topgear.master.PREVIEW_API_KEY',
  'SECRET.CONTENTFUL.comcast.master.CDN_API_KEY',
  'SECRET.CONTENTFUL.comcast.master.PREVIEW_API_KEY',
  'SECRET.MAILCHIMP.default.API_KEY',
  'SECRET.OPEN_EXCHANGE_RATES_KEY',
  'SECRET.TC_M2M.CLIENT_ID',
  'SECRET.TC_M2M.CLIENT_SECRET',
  'SECRET.RECRUITCRM_API_KEY',
  'SECRET.SENDGRID_API_KEY',
  'SECRET.JWT_AUTH.SECRET',
  'SECRET.JWT_AUTH.AUTH_SECRET',
  'SECRET.CHAMELEON_VERIFICATION_SECRET',
  'GSHEETS_API_KEY',
  'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
];

const ENVIRONMENT_CREDENTIAL_PATHS = [
  ['development', development, 'SEGMENT_IO_API_KEY'],
  ['development', development, 'SERVER_API_KEY'],
  ['production', production, 'LOG_ENTRIES_TOKEN'],
  ['production', production, 'SERVER_API_KEY'],
  ['qa', qa, 'SEGMENT_IO_API_KEY'],
  ['qa', qa, 'SERVER_API_KEY'],
  ['test', testConfig, 'SERVER_API_KEY'],
];

describe('credential configuration', () => {
  [
    ['default', defaults],
    ['backup-default', backupDefaults],
  ].forEach(([name, config]) => {
    test(`${name} configuration has no credential fallback values`, () => {
      DEFAULT_CREDENTIAL_PATHS.forEach((path) => {
        expect(get(config, path)).toBe('');
      });
    });
  });

  ENVIRONMENT_CREDENTIAL_PATHS.forEach(([name, config, path]) => {
    test(`${name} configuration leaves ${path} empty`, () => {
      expect(get(config, path)).toBe('');
    });
  });

  test.each(DEFAULT_CREDENTIAL_PATHS)(
    '%s is mapped to an environment variable',
    (path) => {
      expect(get(customEnvironmentVariables, path)).toMatch(/^[A-Z0-9_]+$/);
    },
  );

  test('Docker builds receive only approved build arguments', () => {
    const source = fs.readFileSync(
      nodePath.resolve(__dirname, '../../build.sh'),
      'utf8',
    );
    const buildArguments = [...source.matchAll(/--build-arg\s+["']?([A-Z0-9_]+)/g)]
      .map(match => match[1]);

    expect(buildArguments).toEqual([
      'CDN_URL',
      'CONTENTFUL_CDN_API_KEY',
      'CONTENTFUL_SPACE_ID',
      'NODE_CONFIG_ENV',
    ]);
    expect(source).toContain(
      [
        ': "$',
        '{CONTENTFUL_CDN_API_KEY:?CONTENTFUL_CDN_API_KEY must be set by the build environment}"',
      ].join(''),
    );
    expect(source).toContain(
      [
        ': "$',
        '{CONTENTFUL_SPACE_ID:?CONTENTFUL_SPACE_ID must be set by the build environment}"',
      ].join(''),
    );
  });

  test('runtime image preserves default Contentful delivery build arguments', () => {
    const source = fs.readFileSync(
      nodePath.resolve(__dirname, '../../Dockerfile'),
      'utf8',
    );
    const runtimeMarker = ['FROM $', '{NODE_IMAGE} AS runtime'].join('');
    const runtimeStart = source.indexOf(runtimeMarker);
    const buildStage = source.slice(0, runtimeStart);
    const runtimeStage = source.slice(runtimeStart);
    const contentfulArgumentsStart = runtimeStage.indexOf('ARG CONTENTFUL_CDN_API_KEY');

    expect(runtimeStart).toBeGreaterThan(-1);
    expect(buildStage).not.toContain('CONTENTFUL_CDN_API_KEY');
    expect(buildStage).not.toContain('CONTENTFUL_SPACE_ID');
    expect(contentfulArgumentsStart).toBeGreaterThan(runtimeStage.lastIndexOf('COPY '));
    expect(runtimeStage).toContain('ARG CONTENTFUL_CDN_API_KEY');
    expect(runtimeStage).toContain('ARG CONTENTFUL_SPACE_ID');
    expect(runtimeStage).toContain(
      ['CONTENTFUL_CDN_API_KEY=$', '{CONTENTFUL_CDN_API_KEY}'].join(''),
    );
    expect(runtimeStage).toContain(
      ['CONTENTFUL_SPACE_ID=$', '{CONTENTFUL_SPACE_ID}'].join(''),
    );
  });

  test('JMeter loads M2M credentials from runtime properties', () => {
    const source = fs.readFileSync(
      nodePath.resolve(__dirname, '../../src/test/jmeter/Community-25UV.jmx'),
      'utf8',
    );

    // eslint-disable-next-line no-template-curly-in-string
    expect(source).toContain('${__P(TC_M2M_CLIENT_ID,)}');
    // eslint-disable-next-line no-template-curly-in-string
    expect(source).toContain('${__P(TC_M2M_CLIENT_SECRET,)}');
    expect(source).not.toMatch(
      /name="client_(?:id|secret)"[\s\S]{0,250}Argument\.value">(?!(?:\$\{__P\(|<\/))/,
    );
  });

  test('Segment analytics uses the configured key without a static literal', () => {
    const source = fs.readFileSync(
      nodePath.resolve(__dirname, '../../src/server/index.js'),
      'utf8',
    );

    expect(source).toMatch(
      /analytics\.load\(\$\{serializeJs\(config\.SEGMENT_IO_API_KEY\)\}\);/,
    );
    expect(source).not.toMatch(/analytics\.load\(['"][^'"]+['"]\)/);
  });

  test('API-key authorization fails closed when configuration is empty', () => {
    const source = fs.readFileSync(
      nodePath.resolve(__dirname, '../../src/server/index.js'),
      'utf8',
    );

    expect(source).toMatch(
      /if \(!config\.SERVER_API_KEY\s*\|\|\s*req\.headers\.authorization !==/,
    );
  });
});
