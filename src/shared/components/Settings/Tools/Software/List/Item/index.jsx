/**
 * render software Item
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/tools/software-types', false, /svg/);
}

export default function Item(props) {
  const {
    software,
    index,
    onDeleteItem,
    onEditItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="software-info">
        <div styleName="software-icon">
          <ReactSVG path={assets('./software.svg')} />
        </div>
        <div styleName="software-parameters">
          <div styleName="parameter-first-line">
            { software.name }
          </div>
          <div styleName="parameter-second-line">
            { software.softwareType }
          </div>
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
          styleName="delete"
          onKeyPress={() => onDeleteItem(index)}
          tabIndex={0}
          role="button"
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
  software: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
