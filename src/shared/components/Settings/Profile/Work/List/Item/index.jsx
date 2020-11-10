/**
 * render work Item
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ReactSVG from 'react-svg';
import moment from 'moment';
import { isomorphy } from 'topcoder-react-utils';
import { isEmpty as isDateEmpty } from 'utils/settings';

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
    onEditItem,
  } = props;

  const {
    jobDescription,
    technologies,
    jobAchievements,
  } = work;

  const hasSecondLine = () => {
    if (isDateEmpty(work.timePeriodFrom) && isDateEmpty(work.timePeriodTo)
      && _.isEmpty(work.position) && !work.working) {
      return false;
    }

    return true;
  };

  const current = work.working ? '- Current' : '';

  return (
    <div styleName="container">
      <div styleName="work-info">
        <div styleName="work-icon">
          <ReactSVG path={assets('./ico-work.svg')} />
        </div>
        <div styleName={`work-parameters${hasSecondLine() ? '' : ' single-line'}`}>
          <div styleName={`parameter-first-line${hasSecondLine() ? '' : ' single-line'}`}>
            { `${work.company}${_.isEmpty(work.industry) ? '' : ` | ${work.industry}`}${_.isEmpty(work.cityTown) ? '' : ` | ${work.cityTown}`}` }
          </div>
          <div styleName="parameter-second-line">
            { `${!isDateEmpty(work.timePeriodFrom) ? moment(work.timePeriodFrom).format('YYYY') : ''}${!isDateEmpty(work.timePeriodTo) ? ` - ${moment(work.timePeriodTo).format('YYYY')}` : ` ${current}`} ${!_.isEmpty(work.position) && (!isDateEmpty(work.timePeriodTo) || !isDateEmpty(work.timePeriodFrom)) ? ' | ' : ''}${!_.isEmpty(work.position) ? `${work.position}` : ''}` }
          </div>
          <div styleName="parameter-second-line-mobile">
            <p>
              {`${!isDateEmpty(work.timePeriodFrom) ? moment(work.timePeriodFrom).format('YYYY') : ''}${!isDateEmpty(work.timePeriodTo) ? ` - ${moment(work.timePeriodTo).format('YYYY')}` : ` ${current}`}`}
            </p>
            <p>
              {`${!_.isEmpty(work.position) ? `${work.position}` : ''}`}
            </p>
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
          <img src={assets('./ico-trash.svg')} alt="delete-icon" />
          <p>
            Delete
          </p>
        </a>
      </div>
      { !_.isEmpty(jobDescription) && jobDescription !== '<p><br></p>'
        && (
          <div styleName="job-description">
            <h4 styleName="title">Job Description</h4>
            <div styleName="html-content" dangerouslySetInnerHTML={{ __html: jobDescription /* eslint-disable-line react/no-danger */ }} />
          </div>
        )
      }
      { !_.isEmpty(technologies)
        && (
          <div styleName="technologies">
            <h4 styleName="title">Technologies</h4>
            <div>{technologies.map(item => item.name).join(', ')}</div>
          </div>
        )
      }
      { !_.isEmpty(jobAchievements) && jobAchievements !== '<p><br></p>'
        && (
          <div styleName="achievements">
            <h4 styleName="title">Outputs and Achievements Within the Role</h4>
            <div styleName="html-content" dangerouslySetInnerHTML={{ __html: jobAchievements /* eslint-disable-line react/no-danger */ }} />
          </div>
        )
      }
    </div>
  );
}

Item.propTypes = {
  work: PT.shape().isRequired,
  index: PT.number.isRequired,
  onDeleteItem: PT.func.isRequired,
  onEditItem: PT.func.isRequired,
};
