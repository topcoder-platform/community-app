/* eslint-disable max-len */
/**
 * SearchCombo component.
 */
import React from 'react';
import PT from 'prop-types';
import { config, Link } from 'topcoder-react-utils';
import { getSalaryType, getCustomField } from 'utils/gigs';
import './style.scss';
import IconBlackDuration from 'assets/images/icon-black-duration.svg';
import IconBlackLocation from 'assets/images/icon-black-location.svg';
import IconBlackPayment from 'assets/images/icon-black-payment.svg';
import iconBlackSkills from 'assets/images/icon-skills.png';

export default function JobListCard({
  job,
}) {
  let skills = getCustomField(job.custom_fields, 'Technologies Required');
  if (skills !== 'n/a') {
    skills = skills.split(',');
    if (skills.length > 2) {
      skills = `${skills.slice(0, 2).join(', ')},...`;
    } else {
      skills = skills.join(', ');
    }
  }

  return (
    <div styleName="container">
      <Link to={`${config.GIGS_PAGES_PATH}/${job.slug}`} styleName="gig-name">{job.name}</Link>
      <div styleName="job-infos">
        <div styleName="icon-val">
          <img src={iconBlackSkills} alt="skills-icon" /> {skills}
        </div>
        <div styleName="icon-val">
          <IconBlackLocation /> {job.country}
        </div>
        <div styleName="icon-val">
          <IconBlackPayment /> ${job.min_annual_salary} - ${job.max_annual_salary} / {getSalaryType(job.salary_type)}
        </div>
        <div styleName="icon-val">
          <IconBlackDuration /> {getCustomField(job.custom_fields, 'Duration')}
        </div>
        <div styleName="row-btn">
          <Link styleName="primary-green-md" to={`${config.GIGS_PAGES_PATH}/${job.slug}`}>VIEW DETAILS</Link>
        </div>
      </div>
    </div>
  );
}

JobListCard.defaultProps = {

};

JobListCard.propTypes = {
  job: PT.shape().isRequired,
};
