/**
 * render education Item
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
    education,
    index,
    onDeleteItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="education-info">
        <div styleName="education-icon">
          <ReactSVG path={assets('./ico-education.svg')} />
        </div>
        <div styleName="education-parameters">
          <div styleName="parameter-first-line">
            { `${education.schoolCollegeName} ${education.type}` }
          </div>
          <div styleName="parameter-second-line">
            { `${moment(education.timePeriodFrom).format('YYYY')} - ${moment(education.timePeriodTo).format('YYYY')}${education.graduated ? ' | Graduated' : ''}` }
          </div>
          <div styleName="parameter-second-line-mobile">
            <p>
              {`${moment(education.timePeriodFrom).format('YYYY')} - ${moment(education.timePeriodTo).format('YYYY')}`}
            </p>
            {
              education.graduated && (
                <p>
                Graduated
                </p>
              )
            }
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
  education: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
};
