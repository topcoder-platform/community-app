/**
 * This compnent receives via props the screening object and nicely renders them.
 * Note that this component both has the text coming directly from the screening object,
 * and the text generated based on the screening status
 *
 */

import React from 'react';
import PT from 'prop-types';
import shortid from 'shortid';

import './styles.scss';

export default function ScreeningDetails(props) {
  const {
    screeningObject,
    helpPageUrl,
  } = props;

  const checkScreeningObject = () => {
    if (screeningObject) {
      return screeningObject;
    }
    return {};
  };
  const hasWarnings = checkScreeningObject(screeningObject).warnings;
  const hasStatus = checkScreeningObject(screeningObject).status;
  const hasStatusPassed = hasStatus === 'passed';
  const hasStatusFailed = hasStatus === 'failed';
  const hasPending = checkScreeningObject(screeningObject).status === 'pending';
  const warnLength = checkScreeningObject(screeningObject).warnings && hasWarnings.length;

  const setStatusInfo = () => {
    if (hasPending) {
      return {
        title: 'Pending',
        classname: 'pending',
        message: 'Your submission has been received, and will be screened after the end of the phase',
      };
    } else if (hasStatusPassed && !hasWarnings) {
      return {
        title: 'Passed Screening',
        classname: 'passed',
        message: 'You have passed screening.',
      };
    } else if (hasStatusFailed && !hasWarnings) {
      return {
        title: 'Failed Screening',
        classname: 'failed',
        message: 'You have failed screening',
      };
    } else if (hasStatusPassed && hasWarnings) {
      return {
        title: 'Passed Screening with Warnings',
        classname: 'passed',
        message: `You have passed screening, but the screener has given you ${warnLength} warnings that you must fix in round 2.`,
      };
    } else if (hasStatusFailed && hasWarnings) {
      return {
        title: 'Failed Screening with Warnings',
        classname: 'failed',
        message: 'You have failed screening and the screener has given you the following warning.',
      };
    }
    return {
      title: '',
      classname: '',
      message: 'Your submission has been received, and will be evaluated during Review phase.',
    };
  };

  let warnings = [];
  if (checkScreeningObject(screeningObject).warnings) {
    warnings = screeningObject.warnings.map((warning, i) =>
      <div styleName="screening-warning" key={shortid.generate()}>
        <div styleName="warning-bold"><span>Warning</span> {`${1 + i} : ${warning.brief}`}</div>
        <p>{warning.details}</p>
      </div>,
    );
  }
  return (
    <div styleName="screening-details" >
      <div styleName="screening-details-head">
        <p styleName={`status-title ${setStatusInfo().classname}`}>{setStatusInfo().title}</p>
        {/*
          NOTE: TonyJ asked to remove the OR links from the page to keep
          users within the new Topcoder site as much as we can. Not wiping
          out the code just in case we decide to bring it back later.
        <a href={onlineReviewUrl} styleName="online-review-link">
          Online Review
        </a>
        */}
      </div>
      <p>{setStatusInfo().message}</p>
      <div styleName="screening-warning">
        {warnings}
        {((hasStatusFailed) || (hasStatusPassed && hasWarnings)) &&
          <p styleName="more-info">Need more info on how to pass screening?
             Go to help to read Rules & Policies.</p>}
        <div styleName="help-btn">
          <a href={helpPageUrl} styleName="help-link" className="tc-btn-default">Help</a>
        </div>
      </div>
    </div>
  );
}

ScreeningDetails.defaultProps = {
  screeningObject: {},
  helpPageUrl: '',
};

ScreeningDetails.propTypes = {
  screeningObject: PT.shape({
    status: PT.string,
    warnings: PT.arrayOf(PT.shape({
      brief: PT.string.isRequired,
      details: PT.string.isRequired,
    })),
  }),
  helpPageUrl: PT.string,
};
