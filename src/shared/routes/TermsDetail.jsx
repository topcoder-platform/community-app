/**
 * Redirects legacy direct terms links to the Opportunities signing flow.
 */
import React from 'react';
import PT from 'prop-types';
import { config } from 'topcoder-react-utils';
import RedirectExternalUrlPage from 'components/RedirectExternalUrlPage';

/**
 * Sends public and authenticated visitors to Platform UI instead of mounting
 * Community App's electronic acceptance or DocuSign controls.
 *
 * @param {Object} props Router match and location for the original terms link.
 * @returns {React.Element} Browser/SSR redirect preserving the term, query, and fragment.
 * @throws Does not throw for valid router props.
 */
export default function TermsDetailRoute(props) {
  const { match: { params: { termId } }, location: { search = '', hash = '' } } = props;
  const base = config.PLATFORMUI_SITE_URL.replace(/\/$/, '');
  return (
    <RedirectExternalUrlPage
      externalRedirectUrl={`${base}/opportunities/terms/detail/${encodeURIComponent(termId)}${search}${hash}`}
    />
  );
}

TermsDetailRoute.propTypes = {
  match: PT.shape({ params: PT.shape({ termId: PT.string.isRequired }).isRequired }).isRequired,
  location: PT.shape({ search: PT.string, hash: PT.string }).isRequired,
};
