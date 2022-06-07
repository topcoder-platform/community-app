/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import PT from 'prop-types';

import ChevronDown from 'assets/images/chevron-down-green.svg';
import LinkButton from 'assets/images/profile/link-button.svg';
import { getRatingColor } from 'utils/tc';

import { Link } from 'react-router-dom';

import './styles.scss';
import _ from 'lodash';

const trackNameMap = {
  DESIGN: 'UX / UI Design',
  COPILOT: 'SPECIALIZED ROLES',
  DATA_SCIENCE: 'DATA SCIENCE',
  DEVELOP: 'DEVELOPMENT',
  QA: 'QUALITY ASSURANCE',
};

const ActivityCard = ({
  trackName, subTracks, handle, hasMM,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div styleName={`activity-card ${collapsed ? 'hidden' : ''}`}>
      <div role="presentation" styleName="track-name" onClick={() => setCollapsed(!collapsed)}>
        <span>{trackNameMap[trackName]}</span>

        <div styleName={`arrow ${collapsed ? 'down' : ''}`}>
          <ChevronDown />
        </div>
      </div>

      {
        !collapsed
      && (
      <div styleName={`sub-track-wrapper ${trackName === 'COPILOT' ? 'full-width' : ''}`}>
        {
          subTracks.map((subtrack, index) => (
            <div styleName="sub-track-item" key={index}>
              <span styleName="title">
                {_.upperFirst(subtrack.name.replace('FIRST_2_FINISH', 'FIRST2FINISH').replace(/_/g, ' ').toLowerCase())}
              </span>

              <div styleName="right">
                {
                      subtrack.rank && !_.isUndefined(subtrack.rank.rating)
                      && (
                      <div styleName="ranking">
                        <div
                          style={{ color: getRatingColor(subtrack.rank.rating) }}
                          styleName="number"
                        >
                          {subtrack.name === 'MARATHON MATCH' && !subtrack.challenges && hasMM ? '' : subtrack.rank.rating}
                        </div>
                        <div
                          styleName="tag"
                          style={{ color: getRatingColor(subtrack.rank.rating) }}
                        >
                          {subtrack.name === 'MARATHON MATCH' && !subtrack.challenges && hasMM ? ' No Rating' : ' Rating'}
                        </div>
                      </div>
                      )
                    }

                {
                      (!subtrack.rank || _.isUndefined(subtrack.rank.rating))
                      && !subtrack.fulfillment
                      && (
                      <div styleName="ranking">
                        <div styleName="number">
                          {subtrack.wins ? subtrack.wins : 0}
                        </div>
                        <div styleName="tag">
                          Wins
                        </div>
                      </div>
                      )
                    }

                {
                      subtrack.fulfillment
                      && (
                      <div styleName="ranking">
                        <div styleName="number">
                          {`${subtrack.fulfillment}%`}
                        </div>
                        <div styleName="tag">
                          Fulfillment
                        </div>
                      </div>
                      )
                    }
                <Link
                  styleName="link-button"
                  to={`/members/${handle}/details/?track=${trackName === 'QA' ? 'DEVELOP' : trackName}&subTrack=${subtrack.name.replace(' ', '_')}`}
                >
                  <LinkButton />
                </Link>
              </div>

            </div>
          ))
        }
      </div>
      )
      }
    </div>
  );
};

ActivityCard.defaultProps = {
  subTracks: [],
};

ActivityCard.propTypes = {
  trackName: PT.string.isRequired,
  subTracks: PT.arrayOf(PT.shape()),
  handle: PT.string.isRequired,
  hasMM: PT.bool.isRequired,
};

export default ActivityCard;
