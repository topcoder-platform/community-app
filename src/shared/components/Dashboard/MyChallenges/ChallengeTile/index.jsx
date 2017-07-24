import React from 'react';
import PT from 'prop-types';
import cn from 'classnames';

import { stripUnderscore, challengeLinks as getLink } from 'utils/tc';
import ChallengeLinks from '../ChallengeLinks';
import './style.scss';

function listRoles(roles) {
  if (!roles) {
    return 'No assigned role.';
  }

  const rolesString = roles.join(', ');

  if (rolesString.length > 60) {
    return `${rolesString.slice(0, 57)}...`;
  }
  return rolesString;
}

const ChallengeTile = (props) => {
  const { challenge, viewMode } = props;
  return (
    <div styleName={cn(['challenge-tile', `${viewMode}-view`])}>
      {
        viewMode === 'tile' &&
        <div styleName={cn(['challenge', 'tile-view', challenge.track])}>
          {
            challenge.status === 'ACTIVE' &&
            <div styleName="active-challenge">
              <header>
                {
                  !challenge.isPrivate &&
                  <a href={getLink(challenge, 'detail')} styleName="name"><span>{challenge.name}</span></a>
                }
                {
                  challenge.isPrivate &&
                  <span styleName="name" title={challenge.name}>{challenge.name}</span>
                }
                <div styleName="labels">
                  <p styleName="subtrack-color">{stripUnderscore(challenge.subTrack)}</p>
                  {
                    challenge.communityLabel &&
                    <p styleName="community-label">{challenge.communityLabel}</p>
                  }
                </div>
                <ChallengeLinks challenge={challenge} viewMode={viewMode} />
              </header>
              <div styleName="challenge-card__bottom">
                <div styleName="challenge-details">
                  <p styleName="currentPhase">{challenge.userCurrentPhase}</p>
                  {
                    challenge.userCurrentPhaseEndTime &&
                      <div styleName={cn({
                        'challenge-calendar': true,
                        'challenge-late': challenge.isLate,
                      })}
                      >
                        <p styleName="ends-in">{challenge.isLate ? 'Late for' : 'Ends In'}</p>
                        <p styleName="time-remaining">{challenge.userCurrentPhaseEndTime[0]}</p>
                        <p styleName="unit-of-time">{challenge.userCurrentPhaseEndTime[1]}</p>
                      </div>
                  }
                  {
                    !challenge.userCurrentPhaseEndTime &&
                      <div styleName="stalled-challenge">
                        This challenge is currently paused.
                      </div>
                  }
                  {
                    challenge.userAction &&
                      <div styleName="phase-action">
                        {
                          challenge.userAction === 'Submit' &&
                          <a
                            href={getLink(challenge, 'submit')}
                            className="tc-btn tc-btn-s tc-btn-wide tc-btn-ghost"
                            styleName="tc-btn submit"
                          >Submit</a>
                        }
                        {
                          challenge.userAction === 'Submit' &&
                          <a
                            href={getLink(challenge, 'unRegister')}
                            className="tc-btn tc-btn-s tc-btn-wide"
                            styleName="tc-btn submit btn-danger"
                          >Unregister</a>
                        }
                        {
                          challenge.userAction === 'Appeal' &&
                          <a
                            href={getLink(challenge, 'viewScorecards')}
                            className="tc-btn tc-btn-s tc-btn-wide tc-btn-ghost"
                            styleName="tc-btn submit"
                          >View Scorecards</a>
                        }
                        {
                          challenge.userAction === 'Appeal' && challenge.isSubmitter &&
                          <a
                            href={getLink(challenge, 'completeAppeals')}
                            className="tc-btn tc-btn-s tc-btn-wide"
                            styleName="tc-btn submit btn-danger"
                          >Complete Appeals</a>
                        }
                        {
                          challenge.userAction === 'Submitted' &&
                          <div styleName="submitted">Submitted</div>
                        }
                        {
                          challenge.userAction === 'Registered' &&
                          <div styleName="submitted">Registered</div>
                        }
                      </div>
                  }
                </div>
                {
                  challenge.track !== 'DATA_SCIENCE' &&
                  <p styleName="roles">
                    <span>Role:</span>
                    <span>{listRoles(challenge.userDetails.roles)}</span>
                  </p>
                }
              </div>
            </div>
          }
        </div>
      }
      {
        viewMode === 'list' &&
        <div styleName={cn(['challenge', 'list-view', challenge.track])}>
          {
            challenge.status === 'ACTIVE' &&
            <div styleName="active-challenge">
              <header>
                {
                  !challenge.isPrivate &&
                  <a href={getLink(challenge, 'detail')} styleName="name"><span>{challenge.name}</span></a>
                }
                {
                  challenge.isPrivate &&
                  <span styleName="name" title={challenge.name} />
                }
                <p styleName="subtrack-color">{stripUnderscore(challenge.subTrack)}</p>
                <p styleName="roles">
                  <span>Role:</span>
                  <span>{listRoles(challenge.userDetails.roles)}</span>
                </p>
              </header>
              <div styleName="challenge-details">
                <div styleName={cn({
                  'challenge-info': true,
                  'challenge-late': challenge.isLate,
                })}
                >
                  <p styleName="currentPhase">{challenge.userCurrentPhase}</p>
                  {
                    challenge.userCurrentPhaseEndTime &&
                    <p styleName="ends-in">{`Ends ${challenge.userCurrentPhaseEndTime[2]}`}</p>
                  }
                  {
                    !challenge.userCurrentPhaseEndTime &&
                    <p styleName="ends-in">This challenge is currently paused.</p>
                  }
                </div>
                {
                  challenge.userAction &&
                    <div styleName="phase-action">
                      {
                        challenge.userAction === 'Submit' &&
                        <a
                          href={getLink(challenge, 'submit')}
                          className="tc-btn tc-btn-s tc-btn-wide tc-btn-ghost"
                          styleName="tc-btn submit"
                        >Submit</a>
                      }
                      {
                        challenge.userAction === 'Submit' &&
                        <a
                          href={getLink(challenge, 'unRegister')}
                          className="tc-btn tc-btn-s tc-btn-wide"
                          styleName="tc-btn submit btn-danger"
                        >Unregister</a>
                      }
                      {
                        challenge.userAction === 'Appeal' &&
                        <a
                          href={getLink(challenge, 'viewScorecards')}
                          className="tc-btn tc-btn-s tc-btn-wide tc-btn-ghost"
                          styleName="tc-btn submit"
                        >View Scorecards</a>
                      }
                      {
                        challenge.userAction === 'Appeal' && challenge.isSubmitter &&
                        <a
                          href={getLink(challenge, 'completeAppeals')}
                          className="tc-btn tc-btn-s tc-btn-wide"
                          styleName="tc-btn submit btn-danger"
                        >Complete Appeals</a>
                      }
                      {
                        challenge.userAction === 'Submitted' &&
                        <div styleName="submitted">Submitted</div>
                      }
                      {
                        challenge.userAction === 'Registered' &&
                        <div styleName="submitted">Registered</div>
                      }
                    </div>
                }
              </div>
              <ChallengeLinks challenge={challenge} viewMode={viewMode} />
            </div>
          }
        </div>
      }
    </div>
  );
};

ChallengeTile.propTypes = {
  viewMode: PT.oneOf(['tile', 'list']).isRequired,
  challenge: PT.shape().isRequired,
};

export default ChallengeTile;
