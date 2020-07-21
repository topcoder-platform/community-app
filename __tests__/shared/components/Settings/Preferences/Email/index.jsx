import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import Email from 'components/Settings/Preferences/Email';

const rnd = new Renderer();

it('renders email preferences setting page correctly', () => {
  rnd.render((<Email email="test@test.com" preferences={[]} />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
