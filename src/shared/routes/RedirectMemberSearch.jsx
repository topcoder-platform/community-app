/**
 * The loader of Profile webpack chunks.
 */
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import RedirectExternalUrlPage from '../components/RedirectExternalUrlPage';

export default function RedirectMemberSearch(props) {
  const {
    location: {
      search,
    },
  } = props;

  return (
    <RedirectExternalUrlPage
      externalRedirectUrl={`${config.MEMBER_SEARCH_REDIRECT_URL}${search}`}
    />
  );
}

RedirectMemberSearch.propTypes = {
  location: PT.shape({
    search: PT.string,
  }).isRequired,
};
