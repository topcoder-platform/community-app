/* eslint-disable max-len */
/**
 * Job card component.
 */
import React from 'react';
import PT from 'prop-types';
import { config, Link } from 'topcoder-react-utils';
import { getSalaryType, getCustomField } from 'utils/gigs';
import { withOptimizely } from '@optimizely/react-sdk';
import './style.scss';
import IconBlackDuration from 'assets/images/icon-black-calendar.svg';
import IconBlackLocation from 'assets/images/icon-black-location.svg';
import IconBlackPayment from 'assets/images/icon-black-payment.svg';
import iconBlackSkills from 'assets/images/icon-skills.png';
import newTag from 'assets/images/gig-work/tag-new.png';
import hotTag from 'assets/images/gig-work/tag-hot.png';
import dolarsTag from 'assets/images/gig-work/tag-dolars.png';

const TAGS = {
  New: newTag,
  Hot: hotTag,
  $$$: dolarsTag,
};
function JobListCard({
  job,
  optimizely,
}) {
  const duration = getCustomField(job.custom_fields, 'Duration');
  let skills = getCustomField(job.custom_fields, 'Technologies Required');
  if (skills !== 'n/a') {
    skills = skills.split(',');
    if (skills.length > 2) {
      skills = `${skills.slice(0, 2).join(', ')},...`;
    } else {
      skills = skills.join(', ');
    }
  }
  const tag = getCustomField(job.custom_fields, 'Job Tag');
  const onHotlistApply = () => {
    optimizely.track('View Details Click');
  };

  return (
    <div styleName="container">
      {
        tag !== 'n/a' && <img src={TAGS[tag]} alt="gig-job-tag" styleName="gig-tag" />
      }
      <Link to={`${config.GIGS_PAGES_PATH}/${job.slug}`} styleName="gig-name" onClick={onHotlistApply}>{job.name}</Link>
      <div styleName="job-infos">
        <div styleName="icon-val">
          <img src={iconBlackSkills} alt="skills-icon" /> {skills}
        </div>
        <div styleName="icon-val">
          <IconBlackLocation /> {job.country}
        </div>
        <div styleName="icon-val">
          <IconBlackPayment /> ${job.min_annual_salary} - {job.max_annual_salary} (USD) / {getSalaryType(job.salary_type || {})}
        </div>
        <div styleName="icon-val">
          <IconBlackDuration /> {/^\d+$/.test(duration) ? `${duration} Weeks` : duration}
        </div>
        <div styleName="row-btn">
          <Link styleName="primary-green-md" to={`${config.GIGS_PAGES_PATH}/${job.slug}`} onClick={onHotlistApply}>VIEW DETAILS</Link>
        </div>
      </div>
    </div>
  );
}

JobListCard.defaultProps = {

};

JobListCard.propTypes = {
  job: PT.shape().isRequired,
  optimizely: PT.shape().isRequired,
};

export default withOptimizely(JobListCard);
