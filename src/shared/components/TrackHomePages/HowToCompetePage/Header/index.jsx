/**
 * Header Component
 */
import React from 'react';
import PT from 'prop-types';
import renderMarkdown from 'utils/markdown';
import YouTubeVideo from 'components/YouTubeVideo';

import './styles.scss';

const Header = ({ data }) => (
  <div styleName="container">
    <div styleName="left">
      <h1>
        {data.title}
      </h1>
      <div>
        {renderMarkdown(data.text)}
      </div>
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
          />
        ) : (
          <img src={data.media.fields.file.url} alt={data.media.fields.file.url} />
        )
      }
    </div>
    <div styleName="text-mobile">
      {renderMarkdown(data.text)}
    </div>
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
