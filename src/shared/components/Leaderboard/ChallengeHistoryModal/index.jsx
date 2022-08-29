import React, { Component } from 'react';
import { Modal } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import { config } from 'topcoder-react-utils';
import cn from 'classnames';
import _ from 'lodash';
import PodiumSpot from '../PodiumSpot';

import defaultTheme from './themes/styles.scss';
import tco23Theme from './themes/tco23.scss';

const THEMES = {
  Default: defaultTheme,
  TCO23: tco23Theme,
};

class ChallengeHistoryModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortParam: {
        order: '',
        field: '',
      },
    };
  }

  render() {
    const {
      challenges,
      competitor,
      onCancel,
      loading,
      isCopilot,
      isAlgo,
      themeName,
    } = this.props;
    const { sortParam } = this.state;
    const challengesOrdered = _.orderBy(challenges, [sortParam.field], [sortParam.order]);
    // eslint-disable-next-line
    const placeLabel = competitor['member_profile_basic.handle'] ? (competitor['tco23_leaderboard.placement'] ? 'tco23_leaderboard.placement' : 'tco_leaderboard.placement') : 'place';
    // eslint-disable-next-line
    const pointsLabel = competitor['member_profile_basic.handle'] ? (competitor['tco23_leaderboard.tco_points'] ? 'tco23_leaderboard.tco_points' : 'tco_leaderboard.tco_points') : 'points';
    const styles = THEMES[themeName] || THEMES.Default;
    /* eslint-disable no-confusing-arrow */
    const sortInner = () => themeName === 'TCO23' ? (
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.26721 0.267169C3.48786 0.046523 3.84559 0.046523 4.06624 0.267169L6.73291 2.93384C6.95355 3.15448 6.95355 3.51222 6.73291 3.73287C6.51226 3.95351 6.15452 3.95351 5.93388 3.73287L4.23173 2.03072V8.66668C4.23173 8.97873 3.97877 9.23168 3.66673 9.23168C3.35468 9.23168 3.10173 8.97873 3.10173 8.66668V2.03072L1.39957 3.73287C1.17893 3.95351 0.821189 3.95351 0.600543 3.73287C0.379897 3.51222 0.379897 3.15448 0.600543 2.93384L3.26721 0.267169ZM9.76839 3.33335C9.76839 3.02131 10.0214 2.76835 10.3334 2.76835C10.6454 2.76835 10.8984 3.02131 10.8984 3.33335V9.96932L12.6005 8.26717C12.8212 8.04652 13.1789 8.04652 13.3996 8.26717C13.6202 8.48781 13.6202 8.84555 13.3996 9.0662L10.7329 11.7329C10.5123 11.9535 10.1545 11.9535 9.93388 11.7329L7.26721 9.0662C7.04656 8.84555 7.04656 8.48781 7.26721 8.26717C7.48786 8.04652 7.84559 8.04652 8.06624 8.26717L9.76839 9.96932V3.33335Z" fill="#767676" />
      </svg>
    ) : (
      <div>
        <div className={cn(styles['sort-up'], {
          active: sortParam.field === pointsLabel && sortParam.order === styles.asc,
        })}
        />
        <div className={cn(styles['sort-down'], {
          active: sortParam.field === pointsLabel && sortParam.order === styles.desc,
        })}
        />
      </div>
    );

    return (
      <Modal onCancel={onCancel} theme={THEMES[themeName] || THEMES.Default}>
        <h3>
          Completed Challenges History
        </h3>
        <div className={styles['podium-spot-wrapper']}>
          <PodiumSpot
            competitor={competitor}
            isCopilot={isCopilot}
            isAlgo={isAlgo}
            themeName={themeName}
          />
        </div>
        <table className={styles['history-table']}>
          <thead>
            <tr>
              <th>Challenge Name</th>
              {
                !isCopilot ? (
                  <th>
                    <div className={styles['header-table-content']}>
                      <span>Placement</span>
                      <button
                        className={styles['sort-container']}
                        onClick={() => {
                          if (!sortParam.field || sortParam.field !== placeLabel) {
                            sortParam.field = placeLabel;
                            sortParam.order = 'desc';
                          } else {
                            sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                          }
                          this.setState({ sortParam });
                        }}
                        type="button"
                      >
                        {sortInner()}
                      </button>
                    </div>
                  </th>
                ) : null
              }
              <th>
                <div className={styles['header-table-content']}>
                  <span>Points</span>
                  <button
                    className={styles['sort-container']}
                    onClick={() => {
                      if (!sortParam.field || sortParam.field !== pointsLabel) {
                        sortParam.field = pointsLabel;
                        sortParam.order = 'desc';
                      } else {
                        sortParam.order = sortParam.order === 'asc' ? 'desc' : 'asc';
                      }
                      this.setState({ sortParam });
                    }}
                    type="button"
                  >
                    {sortInner()}
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              challengesOrdered.map((challenge) => {
                const challengeId = challenge['tco23_leaderboard.challenge_id'] || challenge['tco_leaderboard.challenge_id'] || challenge['challenge.challenge_id'] || challenge.challenge_id;
                return (
                  <tr className={styles.row} key={`${challengeId}`}>
                    <td className={styles.name}>
                      <a href={`${config.URL.BASE}/challenges/${challengeId || challenge['challenge.challenge_GUID']}/`} className={styles.link} target="_blank" rel="noopener noreferrer">
                        {challenge.challenge_name || challenge['challenge.challenge_name'] || challengeId}
                      </a>
                    </td>
                    {
                    !isCopilot ? (
                      <td className={styles.placement}>
                        {challenge[placeLabel]}<span>placement</span>
                      </td>
                    ) : null
                  }
                    <td className={styles.points}>
                      {challenge[pointsLabel] || challenge.points}<span>points</span>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {
          loading ? <LoadingIndicator /> : null
        }
        {
          !challengesOrdered.length && !loading && (
            <center><strong>No data available.</strong></center>
          )
        }
        <div className={styles.buttons}>
          <button onClick={onCancel} type="button" className={styles['close-btn']}>
            Return to page
          </button>
        </div>
      </Modal>
    );
  }
}

const CHALLENGES_TYPE = PT.arrayOf(PT.shape({
  challenge_name: PT.string.isRequired,
  place: PT.number,
  points: PT.number.isRequired,
}));

const CompetitorShape = PT.shape({
  rank: PT.number.isRequired,
  avatar: PT.string,
  handle: PT.string.isRequired,
  challengecount: PT.number.isRequired,
  points: PT.number.isRequired,
});

ChallengeHistoryModal.defaultProps = {
  isCopilot: false,
  isAlgo: false,
  challenges: [],
};

ChallengeHistoryModal.propTypes = {
  challenges: CHALLENGES_TYPE,
  competitor: CompetitorShape.isRequired,
  onCancel: PT.func.isRequired,
  loading: PT.bool.isRequired,
  isAlgo: PT.bool,
  isCopilot: PT.bool,
  themeName: PT.string.isRequired,
};

export default ChallengeHistoryModal;
