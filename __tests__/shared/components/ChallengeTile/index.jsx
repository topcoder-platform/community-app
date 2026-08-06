import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import ChallengeTile from 'components/ChallengeTile';

import design from './__mocks__/design.json';
import develop from './__mocks__/develop.json';
import marathon from './__mocks__/marathon.json';

const rnd = new Renderer();

it('renders design', () => {
  rnd.render((<ChallengeTile challenge={design[0]} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders develop', () => {
  rnd.render((<ChallengeTile challenge={develop[0]} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

it('renders marathon', () => {
  rnd.render((<ChallengeTile challenge={marathon[0]} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
