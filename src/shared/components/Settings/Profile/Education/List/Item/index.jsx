/**
 * render education Item
 */
import _ from 'lodash';
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
    onEditItem,
  } = props;

  const hasSecondLine = () => {
    if (_.isEmpty(education.timePeriodFrom) && _.isEmpty(education.timePeriodTo)
      && !education.graduated) {
      return false;
    }

    return true;
  };

  return (
    <div styleName="container">
      <div styleName="education-info">
        <div styleName="education-icon">
          <ReactSVG path={assets('./ico-education.svg')} />
        </div>
        <div styleName={`education-parameters${hasSecondLine() ? '' : ' single-line'}`}>
          <div styleName={`parameter-first-line${hasSecondLine() ? '' : ' single-line'}`}>
            { `${education.schoolCollegeName} ${education.type}` }
          </div>
          {
            hasSecondLine() && (
              <React.Fragment>
                <div styleName="parameter-second-line">
                  {
                    `${!_.isEmpty(education.timePeriodFrom) && !_.isEmpty(education.timePeriodTo) && !education.graduated ? `${moment(education.timePeriodFrom).format('YYYY')} - ${moment(education.timePeriodTo).format('YYYY')}` : ''}`
                  }
                  {
                    _.isEmpty(education.timePeriodFrom) && _.isEmpty(education.timePeriodTo) && `${education.graduated ? 'Graduated' : ''}`
                  }
                  {
                    !_.isEmpty(education.timePeriodFrom) && !_.isEmpty(education.timePeriodTo) && education.graduated && `${moment(education.timePeriodFrom).format('YYYY')} - ${moment(education.timePeriodTo).format('YYYY')} | Graduated`
                  }
                </div>
                <div styleName="parameter-second-line-mobile">
                  {
                    !_.isEmpty(education.timePeriodFrom) && !_.isEmpty(education.timePeriodTo) && (
                      <p>
                        {`${moment(education.timePeriodFrom).format('YYYY')} - ${moment(education.timePeriodTo).format('YYYY')}`}
                      </p>
                    )
                  }
                  {
                    education.graduated && (
                      <p>
                        Graduated
                      </p>
                    )
                  }
                </div>
              </React.Fragment>
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
  education: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
