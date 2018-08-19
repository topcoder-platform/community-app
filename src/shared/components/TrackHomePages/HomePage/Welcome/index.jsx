/**
 * Welcome component.
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import YouTubeVideo from 'components/YouTubeVideo';
import { PrimaryButton, Button } from 'topcoder-react-ui-kit';

import './styles.scss';

const converter = new showdown.Converter();

const Welcome = ({ data }) => (
  <div styleName="container">
    <div styleName="left">
      <h1>
        {data.title}
      </h1>
      <div
        styleName="text"
        dangerouslySetInnerHTML={
          { __html: converter.makeHtml(data.text) }
        }
      />
      <div styleName="button-register">
        <Button styleName="register" to={data.primaryButton.URL} openNewTab>
          {data.primaryButton.text}
        </Button>
      </div>
      <div styleName="button-complete">
        <PrimaryButton styleName="complete" to={`/community/${data.track}/how-to-compete`}>
How To Compete
        </PrimaryButton>
      </div>
      <div
        styleName="text"
        dangerouslySetInnerHTML={
          { __html: converter.makeHtml(data.footerText) }
        }
      />
    </div>
    <div styleName="right">
      {
        data.media.file.contentType === 'video/mp4' ? (
          <YouTubeVideo
            src={data.media.file.url}
            rel={false}
            showinfo={false}
            videoId="HU2xr_wjR3s"
            thumb={<div styleName="videoPlayButton" />}
          />) : (
            <img src={data.media.file.url} alt={data.media.file.url} />
        )
      }
    </div>
    <h1 styleName="mobile">
      {data.title}
    </h1>
    <div styleName="video-mobile">
      {
        data.media.file.contentType === 'video/mp4' ? (
          <YouTubeVideo
            src={data.media.file.url}
            rel={false}
            showinfo={false}
            videoId="HU2xr_wjR3s"
            thumb={<div styleName="videoPlayButton" />}
          />) : (
            <img src={data.media.file.url} alt={data.media.file.url} />
        )
      }
    </div>
    <div
      styleName="text-mobile"
      dangerouslySetInnerHTML={
        { __html: converter.makeHtml(data.text) }
      }
    />
    <div styleName="button-register-mobile">
      <Button styleName="register" to={data.primaryButton.URL} openNewTab>
        {data.primaryButton.text}
      </Button>
    </div>
    <div styleName="button-complete-mobile">
      <PrimaryButton styleName="complete" to={`/community/${data.track}/how-to-compete`}>
How To Compete
      </PrimaryButton>
    </div>
  </div>
);


Welcome.propTypes = {
  data: PT.shape().isRequired,
};

export default Welcome;
