/**
 * This component receives the screening object via props.
 * Depending on status, presence and count of warnings,
 * it renders itself in one of the ways shown in specs.
 * When status is pending it renders just 'Not yet performed' text.
 * When no screening object received, nothing is rendered.
 *
 * When hovered this object should update mouse cursor to pointer,
 * and on click it should call the onClick() callback passed from parent.
 * Parent code will use that signal to show/hide the panel with
 * screening details for this submission.
 *
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import './styles.scss';

export default function ScreeningStatus(props) {
  const {
    screeningObject,
    onShowDetails,
    submissionId,
  } = props;

  const hasWarnings = screeningObject.warnings;
  const hasStatus = screeningObject.status;
  const hasStatusPassed = hasStatus === 'passed';
  const hasStatusFailed = hasStatus === 'failed';
  const hasPending = screeningObject.status === 'pending';
  const warnLength = screeningObject.warnings && hasWarnings.length;

  const setClassName = () => {
    if (hasPending) {
      return 'pending';
    } else if (hasStatusPassed && !hasWarnings) {
      return 'pass-with-no-warn';
    } else if (hasStatusFailed && !hasWarnings) {
      return 'fail-with-no-warn';
    }
    return 'has-warn';
  };
  const setStatusClassName = () => {
    if (hasStatusPassed && hasWarnings) {
      return 'passed';
    } else if (hasStatusFailed && hasWarnings) {
      return 'failed';
    }
    return '';
  };
  return (
    <button onClick={() => onShowDetails(submissionId)}>
      <div styleName={`screening-status ${setClassName()}`}>
        {/* status */}
        {hasStatus && !hasPending ?
          <span styleName={`status ${setStatusClassName()}`}>
            {hasStatus.substring(0, hasStatus.indexOf('ed'))}</span> :
          <span>Not yet performed</span>}{/* pending */}
        {/* warning */}
        {hasWarnings && <span styleName="warning">
          {`${warnLength} `}{warnLength > 1 ? ' warnings' : 'warning'}</span>}
      </div>
    </button>
  );
}

ScreeningStatus.defaultProps = {
  onShowDetails: _.noop,
};

ScreeningStatus.propTypes = {
  screeningObject: PT.shape(
    {
      status: PT.string,
      warnings: PT.array,
    },
  ).isRequired,
  onShowDetails: PT.func,
  submissionId: PT.string.isRequired,
};
