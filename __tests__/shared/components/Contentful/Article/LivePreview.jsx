import {
  isThriveLivePreview,
  resolveThriveLivePreviewGraph,
  thriveLivePreviewCmsOrigin,
} from 'components/Contentful/Article/LivePreview';

const link = (linkType, id) => ({ sys: { id, linkType, type: 'Link' } });

describe('Thrive Payload Live Preview bridge', () => {
  test('activates only for the explicit marker and a trusted deployment host', () => {
    expect(isThriveLivePreview('?payloadLivePreview=1')).toBe(true);
    expect(isThriveLivePreview('?payloadLivePreview=0')).toBe(false);
    expect(thriveLivePreviewCmsOrigin('www.topcoder-dev.com'))
      .toBe('https://cms.topcoder-dev.com');
    expect(thriveLivePreviewCmsOrigin('www.topcoder.com'))
      .toBe('https://cms.topcoder.com');
    expect(thriveLivePreviewCmsOrigin('topcoder.example')).toBeNull();
  });

  test('resolves the flat CMS graph for the unchanged Article renderer', () => {
    const preview = resolveThriveLivePreviewGraph({
      assets: [{
        fields: { file: { url: '//assets.topcoder-dev.com/hero.png' } },
        sys: { id: 'hero-id', type: 'Asset' },
      }],
      entries: [
        {
          fields: {
            content: 'Unsaved Markdown',
            contentAuthor: [link('Entry', 'author-id')],
            featuredImage: link('Asset', 'hero-id'),
            title: 'Unsaved title',
          },
          sys: {
            contentType: { sys: { id: 'article' } },
            id: 'article-id',
            type: 'Entry',
          },
        },
        {
          fields: { name: 'Thrive author' },
          sys: {
            contentType: { sys: { id: 'person' } },
            id: 'author-id',
            type: 'Entry',
          },
        },
      ],
      rootId: 'article-id',
    });

    expect(preview.article.fields.contentAuthor[0].fields.name).toBe('Thrive author');
    expect(preview.article.fields.featuredImage.fields.file.url)
      .toBe('//assets.topcoder-dev.com/hero.png');
    expect(preview.subData.entries.items['author-id'].fields.name).toBe('Thrive author');
    expect(preview.subData.assets.items['hero-id'].fields.file.url)
      .toBe('//assets.topcoder-dev.com/hero.png');
  });

  test('rejects a graph whose root is not a Thrive article', () => {
    expect(resolveThriveLivePreviewGraph({
      assets: [],
      entries: [{
        fields: {},
        sys: {
          contentType: { sys: { id: 'page' } },
          id: 'page-id',
          type: 'Entry',
        },
      }],
      rootId: 'page-id',
    })).toBeNull();
  });
});
