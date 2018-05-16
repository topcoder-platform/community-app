/**
 * Renders a YouTube video into a page. Not that it is difficult to embed
 * a YouTube video, but this component makes it even easier, and smooths some
 * corners: like drawing a gray placeholder with a loading indicator while your
 * network communicates with YouTube to get the actual video.
 *
 * It also supports custom video thumb / play button.
 * There are also several properties to control youtube video player:
 * `autoplay`, `controls`, `rel`, `showinfo` see details at https://developers.google.com/youtube/player_parameters
 */

import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import ScalableRect from 'components/ScalableRect';
import YouTube from 'react-youtube';

import style from './style.scss';

class YouTubeVideo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showThumb: !!props.thumb,
    };

    this.onThumbClick = this.onThumbClick.bind(this);
    this.onVideoReady = this.onVideoReady.bind(this);
  }

  onThumbClick() {
    this.setState({
      showThumb: false,
    });
    if (this.player) {
      this.player.playVideo();
    }
  }

  onVideoReady(event) {
    this.player = event.target;
  }

  render() {
    const {
      autoplay,
      className,
      controls,
      thumb,
      rel,
      showinfo,
      src,
      title,
    } = this.props;

    const { showThumb } = this.state;

    let cl = style.container;
    if (className) cl = `${cl} ${className}`;

    const videoIdMatch = src.match(/\/\/www\.youtube\.com\/embed\/([^/?]+)/);
    if (!videoIdMatch) {
      return null;
    }
    const [, videoId] = videoIdMatch;

    return (
      <ScalableRect className={cl} ratio="16:9">
        <LoadingIndicator theme={{ container: style.loading }} />
        <YouTube
          className={style.video}
          videoId={videoId}
          opts={{
            playerVars: {
              autoplay: autoplay ? 1 : 0,
              controls: controls ? 1 : 0,
              rel: rel ? 1 : 0,
              showinfo: showinfo ? 1 : 0,
            },
          }}
          onReady={this.onVideoReady}
          title={title}
        />
        {showThumb && <div onClick={this.onThumbClick} role="presentation">{thumb}</div>}
      </ScalableRect>
    );
  }
}

YouTubeVideo.defaultProps = {
  autoplay: false,
  className: null,
  controls: true,
  thumb: null,
  rel: true,
  showinfo: true,
  title: null,
};

YouTubeVideo.propTypes = {
  autoplay: PT.bool,
  className: PT.string,
  controls: PT.bool,
  thumb: PT.node,
  rel: PT.bool,
  showinfo: PT.bool,
  src: PT.string.isRequired,
  title: PT.string,
};

export default YouTubeVideo;
