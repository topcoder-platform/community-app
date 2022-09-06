/**
 * render education Item
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import moment from 'moment';
import { isomorphy } from 'topcoder-react-utils';
import Tooltip from 'components/Tooltip';

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

  const getDate = () => {
    let start = '';
    if (!_.isEmpty(education.timePeriodFrom)) {
      start = moment(education.timePeriodFrom).format('YYYY');
    }
    let end = '';
    if (!_.isEmpty(education.timePeriodTo)) {
      end = moment(education.timePeriodTo).format('YYYY');
    }

    if (_.isEmpty(start) && _.isEmpty(end)) {
      return '';
    }

    if (!_.isEmpty(start) && !_.isEmpty(end)) {
      return `${start} - ${end} `;
    }

    if (!_.isEmpty(start) && _.isEmpty(end)) {
      return `${start} `;
    }

    if (_.isEmpty(start) && !_.isEmpty(end)) {
      return `${end} `;
    }

    return '';
  };

  const getGraduated = () => {
    const date = getDate();
    if (!_.isEmpty(date)) {
      if (education.graduated) {
        return '| Graduated';
      }

      return '';
    }

    if (education.graduated) {
      return 'Graduated';
    }
    return '';
  };

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
      <div styleName="education-info">
        <div styleName="education-icon">
          <ReactSVG path={assets('./ico-education.svg')} />
        </div>
        <div styleName={`education-parameters${hasSecondLine() ? '' : ' single-line'}`}>
          <div styleName={`parameter-first-line${hasSecondLine() ? '' : ' single-line'}`}>
            { education.major ? `${education.schoolCollegeName} | ${education.major}` : `${education.schoolCollegeName}`}
          </div>
          {
            hasSecondLine() && (
              <React.Fragment>
                <div styleName="parameter-second-line">
                  {
                    `${getDate()}${getGraduated()}`
                  }
                </div>
                <div styleName="parameter-second-line-mobile">
                  {
                    !_.isEmpty(getDate()) && (
                      <p>
                        {`${getDate()}`}
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
              <img src={assets('./ico-trash.svg')} alt="delete-icon" />
            </a>

          </Tooltip>
        </div>
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
