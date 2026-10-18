import React from 'react';
import { shallow } from 'enzyme';
import { config } from 'topcoder-react-utils';
import RedirectExternalUrlPage from 'components/RedirectExternalUrlPage';
import TermsDetailRoute from 'routes/TermsDetail';

it.each(['0a507fb7-3fe0-402b-b121-1a24af4a9cf1', '20713', 'a/b'])('redirects term %s to Opportunities without mounting signing controls', (termId) => {
  const wrapper = shallow(<TermsDetailRoute
    match={{ params: { termId } }}
    location={{ search: '?source=email', hash: '#agreement' }}
  />);

  expect(wrapper.type()).toBe(RedirectExternalUrlPage);
  expect(wrapper.prop('externalRedirectUrl')).toBe(
    `${config.PLATFORMUI_SITE_URL}/opportunities/terms/detail/${encodeURIComponent(termId)}?source=email#agreement`,
  );
});

it('handles links without query parameters or fragments', () => {
  const wrapper = shallow(<TermsDetailRoute match={{ params: { termId: 'terms' } }} location={{}} />);
  expect(wrapper.prop('externalRedirectUrl')).toBe(`${config.PLATFORMUI_SITE_URL}/opportunities/terms/detail/terms`);
});
