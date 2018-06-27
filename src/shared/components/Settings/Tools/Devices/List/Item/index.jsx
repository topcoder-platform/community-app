/**
 * render device item.
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/tools/device-types', false, /svg/);
}

export default function Item(props) {
  const {
    device,
    index,
    onDeleteItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="device-info">
        <div styleName="device-icon">
          { assets && assets.keys().includes(`./${device.deviceType.toLowerCase()}.svg`) ? <ReactSVG path={assets(`./${device.deviceType.toLowerCase()}.svg`)} /> : '' }
        </div>
        <div styleName="device-parameters">
          <div styleName="parameter-first-line">
            {
              `${device.manufacturer} | ${device.model} | ${device.deviceType}`
            }
          </div>
          <div styleName="parameter-second-line">
            {
              `${device.operatingSystem} ${device.osVersion} ${device.osLanguage}`
            }
          </div>
        </div>
      </div>
      <a
        tabIndex={0}
        styleName="delete"
        role="button"
        onKeyPress={() => onDeleteItem(index)}
        onClick={() => onDeleteItem(index)}
      >
        <img src={assets('./trash.svg')} alt="delete-icon" />
        <p>Delete</p>
      </a>
    </div>
  );
}

Item.propTypes = {
  device: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
};
