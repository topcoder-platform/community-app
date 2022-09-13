/**
 * render device item.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import cn from 'classnames';
import { isomorphy } from 'topcoder-react-utils';
import Tooltip from 'components/Tooltip';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/tools/device-types', false, /svg/);
}

export default function Item(props) {
  const {
    device,
    index,
    isEditing,
    onDeleteItem,
    onEditItem,
  } = props;

  const hasModel = !_.isEmpty(device.model);
  const secondLineItems = [];
  if (device.manufacturer) {
    secondLineItems.push(device.manufacturer);
  }
  if (device.operatingSystem) {
    secondLineItems.push(device.operatingSystem);
  }

  secondLineItems.push(device.deviceType);
  const secondLine = secondLineItems.join(' | ');

  const deleteTip = (
    <div styleName="tctooltiptext">
      <p>Delete</p>
    </div>
  );

  const editTip = (
    <div styleName="tctooltiptext">
      <p>Edit</p>
    </div>
  );

  return (
    <div styleName={cn('container', { isEditing })}>
      <div styleName="device-info">
        <div styleName="device-icon">
          { assets && assets.keys().includes(`./${device.deviceType.toLowerCase()}.svg`) ? <ReactSVG path={assets(`./${device.deviceType.toLowerCase()}.svg`)} /> : '' }
        </div>
        <div styleName="device-parameters">
          {hasModel ? (
            <div>
              {device.model}
            </div>
          ) : null}
          <div styleName="parameter-second-line">
            {secondLine}
          </div>
        </div>
      </div>
      <div styleName="operation-container">
        <Tooltip
          id="edit-tip"
          content={editTip}
          trigger={['hover', 'focus']}
        >
          <a
            styleName="edit"
            onKeyPress={() => onEditItem(index)}
            tabIndex={0}
            role="button"
            onClick={() => onEditItem(index)}
          >
            <img src={assets('./ico-edit.svg')} alt="edit-icon" />
          </a>
        </Tooltip>
        <div styleName="delete-wrapper">
          <Tooltip
            id="delete-tip"
            content={deleteTip}
            trigger={['hover', 'focus']}
          >
            <a
              styleName="delete"
              onKeyPress={() => onDeleteItem(index)}
              tabIndex={0}
              role="button"
              onClick={() => onDeleteItem(index)}
            >
              <img src={assets('./trash.svg')} alt="delete-icon" />
            </a>

          </Tooltip>
        </div>
      </div>
    </div>
  );
}

Item.propTypes = {
  device: PT.shape().isRequired,
  index: PT.number.isRequired,
  isEditing: PT.bool.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
