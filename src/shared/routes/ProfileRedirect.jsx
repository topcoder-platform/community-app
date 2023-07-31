/**
 * The loader of Profile webpack chunks.
 */
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import RedirectExternalUrlPage from '../components/RedirectExternalUrlPage';

export default function ProfileRedirect(props) {
  const {
    match: {
      params: { handle },
    },
  } = props;
  return (
    <RedirectExternalUrlPage
      externalRedirectUrl={handle ? `${config.MEMBER_PROFILE_REDIRECT_URL}/${handle}` : null}
    />
  );
}

ProfileRedirect.propTypes = {
  match: PT.shape({
    params: PT.shape({
      handle: PT.string,
    }),
  }).isRequired,
};
