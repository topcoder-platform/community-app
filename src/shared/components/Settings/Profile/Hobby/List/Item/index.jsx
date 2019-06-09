/**
 * render hobby Item
 */
import _ from 'lodash';
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
    onEditItem,
  } = props;

  const hasSecondLine = () => {
    if (_.isEmpty(hobby.description)) {
      return false;
    }

    return true;
  };

  return (
    <div styleName="container">
      <div styleName="hobby-info">
        <div styleName="hobby-icon">
          <ReactSVG path={assets('./ico-hobby.svg')} />
        </div>
        <div styleName={`hobby-parameters${hasSecondLine() ? '' : ' single-line'}`}>
          <div styleName={`parameter-first-line${hasSecondLine() ? '' : ' single-line'}`}>
            { hobby.hobby }
          </div>
          {
            hasSecondLine() && (
              <div styleName="parameter-second-line">
                { hobby.description }
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
    </div>
  );
}

Item.propTypes = {
  hobby: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
