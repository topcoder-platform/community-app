import React, { Component } from 'react';
import { Modal } from 'topcoder-react-ui-kit';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import { config } from 'topcoder-react-utils';
import cn from 'classnames';
import _ from 'lodash';
import theme from './styles.scss';
import PodiumSpot from '../PodiumSpot';

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
    } = this.props;
    const { sortParam } = this.state;
    const challengesOrdered = _.orderBy(challenges, [sortParam.field], [sortParam.order]);
    const placeLabel = competitor['member_profile_basic.handle'] ? 'tco_leaderboard.placement' : 'place';
    const pointsLabel = competitor['member_profile_basic.handle'] ? 'tco_leaderboard.tco_points' : 'points';

    return (
      <Modal onCancel={onCancel} theme={theme}>
        <h3>
          Completed Challenges History
        </h3>
        <div styleName="podium-spot-wrapper">
          <PodiumSpot
            competitor={competitor}
            isCopilot={isCopilot}
            isAlgo={isAlgo}
            themeName="TCO20"
          />
        </div>
        <table styleName="history-table">
          <thead>
            <tr>
              <th>Challenge Name</th>
              {
                !isCopilot ? (
                  <th>
                    <div styleName="header-table-content">
                      <span>Placement</span>
                      <button
                        styleName="sort-container"
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
                        <div styleName={cn('sort-up', {
                          active: sortParam.field === placeLabel && sortParam.order === 'asc',
                        })}
                        />
                        <div styleName={cn('sort-down', {
                          active: sortParam.field === placeLabel && sortParam.order === 'desc',
                        })}
                        />
                      </button>
                    </div>
                  </th>
                ) : null
              }
              <th>
                <div styleName="header-table-content">
                  <span>Points</span>
                  <button
                    styleName="sort-container"
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
                    <div styleName={cn('sort-up', {
                      active: sortParam.field === pointsLabel && sortParam.order === 'asc',
                    })}
                    />
                    <div styleName={cn('sort-down', {
                      active: sortParam.field === pointsLabel && sortParam.order === 'desc',
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
                <tr styleName="row" key={`${challenge['tco_leaderboard.challenge_id'] || challenge.challenge_id}`}>
                  <td styleName="name">
                    <a href={`${config.URL.BASE}/challenges/${challenge['tco_leaderboard.challenge_id'] || challenge.challenge_id}/`} styleName="link" target="_blank" rel="noopener noreferrer">
                      {challenge.challenge_name || challenge['challenge.challenge_name'] || challenge['tco_leaderboard.challenge_id'] || challenge.challenge_id}
                    </a>
                  </td>
                  {
                    !isCopilot ? (
                      <td styleName="placement">{challenge['tco_leaderboard.placement'] || challenge.place}</td>
                    ) : null
                  }
                  <td styleName="points">
                    {challenge['tco_leaderboard.tco_points'] || challenge.points}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {
          loading ? <LoadingIndicator /> : null
        }
        <div styleName="buttons">
          <button onClick={onCancel} type="button" styleName="close-btn">
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
};

ChallengeHistoryModal.propTypes = {
  challenges: CHALLENGES_TYPE.isRequired,
  competitor: CompetitorShape.isRequired,
  onCancel: PT.func.isRequired,
  loading: PT.bool.isRequired,
  isAlgo: PT.bool,
  isCopilot: PT.bool,
};

export default ChallengeHistoryModal;
