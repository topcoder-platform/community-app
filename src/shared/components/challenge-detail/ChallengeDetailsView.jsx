/*
  This is currently a dummy componnent.
  Future work on rendering challenge details should target this.

  WARNING:
  dangerouslySetInnerHTML - is used to render html string.
*/

import React from 'react';
import PT from 'prop-types';

import './style.scss';

export default function ChallengeDetailsView(props) {
  const {
    introduction,
    detailedRequirements,
  } = props;
  return (
    <div styleName="challenge-details-view">
      <div>
        {
          introduction &&
          <div>
            <h2>CHALLENGE SUMMARY</h2>
            <div
              dangerouslySetInnerHTML={// eslint-disable-line react/no-danger
                { __html: introduction }
              }
            />
          </div>
        }
        {
          detailedRequirements &&
          <div>
            <h2>FULL DESCRIPTION & PROJECT GUIDE</h2>
            <div
              dangerouslySetInnerHTML={// eslint-disable-line react/no-danger
                { __html: detailedRequirements }
              }
            />
          </div>
        }
      </div>
    </div>
  );
}

ChallengeDetailsView.defaultProps = {
  introduction: undefined,
  detailedRequirements: undefined,
};

ChallengeDetailsView.propTypes = {
  introduction: PT.string,
  detailedRequirements: PT.string,
};
