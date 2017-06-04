import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Banner from 'components/tc-communities/Banner';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Banner
      title="iOS"
      text="You’re eager to get started, and we have a bunch of iOS/Swift challenges!"
      imageSrc="/themes/wipro/home/banner.jpg"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <Banner
      title="iOS"
      text="You’re eager to get started, and we have a bunch of iOS/Swift challenges!"
      link={{
        title: 'Compete Now',
        url: '#',
      }}
      imageSrc="/themes/wipro/home/banner.jpg"
      theme={{
        container: 'container',
        content: 'content',
        contentBg: 'contentBg',
        contentInner: 'contentInner',
        title: 'title',
        text: 'text',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
