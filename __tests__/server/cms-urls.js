import {
  assertNoRetiredCmsUrls,
  getPayloadAppUrl,
  getPayloadAssetUrl,
} from 'server/services/cms-urls';

const RETIRED_HOSTS = [
  ['cdn.', 'content', 'ful.com'].join(''),
  ['images.', 'ctf', 'assets.net'].join(''),
  ['preview--topcoder.', 'net', 'lify.app'].join(''),
  ['deploy-preview.', 'net', 'lify.com'].join(''),
  ['assets.', 'net', 'lifyusercontent.com'].join(''),
  ['quickedit.', 'oct', 'ana.io'].join(''),
];
const RETIRED_ASSET_HOST = RETIRED_HOSTS[1];
const RETIRED_ASSET_URL = `https://${RETIRED_ASSET_HOST}/space/asset/image.png`;

describe('server/services/cms-urls', () => {
  test('uses the configured Topcoder Payload application origin', () => {
    expect(getPayloadAppUrl()).toBe('https://cms.topcoder-dev.com');
  });

  test('allows only the configured S3-backed asset origin', () => {
    expect(getPayloadAssetUrl('//assets.topcoder-dev.com/media/contentful/image.png'))
      .toBe('https://assets.topcoder-dev.com/media/contentful/image.png');
    expect(() => getPayloadAssetUrl('https://example.com/image.png'))
      .toThrow('outside PAYLOAD_CMS_ASSET_URL');
  });

  test('rejects retired provider URLs in Asset records and rich text', () => {
    expect(() => getPayloadAssetUrl(`//${RETIRED_ASSET_HOST}/space/asset/image.png`))
      .toThrow('retired provider URL');
    expect(() => assertNoRetiredCmsUrls({
      fields: { body: `![old](${RETIRED_ASSET_URL})` },
    })).toThrow('retired provider URL');
  });

  test.each(RETIRED_HOSTS.map(host => `https://${host}/provider-resource`))(
    'rejects direct retired provider URL %s',
    (url) => {
      expect(() => assertNoRetiredCmsUrls({ fields: { url } }))
        .toThrow('retired provider URL');
    },
  );

  test.each(RETIRED_HOSTS.map(host => `//${host}/provider-resource`))(
    'rejects protocol-relative retired provider URL %s',
    (url) => {
      expect(() => assertNoRetiredCmsUrls({ fields: { url } }))
        .toThrow('retired provider URL');
    },
  );

  test.each([
    `https://player.example.test/embed?source=${RETIRED_ASSET_URL}`,
    `https://player.example.test/embed?source=${encodeURIComponent(RETIRED_ASSET_URL)}`,
    encodeURIComponent(RETIRED_ASSET_URL),
    encodeURIComponent(encodeURIComponent(encodeURIComponent(RETIRED_ASSET_URL))),
    `%ZZ&target=${encodeURIComponent(RETIRED_ASSET_URL)}`,
    `https:\\/\\/${RETIRED_ASSET_HOST}/json-escaped.png`,
    'https:\\u002f\\u002fimages\\u002ectfassets\\u002enet/unicode-escaped.png',
    'https:\\x2f\\x2fimages\\x2ectfassets\\x2enet/hex-escaped.png',
    `https&colon;&sol;&sol;${RETIRED_ASSET_HOST}/named-entities.png`,
    'https:&#47;&#47;images&#46;ctfassets&#46;net/numeric-entities.png',
    'https://images%E3%80%82ctfassets%E3%80%82net/unicode-dots.png',
  ])('rejects an encoded or nested retired provider reference %s', (url) => {
    expect(() => assertNoRetiredCmsUrls({ fields: { url } }))
      .toThrow('retired provider URL');
  });

  test('rejects retired provider URLs used as compatibility response keys', () => {
    expect(() => assertNoRetiredCmsUrls({ [RETIRED_ASSET_URL]: 'legacy asset' }))
      .toThrow('retired provider URL');
  });

  test('accepts unrelated links, historical names, and owned media provenance', () => {
    const content = {
      fields: {
        contentUrl: 'https://www.topcoder.com/challenges',
        history: 'Contentful, Netlify, and Octana are historical provider names.',
        migratedAsset: `https://assets.topcoder-dev.com/media/contentful/${RETIRED_ASSET_HOST}/image.png`,
        nestedMediaKey: `https://assets.topcoder-dev.com/media/contentful//${RETIRED_ASSET_HOST}/image.png`,
        provenance: `provenance/${RETIRED_ASSET_HOST}/image.png`,
      },
    };
    expect(assertNoRetiredCmsUrls(content)).toBe(content);
  });
});
