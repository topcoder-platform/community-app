/**
 * render subscription Item
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';
import Tooltip from 'components/Tooltip';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/tools/subscription-types', false, /svg/);
}

export default function Item(props) {
  const {
    subscription,
    index,
    onDeleteItem,
    onEditItem,
  } = props;

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
    <div styleName="container">
      <div styleName="subscription-info">
        <div styleName="subscription-icon">
          <ReactSVG path={assets('./subscriptionlist.svg')} />
        </div>
        <div styleName="subscription-parameters">
          <div styleName="parameter-first-line">
            { subscription.name }
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
  subscription: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
