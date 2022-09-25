/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';

import CloseIcon from 'assets/images/timeline/close.svg';
import LeftIcon from 'assets/images/timeline/left-arrow.svg';
import RightIcon from 'assets/images/timeline/right-arrow.svg';

import './styles.scss';
import classNames from 'classnames';

const Gallery = ({
  open, assets, currentIndex, onClose, onNext,
}) => {
  const asset = assets[currentIndex];

  const { url, videoPreview } = asset || {};
  const isVideo = !_.isEmpty(videoPreview);

  return (
    <React.Fragment>
      {
        open ? (
          <div styleName="gallery-container">
            <div styleName="gallery">
              <React.Fragment>
                {
                isVideo
                  ? (
                    <video controls>
                      <source src={url || ''} type="video/mp4" />
                    </video>
                  )
                  : <img alt="Gallery Img" src={url || ''} />
                }

                <div role="presentation" styleName="left" onClick={() => onNext(currentIndex - 1)}>
                  <LeftIcon />
                </div>
                <div role="presentation" styleName="right" onClick={() => onNext(currentIndex + 1)}>
                  <RightIcon />
                </div>
              </React.Fragment>
            </div>
            <div role="presentation" styleName="close-icon" onClick={onClose}>
              <CloseIcon />
            </div>

            <div styleName="gallery-items">
              {
                assets.map((assetItem, index) => {
                  const isSelected = index === currentIndex;
                  return (
                    <div styleName={classNames({ video: !_.isEmpty(assetItem.videoPreview) })}>
                      <img
                        alt="gallery img preview"
                        src={!_.isEmpty(assetItem.videoPreview)
                          ? assetItem.videoPreview : assetItem.url}
                        styleName={classNames('gallery-item', { current: isSelected })}
                      />
                    </div>
                  );
                })
              }
            </div>
          </div>
        ) : null
      }
    </React.Fragment>
  );
};

Gallery.defaultProps = {
  open: false,
  assets: [],
  currentIndex: 0,
};

Gallery.propTypes = {
  open: PT.bool,
  assets: PT.arrayOf(PT.shape()),
  onClose: PT.func.isRequired,
  currentIndex: PT.number,
  onNext: PT.func.isRequired,
};

export default Gallery;
