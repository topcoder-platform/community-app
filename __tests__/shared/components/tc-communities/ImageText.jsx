import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import ImageText from 'components/tc-communities/ImageText';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <ImageText
      title="Learn"
      text="You can learn and get certified donec facilisis tortor ut augue lacinia"
      imageSrc="/themes/wipro2/home/image-text-learn.jpg"
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <ImageText
      title="Learn"
      text="You can learn and get certified donec facilisis tortor ut augue lacinia"
      link={{
        title: 'Start Learning',
        url: '#',
      }}
      imageSrc="/themes/wipro2/home/image-text-learn.jpg"
      theme={{
        container: 'container',
        image: 'image',
        content: 'content',
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
