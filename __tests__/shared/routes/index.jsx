import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

import RoutesTopLevelExamples from 'routes';

test('matches snapshots', () => {
  const cmp = renderer.create(
    <StaticRouter context={{}}>
      <RoutesTopLevelExamples />
    </StaticRouter>,
  );
  expect(cmp.toJSON()).toMatchSnapshot();
});
