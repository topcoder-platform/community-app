/**
 * render work Item
 */
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import moment from 'moment';
import { isomorphy } from 'topcoder-react-utils';

import './styles.scss';

let assets;
if (isomorphy.isClientSide()) {
  assets = require.context('assets/images/profile', false, /svg/);
}

export default function Item(props) {
  const {
    work,
    index,
    onDeleteItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="work-info">
        <div styleName="work-icon">
          <ReactSVG path={assets('./ico-work.svg')} />
        </div>
        <div styleName="work-parameters">
          <div styleName="parameter-first-line">
            { `${work.company} | ${work.industry} | ${work.cityTown}` }
          </div>
          <div styleName="parameter-second-line">
            { `${moment(work.timePeriodFrom).format('YYYY')} - ${moment(work.timePeriodTo).format('YYYY')} | ${work.position}` }
          </div>
          <div styleName="parameter-second-line-mobile">
            <p>
              {`${moment(work.timePeriodFrom).format('YYYY')} - ${moment(work.timePeriodTo).format('YYYY')}`}
            </p>
            <p>
              { work.position }
            </p>
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
  work: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
};
