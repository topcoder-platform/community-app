import {
  assertNoRetiredCmsUrls,
  getPayloadAppUrl,
  getPayloadAssetUrl,
} from 'server/services/cms-urls';

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
    expect(() => getPayloadAssetUrl('//images.ctfassets.net/space/asset/image.png'))
      .toThrow('retired provider URL');
    expect(() => assertNoRetiredCmsUrls({
      fields: { body: '![old](https://images.ctfassets.net/space/asset/image.png)' },
    })).toThrow('retired provider URL');
  });

  test.each([
    'https://uat--topcoder.netlify.app/image.png',
    'https://quickedit.octana.io/preview',
  ])('rejects other retired provider URL %s in Payload responses', (url) => {
    expect(() => assertNoRetiredCmsUrls({ fields: { url } }))
      .toThrow('retired provider URL');
  });

  test('accepts unrelated links in CMS content', () => {
    const content = { fields: { contentUrl: 'https://www.topcoder.com/challenges' } };
    expect(assertNoRetiredCmsUrls(content)).toBe(content);
  });
});
