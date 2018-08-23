import React from 'react';
import Renderer from 'react-test-renderer/shallow';

import ExistingLink from 'components/Settings/Profile/ExternalLinks/ExistingLink';

const rnd = new Renderer();
const webLink = { providerType: 'weblink', key: '2222', URL: 'http://www.google.com' };

it('renders existing link of profile setting page correctly', () => {
  rnd.render((<ExistingLink
    link={webLink}
    supportedAccounts={[]}
    onConfirmDeleteLink={() => {}}
  />));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
