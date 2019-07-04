/**
 * render serviceProvider Item
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/tools/service-provider-types', false, /svg/);
}

export default function Item(props) {
  const {
    serviceProvider,
    index,
    onDeleteItem,
    onEditItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="service-provider-info">
        <div styleName="service-provider-icon">
          <ReactSVG path={assets(`./${serviceProvider.serviceProviderType}.svg`)} />
        </div>
        <div styleName="service-provider-parameters">
          <div styleName="parameter-first-line">
            { serviceProvider.name }
          </div>
          <div styleName="parameter-second-line">
            { serviceProvider.serviceProviderType }
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
  serviceProvider: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
