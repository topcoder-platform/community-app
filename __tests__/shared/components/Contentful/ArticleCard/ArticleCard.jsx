import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ArticleCardInner from 'components/Contentful/ArticleCard/ArticleCard';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  const MOCK_PROPS = {
    id: '1',
    article: {
      title: 'Lorem ipsum',
      content: 'Some words',
      tags: ['TCO'],
      readTime: '5 min read',
      creationDate: '2018-12-25',
      upvotes: undefined,
      commentsCount: undefined,
    },
    articleCard: {},
    contentAuthor: null,
    featuredImage: null,
    theme: {},
    themeName: 'Article large',
  };
  renderer.render(<ArticleCardInner {...MOCK_PROPS} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
