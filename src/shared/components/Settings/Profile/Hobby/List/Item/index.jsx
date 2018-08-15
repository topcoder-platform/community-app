/**
 * render hobby Item
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import { isomorphy } from 'topcoder-react-utils';


import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/profile', false, /svg/);
}

export default function Item(props) {
  const {
    hobby,
    index,
    onDeleteItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="hobby-info">
        <div styleName="hobby-icon">
          <ReactSVG path={assets('./ico-hobby.svg')} />
        </div>
        <div styleName="hobby-parameters">
          <div styleName="parameter-first-line">
            { hobby.hobby }
          </div>
          <div styleName="parameter-second-line">
            { hobby.description }
          </div>
        </div>
      </div>
      <a
        styleName="delete"
        onKeyPress={() => onDeleteItem(index)}
        tabIndex={0}
        role="button"
        onClick={() => onDeleteItem(index)}
      >
        <img src={assets('./ico-trash.svg')} alt="delete-icon" />
        <p>
          Delete
        </p>
      </a>
    </div>
  );
}

Item.propTypes = {
  hobby: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
};
