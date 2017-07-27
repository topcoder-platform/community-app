import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import PastSRMCard from 'components/challenge-listing/SRMCard/PastSRMCard';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <PastSRMCard />
  ));
});

