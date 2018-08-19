/**
 * render organization Item
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
    organization,
    index,
    onDeleteItem,
  } = props;

  return (
    <div styleName="container">
      <div styleName="organization-info">
        <div styleName="organization-icon">
          <ReactSVG path={assets('./ico-organization.svg')} />
        </div>
        <div styleName="organization-parameters">
          <div styleName="parameter-first-line">
            { organization.name }
          </div>
          <div styleName="parameter-second-line">
            { `${moment(organization.timePeriodFrom).format('YYYY')} - ${moment(organization.timePeriodTo).format('YYYY')} | ${organization.sector} | ${organization.city}` }
          </div>
          <div styleName="parameter-second-line-mobile">
            <p>
              { `${moment(organization.timePeriodFrom).format('YYYY')} - ${moment(organization.timePeriodTo).format('YYYY')}` }
            </p>
            <p>
              { `${organization.sector} | ${organization.city}` }
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
  organization: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
};
