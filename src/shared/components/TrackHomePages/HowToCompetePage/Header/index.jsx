/**
 * Header Component
 */
/* eslint-disable react/no-danger */
import React from 'react';
import PT from 'prop-types';
import showdown from 'showdown';
import YouTubeVideo from 'components/YouTubeVideo';

import './styles.scss';

const converter = new showdown.Converter();

const Header = ({ data }) => (
  <div styleName="container">
    <div styleName="left">
      <h1>
        {data.title}
      </h1>
      <p
        dangerouslySetInnerHTML={
          { __html: converter.makeHtml(data.text) }
        }
      />
      {
        data.table
        && (
          <div styleName="time-table">
            {
              data.table.map(item => (
                <div styleName="time-item" key={item.fields.time}>
                  <span styleName="time">
                    {item.fields.time}
                  </span>
                  {' '}
    -
                  {item.fields.description}
                </div>
              ))
            }
          </div>
        )
      }
    </div>
    <div styleName="right">
      {
        data.media.fields.file.contentType === 'video/mp4' ? (
          <YouTubeVideo
            src={data.media.fields.file.url}
            rel={false}
            showinfo={false}
            videoId="HU2xr_wjR3s"
            thumb={<div styleName="videoPlayButton" />}
          />) : (
            <img src={data.media.fields.file.url} alt={data.media.fields.file.url} />
        )
      }
    </div>
    <div
      styleName="text-mobile"
      dangerouslySetInnerHTML={
        { __html: converter.makeHtml(data.text) }
      }
    />
    {
      data.table
      && (
        <div styleName="time-table-mobile">
          {
            data.table.map(item => (
              <div styleName="time-item" key={item.fields.time}>
                <span styleName="time">
                  {item.fields.time}
                </span>
                {' '}
    -
                {item.fields.description}
              </div>
            ))
          }
        </div>
      )
    }
  </div>
);

Header.propTypes = {
  data: PT.shape().isRequired,
};

export default Header;
