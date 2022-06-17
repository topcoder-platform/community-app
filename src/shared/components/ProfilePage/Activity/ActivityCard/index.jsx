/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import PT from 'prop-types';
import { Modal } from 'topcoder-react-ui-kit';
import {
  getSummary,
} from 'utils/memberStats';

import IconClose from 'assets/images/icon-close-green.svg';
import ChevronDown from 'assets/images/chevron-down-green.svg';
import LinkButton from 'assets/images/profile/link-button.svg';
import { getRatingColor } from 'utils/tc';

import { Link } from 'react-router-dom';
import _ from 'lodash';

import style from './styles.scss';

const trackNameMap = {
  DESIGN: 'UX / UI Design',
  COPILOT: 'SPECIALIZED ROLES',
  DATA_SCIENCE: 'DATA SCIENCE',
  DEVELOP: 'DEVELOPMENT',
  QA: 'QUALITY ASSURANCE',
};

const ActivityCard = ({
  trackName, subTracks, handle, hasMM, stats,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, toggleModal] = useState(false);
  const [curSubtrack, setCurSubtrack] = useState('');

  const onShowModal = (substrack) => {
    setCurSubtrack(substrack);
    toggleModal(true);
  };

  const subTrackSummary = getSummary(stats && stats[0], trackName, curSubtrack) || [];
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
        {showModal && curSubtrack === 'COPILOT' && (
        <Modal onCancel={() => toggleModal(false)} theme={style}>
          <div styleName="stats">
            <div styleName="header">
              <h2 styleName="title">[COPILOT CATEGORY]</h2>
              <div styleName="icon" role="presentation" onClick={() => toggleModal(false)}>
                <IconClose />
              </div>
            </div>
            <div styleName="stat-body">
              {
                subTrackSummary.map(({ label, value }) => (
                  <div key={label} styleName="stat-item">
                    <div
                      styleName="value"
                    >
                      {value || '-'}
                    </div>
                    <p styleName="label">
                      {label}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
        </Modal>
        )}
        {
          subTracks.map((subtrack, index) => (
            <div styleName="sub-track-item" key={index}>
              <span styleName="title">
                {(_.upperFirst(subtrack.name.replace('FIRST_2_FINISH', 'FIRST2FINISH').replace(/_/g, ' ').toLowerCase()))
                  .replace('First2finish', 'First2Finish')
                  .replace('Design first2finish', 'Design First2Finish')
                  .replace('Srm', 'SRM')
                  .replace('Ria build competition', 'RIA Build Competition')
                  .replace('Ria component competition', 'RIA Component Competition')
                  .replace('Design first2finish', 'Design First2Finish')
                  .replace('Ui prototype competition', 'UI Prototype Competition')
                }
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
                {subtrack.name.replace(' ', '_')
                    !== 'COPILOT'
                  ? (
                    <Link
                      styleName="link-button"
                      to={`/members/${handle}/details/?track=${trackName === 'QA' ? 'DEVELOP' : trackName}&subTrack=${subtrack.name.replace(' ', '_')}`}
                    >
                      <LinkButton />
                    </Link>
                  ) : (
                    <div
                      styleName="link-button"
                      role="presentation"
                      onClick={() => onShowModal(subtrack.name.replace(' ', '_'))}
                    >
                      <LinkButton />
                    </div>
                  )}
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
  stats: [],
};

ActivityCard.propTypes = {
  stats: PT.arrayOf(PT.shape()),
  trackName: PT.string.isRequired,
  subTracks: PT.arrayOf(PT.shape()),
  handle: PT.string.isRequired,
  hasMM: PT.bool.isRequired,
};

export default ActivityCard;
