import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TrackIcon from 'components/TrackIcon';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <TrackIcon track="DEVELOP" subTrack="CODE" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <TrackIcon track="DEVELOP" subTrack="CODE" isDataScience tcoEligible="yes" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <TrackIcon track="DEVELOP" subTrack="CODE" isDataScience={false} tcoEligible="yes" />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
