/**
 * Renders a YouTube video into a page. Not that it is difficult to embed
 * a YouTube video, but this component makes it even easier, and smooths some
 * corners: like drawing a gray placeholder with a loading indicator while your
 * network communicates with YouTube to get the actual video.
 *
 * Probably, it works out of the box for other video hosting platforms, and
 * also for embeding of other similar objects, but to be on the safe side, lets
 * call it YouTubeVideo for now.
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import qs from 'qs';
import React from 'react';
import ScalableRect from 'components/ScalableRect';

import style from './style.scss';

export default function YouTubeVideo({
  autoplay,
  className,
  showRelatedVideoSuggestions,
  src,
  title,
}) {
  let cl = style.container;
  if (className) cl = `${cl} ${className}`;

  /* update URL parameters */
  const i = src.indexOf('?');

  let url = src;
  if (i !== -1) url = src.substring(0, i);

  // check if the URL has a query string
  let urlQueryStr;
  if (i !== -1 && src.length > i + 1) urlQueryStr = src.substring(i + 1);

  let parsed;
  if (urlQueryStr) {
    // Update the params passed by props while keeping the existing ones
    // See YouTube supported parameters:
    // https://developers.google.com/youtube/player_parameters#Parameters
    parsed = qs.parse(urlQueryStr);
  } else {
    parsed = {};
  }

  // update or add params
  parsed.autoplay = 0;
  if (autoplay) parsed.autoplay = 1;
  parsed.rel = 0;
  if (showRelatedVideoSuggestions) parsed.rel = 1;

  url += `?${qs.stringify(parsed)}`;

  return (
    <ScalableRect className={cl} ratio="16:9">
      <LoadingIndicator theme={{ container: style.loading }} />
      <iframe
        allow="autoplay"
        allowFullScreen
        src={url}
        styleName="video"
        title={title}
      />
    </ScalableRect>
  );
}

YouTubeVideo.defaultProps = {
  autoplay: false,
  className: null,
  showRelatedVideoSuggestions: false,
  title: null,
};

YouTubeVideo.propTypes = {
  autoplay: PT.bool,
  className: PT.string,
  showRelatedVideoSuggestions: PT.bool,
  src: PT.string.isRequired,
  title: PT.string,
};
