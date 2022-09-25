import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

import './styles.scss';

const Assets = ({ assets, onSelectAsset }) => (
  <div styleName="assets">
    {
        assets.map((asset, index) => {
          const { url, videoPreview } = asset;
          const isVideo = !_.isEmpty(videoPreview);
          return (
            <div
              role="presentation"
              key={uuidv4()}
              styleName={classNames('timeline-asset', {
                third: assets.length === 3,
                half: assets.length === 2,
                full: assets.length === 1,
                video: isVideo,
              })}
              onClick={() => {
                onSelectAsset(assets, index);
              }}
            >
              <img src={isVideo ? videoPreview : url} alt="timeline portrait" />
            </div>
          );
        })
            }
  </div>
);

Assets.defaultProps = {
  assets: [],
};

Assets.propTypes = {
  assets: PT.arrayOf(PT.shape()),
  onSelectAsset: PT.func.isRequired,
};

export default Assets;
