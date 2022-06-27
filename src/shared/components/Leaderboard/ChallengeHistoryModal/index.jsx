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
    const placeLabel = competitor['member_profile_basic.handle'] ? 'tco_leaderboard.placement' : 'place';
    const pointsLabel = competitor['member_profile_basic.handle'] ? 'tco_leaderboard.tco_points' : 'points';
    const styles = THEMES[themeName] || THEMES.Default;

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
                        <div className={cn(styles['sort-up'], {
                          active: sortParam.field === placeLabel && sortParam.order === styles.asc,
                        })}
                        />
                        <div className={cn(styles['sort-down'], {
                          active: sortParam.field === placeLabel && sortParam.order === styles.desc,
                        })}
                        />
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
                    <div className={cn(styles['sort-up'], {
                      active: sortParam.field === pointsLabel && sortParam.order === styles.asc,
                    })}
                    />
                    <div className={cn(styles['sort-down'], {
                      active: sortParam.field === pointsLabel && sortParam.order === styles.desc,
                    })}
                    />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              challengesOrdered.map(challenge => (
                <tr className={styles.row} key={`${challenge['tco_leaderboard.challenge_id'] || challenge['challenge.challenge_id'] || challenge.challenge_id}`}>
                  <td className={styles.name}>
                    <a href={`${config.URL.BASE}/challenges/${challenge['tco_leaderboard.challenge_id'] || challenge['challenge.challenge_id'] || challenge.challenge_id || challenge['challenge.challenge_GUID']}/`} className={styles.link} target="_blank" rel="noopener noreferrer">
                      {challenge.challenge_name || challenge['challenge.challenge_name'] || challenge['tco_leaderboard.challenge_id'] || challenge.challenge_id}
                    </a>
                  </td>
                  {
                    !isCopilot ? (
                      <td className={styles.placement}>{challenge['tco_leaderboard.placement'] || challenge.place}<span>placement</span></td>
                    ) : null
                  }
                  <td className={styles.points}>
                    {challenge['tco_leaderboard.tco_points'] || challenge.points}<span>points</span>
                  </td>
                </tr>
              ))
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
