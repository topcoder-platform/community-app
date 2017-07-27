import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import NewsSection from 'components/tc-communities/NewsSection';

const mockDatas = [
  {
    news: [{
      link: 'http',
      title: 'title',
      description: 'description',
    }],
  }, {

  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  _.forEach(mockDatas, (data) => {
    renderer.render((
      <NewsSection {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
