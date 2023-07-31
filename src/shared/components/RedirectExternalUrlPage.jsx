import React from 'react';
import PT from 'prop-types';
import { Helmet } from 'react-helmet';

export default function RedirectExternalUrlPage(props) {
  const { externalRedirectUrl } = props;
  if (typeof window !== 'undefined' && externalRedirectUrl) {
    window.location.replace(externalRedirectUrl);
  }
  if (!externalRedirectUrl) {
    return null;
  }
  return (
    <Helmet>
      <meta httpEquiv="Refresh" content={`0; url='${externalRedirectUrl}'`} />
    </Helmet>
  );
}

RedirectExternalUrlPage.propTypes = {
  externalRedirectUrl: PT.string.isRequired,
};
