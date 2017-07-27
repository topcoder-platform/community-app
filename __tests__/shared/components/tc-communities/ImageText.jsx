import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ImageText from 'components/tc-communities/ImageText';

test('Matches shallow snapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <ImageText
      title="Learn"
      text="You can learn and get certified donec facilisis tortor ut augue lacinia"
      imageSrc="/themes/wipro/home/image-text-learn.jpg"
    />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
