import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TrackIcon from 'components/TrackIcon';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  const type = {
    name: 'Challenge',
    abbreviation: 'CH',
  };

  renderer.render((
    <TrackIcon track="Development" type={type} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <TrackIcon track="Development" type={type} isDataScience tcoEligible="yes" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <TrackIcon track="Development" type={type} isDataScience={false} tcoEligible="yes" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
