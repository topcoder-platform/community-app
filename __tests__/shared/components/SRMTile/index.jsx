import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import SRMTile from 'components/SRMTile';

import srm from './__mocks__/srm.json';

const rnd = new Renderer();

it('renders srm', () => {
  rnd.render((<SRMTile challenge={srm[0]} userId={1234567} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
