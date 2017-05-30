import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import ArticleCard from 'components/tc-communities/ArticleCard';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <ArticleCard
      title="How Does An IOS 10 LCD Work"
      text="There are advances being made in science and technology everyday"
      imageSrc="/themes/wipro2/home/news-01.jpg"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ArticleCard
      title="How Does An IOS 10 LCD Work"
      text="There are advances being made in science and technology everyday"
      imageSrc="/themes/wipro2/home/news-01.jpg"
      link={{
        title: 'Read More',
        url: '#',
      }}
      theme={{
        container: 'container',
        image: 'image',
        content: 'content',
        title: 'title',
        text: 'text',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
