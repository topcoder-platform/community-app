/**
 * render device item.
 */
import _ from 'lodash';
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
    onEditItem,
  } = props;

  const hasSecondLine = () => {
    if (_.isEmpty(device.operatingSystem) && _.isEmpty(device.osVersion)
      && _.isEmpty(device.osLanguage)) {
      return false;
    }

    return true;
  };

  return (
    <div styleName="container">
      <div styleName="device-info">
        <div styleName="device-icon">
          { assets && assets.keys().includes(`./${device.deviceType.toLowerCase()}.svg`) ? <ReactSVG path={assets(`./${device.deviceType.toLowerCase()}.svg`)} /> : '' }
        </div>
        <div styleName={`device-parameters${hasSecondLine() ? '' : ' single-line'}`}>
          <div styleName={`parameter-first-line${hasSecondLine() ? '' : ' single-line'}`}>
            {
              `${_.isEmpty(device.manufacturer) ? '' : `${device.manufacturer} | `}${_.isEmpty(device.model) ? '' : `${device.model} | `}${device.deviceType}`
            }
          </div>
          {
            hasSecondLine() && (
              <div styleName="parameter-second-line">
                {
                  `${_.isEmpty(device.operatingSystem) ? '' : `${device.operatingSystem} `}${_.isEmpty(device.osVersion) ? '' : `${device.osVersion} `}${_.isEmpty(device.osLanguage) ? '' : `${device.osLanguage}`}`
                }
              </div>
            )
          }
        </div>
      </div>
      <div styleName="operation-container">
        <a
          styleName="edit"
          onKeyPress={() => onEditItem(index)}
          tabIndex={0}
          role="button"
          onClick={() => onEditItem(index)}
        >
          <img src={assets('./ico-edit.svg')} alt="edit-icon" />
          <p>
            Edit
          </p>
        </a>
        <a
          tabIndex={0}
          styleName="delete"
          role="button"
          onKeyPress={() => onDeleteItem(index)}
          onClick={() => onDeleteItem(index)}
        >
          <img src={assets('./trash.svg')} alt="delete-icon" />
          <p>
            Delete
          </p>
        </a>
      </div>
    </div>
  );
}

Item.propTypes = {
  device: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
