import React from 'react';
import PT from 'prop-types';

import jquery from 'jquery';

import './styles.scss';

function decodeEscaped(escaped) {
  return jquery('<textarea />').html(escaped).text();
}

const Checkpoints = (props) => {
  const {
    checkpointResults,
    generalFeedback,
  } = props.checkpoints;
  return (
    <div styleName="challenge-detail-checkpoints">
      <div styleName="challenge-checkpoint-list">
        {
          checkpointResults && checkpointResults.map((item, index) => (
            <button
              key={item.submissionId}
              styleName="challenge-checkpoint-li"
              onClick={(e) => {
                e.preventDefault();
                props.toggleCheckpointFeedback(index);
              }}
            >
              #{item.submissionId}
            </button>
          ))
        }
      </div>
      <div styleName="challenge-checkpoint-detail">
        <h2>Checkpoint Winners & General Feedback</h2>
        <p>{decodeEscaped(generalFeedback || '')}</p>
        {
          checkpointResults && checkpointResults.map((item, index) => (
            <div key={item.submissionId} styleName="challenge-checkpoint-winners">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  props.toggleCheckpointFeedback(index);
                }}
                styleName="challenge-checkpoint-submission"
              >
                <span><span styleName="feedback-text">Feedback </span>#{item.submissionId}</span>
                <span styleName="challenge-checkpoint-expander">
                  {
                    item.expanded ? '-' : '+'
                  }
                </span>
              </button>
              {
                item.expanded &&
                <p styleName="challenge-checkpoint-feedback">
                  {decodeEscaped(item.feedback)}
                </p>
              }
            </div>
          ))
        }
      </div>
    </div>
  );
};

Checkpoints.propTypes = {
  checkpoints: PT.shape({
    checkpointResults: PT.arrayOf(PT.shape()).isRequired,
    generalFeedback: PT.string,
  }).isRequired,
};

export default Checkpoints;
