import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TrackCards from 'containers/EDU/partials/TrackCards';

const EXPECTED_SELECT = [
  'sys.id',
  'sys.type',
  'fields.externalArticle',
  'fields.contentUrl',
  'fields.slug',
  'fields.title',
  'fields.tags',
  'fields.readTime',
  'fields.creationDate',
  'fields.upvotes',
  'fields.commentsCount',
  'fields.featuredImage',
  'fields.contentAuthor',
  'fields.file',
].join(',');

test('selects only fields required by EDU track cards and their assets', () => {
  const renderer = new Renderer();
  renderer.render(<TrackCards track="Development" theme={{ trackCards: 'cards' }} />);

  expect(renderer.getRenderOutput().props.entryQueries).toEqual({
    content_type: 'article',
    'fields.trackCategory': 'Development',
    limit: 3,
    order: '-sys.createdAt',
    select: EXPECTED_SELECT,
  });
});

test('passes a projected article and resolved Asset file to Article small', () => {
  const trackCardsRenderer = new Renderer();
  trackCardsRenderer.render(
    <TrackCards track="Development" theme={{ trackCards: 'cards' }} />,
  );
  const trackCardsLoader = trackCardsRenderer.getRenderOutput();
  const article = {
    fields: {
      commentsCount: 2,
      contentAuthor: [{ sys: { id: 'author-id', linkType: 'Entry', type: 'Link' } }],
      creationDate: '2026-08-12',
      featuredImage: { sys: { id: 'asset-id', linkType: 'Asset', type: 'Link' } },
      readTime: '5 min',
      slug: 'projected-article',
      tags: ['Payload'],
      title: 'Projected article',
      upvotes: 3,
    },
    sys: { id: 'article-id', type: 'Entry' },
  };
  const cards = trackCardsLoader.props.render({
    entries: { items: { 'article-id': article } },
  });

  const articleLoaderRenderer = new Renderer();
  articleLoaderRenderer.render(cards.props.children[0]);
  const articleLoader = articleLoaderRenderer.getRenderOutput();
  expect(articleLoader.props.entryIds).toBe('article-id');

  const articleAssetsRenderer = new Renderer();
  articleAssetsRenderer.render(articleLoader.props.render({
    entries: { items: { 'article-id': article } },
  }));
  const assetLoader = articleAssetsRenderer.getRenderOutput();
  expect(assetLoader.props.assetIds).toBe('asset-id');

  const articleCard = assetLoader.props.render({
    assets: {
      items: {
        'asset-id': {
          fields: {
            file: { url: '//assets.topcoder-dev.com/media/contentful/projected.png' },
          },
        },
      },
    },
  });
  expect(articleCard.props.article.title).toBe('Projected article');
  expect(articleCard.props.featuredImage.file.url)
    .toBe('//assets.topcoder-dev.com/media/contentful/projected.png');
  expect(articleCard.props.themeName).toBe('Article small');
});
