
/* global window */
import React from 'react';
import PT from 'prop-types';

import jquery from 'jquery';

import './styles.scss';

const trimLimit = 768;

function decodeEscaped(escaped) {
  return jquery('<textarea />').html(escaped).text();
}

export default class Checkpoints extends React.Component {
  constructor(props, context) {
    super(props, context);
    const trimContent = !((window && window.innerWidth > trimLimit));

    this.state = {
      trimContent,
    };
    this.subTimeout = 0;
    this.windowResize = this.windowResize.bind(this);
  }

  componentDidMount() {
    if (window) {
      this.subTimeout = setTimeout(() => {
        window.addEventListener('resize', this.windowResize);
        this.windowResize();
      }, 500);// Listen to resize event after a safe period of time
    }
  }

  componentWillUnmount() {
    if (window) {
      clearTimeout(this.subTimeout);
      window.removeEventListener('resize', this.windowResize);
    }
  }

  windowResize() {
    this.setState({
      trimContent: window.innerWidth <= trimLimit,
    });
  }

  expanderClicked(key) {
    const newExpanderValue = !this.state[key];
    this.setState({
      [key]: newExpanderValue,
    });
  }

  render() {
    const {
      checkpointResults,
      generalFeedback,
    } = this.props.checkpoints;
    return (
      <div styleName="challenge-detail-checkpoints">
        {
          !this.state.trimContent && (
            <div styleName="challenge-checkpoint-list">
              {
                checkpointResults && checkpointResults.map(item => (
                  <p key={item.submissionId} styleName="challenge-checkpoint-li">
                    #{item.submissionId}
                  </p>
                ))
              }
            </div>
          )
        }
        <div styleName="challenge-checkpoint-detail">
          <h2>Checkpoint Winners & General Feedback</h2>
          <p>{decodeEscaped(generalFeedback || '')}</p>
          {
            checkpointResults && checkpointResults.map(item => (
              <div key={item.submissionId} styleName="challenge-checkpoint-winners">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    this.expanderClicked(`${item.submissionId}_exp`);
                  }}
                  styleName="challenge-checkpoint-submission"
                >
                  <span>{!this.state.trimContent && 'Feedback '}#{item.submissionId}</span>
                  <span styleName="challenge-checkpoint-expander">
                    {
                      this.state[`${item.submissionId}_exp`] ? '-' : '+'
                    }
                  </span>
                </button>
                {
                  this.state[`${item.submissionId}_exp`] &&
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
  }
}

Checkpoints.propTypes = {
  checkpoints: PT.shape({
    checkpointResults: PT.arrayOf(PT.shape()).isRequired,
    generalFeedback: PT.string,
  }).isRequired,
};
