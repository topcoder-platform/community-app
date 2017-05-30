import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router-dom';

import Examples from 'routes/examples';

test('matches snapshots', () => {
  const cmp = renderer.create(
    <StaticRouter context={{}}>
      <Examples />
    </StaticRouter>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});
