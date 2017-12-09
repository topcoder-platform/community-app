/**
 * Auxiliary wrapper around React Hemlet to generate the meta tags we need.
 */

import PT from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

export default function MetaTags({
  description,
  image,
  siteName,
  socialDescription,
  socialTitle,
  title,
  url,
}) {
  const socTitle = socialTitle || title;
  const socDesc = socialDescription || description;
  return (
    <Helmet>
      {/* General tags. */}
      <title>{title}</title>
      <meta property="description" content={description} />

      {/* Twitter cards. */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socTitle} />
      <meta name="twitter:description" content={socDesc} />
      <meta name="twitter:image" content={image} />
      {
        siteName ? (
          <meta name="twitter:site" content={`@${siteName}`} />
        ) : null
      }

      {/* Open Graph data. */}
      <meta property="og:title" content={socTitle} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={socTitle} />
      <meta property="og:description" content={socDesc} />
      {
        siteName ? (<meta property="og:sitename" content={siteName} />) : null
      }
      { url ? (<meta property="og:url" content={url} />) : null }
    </Helmet>
  );
}

MetaTags.defaultProps = {
  image: null,
  siteName: null,
  socialDescription: null,
  socialTitle: null,
  url: null,
};

MetaTags.propTypes = {
  description: PT.string.isRequired,
  image: PT.string,
  siteName: PT.string,
  socialDescription: PT.string,
  socialTitle: PT.string,
  title: PT.string.isRequired,
  url: PT.string,
};
