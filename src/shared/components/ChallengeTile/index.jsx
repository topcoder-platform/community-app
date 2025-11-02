/**
 * Challenge tile.
 */
/* eslint-env browser */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate, COMPETITION_TRACKS } from 'utils/tc';
import { isMM, getTrackName, getTypeName } from 'utils/challenge';
import ReactImageFallback from 'react-image-fallback';
import InviteOnly from 'assets/images/ico-invite-only-prj.svg';
import WinnerRibbon from 'assets/images/ico-winner-ribbon.svg';
import NoImage from 'assets/images/card-bg-no-image.png';
import Private from 'assets/images/ico-private-prj.svg';
import Gallery from 'assets/images/ico-gallery.svg';
import './style.scss';

const underscoreReplace = (string) => {
  const map = {
    ASSEMBLY_COMPETITION: 'ASSEMBLY',
  };
  if (map[string]) {
    return map[string];
  }
  if (!string) {
    return '';
  }
  return string.replace(/_/g, ' ');
};

const listRoles = (roles) => {
  if (!roles) {
    return 'No assigned role.';
  }

  const rolesString = roles.join(', ');

  if (rolesString.length > 60) {
    return `${rolesString.slice(0, 57)}...`;
  }

  return rolesString;
};

const percentage = x => `${Math.round(x * 100)}%`;

const getPlacementPostfix = (x) => {
  if (x === 1) {
    return 'st';
  } if (x === 2) {
    return 'nd';
  } if (x === 3) {
    return 'rd';
  }
  return 'th';
};

class ChallengeTile extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.onPopModal = this.onPopModal.bind(this);
  }

  onPopModal() {
    const { onPopModal, index, challenge } = this.props;
    if (!challenge.isPrivate && challenge.imageURL && onPopModal) {
      onPopModal(index);
    }
  }

  render() {
    const {
      challenge,
    } = this.props;

    const { track, type } = challenge;
    const trackName = getTrackName(track);
    const typeName = getTypeName(type);
    const roles = _.get(challenge, 'userDetails.roles');

    const outStyleName = `challenge tile-view ${(trackName || '').replace(' ', '-').toLowerCase()}`;
    const extraStyle = {
      width: '285px',
      padding: '15px',
      margin: '10px 5px',
    };

    const isDevelopment = track === COMPETITION_TRACKS.DEV;
    const isDesign = track === COMPETITION_TRACKS.DES;

    return (
      <div styleName="challenge tile" style={extraStyle}>
        <div styleName={outStyleName}>
          <div styleName="completed-challenge">
            <header>
              { !challenge.isPrivate
                ? (
                  <Link to={`/challenges/${challenge.id}`} styleName="name">
                    <span>
                      { challenge.name }
                    </span>
                  </Link>
                )
                : (
                  <span>
                    { challenge.name }
                  </span>
                )}

              <p styleName="subtrack-color">
                {underscoreReplace(typeName)}
              </p>
              <p styleName="date-completed">
                {challenge.submissionEndDate && formatDate(challenge.submissionEndDate)}
              </p>
              { challenge.wonFirst && !challenge.isPrivate
              && (
              <div styleName="winner-ribbon">
                <WinnerRibbon />
              </div>
              )
                    }
            </header>
            <div styleName="challenge-card__bottom">
              <div styleName="challenge-details data-science">
                { isMM(challenge)
                  && (
                  <div styleName="marathon-score">
                    <p styleName="score">
                      { challenge.pointTotal || 0 }
                    </p>
                    <p>
                      Total Points
                    </p>
                  </div>
                  ) }
                { isDevelopment
                  && (
                  <div styleName="dev-challenge-user-place">
                    <div styleName="tile-view">
                      { challenge.highestPlacement
                        && (
                        <p styleName={challenge.wonFirst ? 'first-place place' : 'place'}>
                          { challenge.highestPlacement }
                          <span>
                            { getPlacementPostfix(challenge.highestPlacement) }
                          </span>
                          {' '}
                          Place
                        </p>
                        )
                      }
                      { challenge.userStatus === 'NOT_FINISHED'
                        && (
                        <p styleName="place">
                          Didn&apos;t Finish
                        </p>
                        ) }
                      { challenge.userStatus === 'PASSED_SCREENING'
                        && (
                        <p styleName="place">
                          Passed Screening
                        </p>
                        ) }
                      { !challenge.highestPlacement && challenge.userStatus === 'PASSED_REVIEW'
                        && (
                        <p styleName="place">
                          Passed Review
                        </p>
                        ) }
                      { challenge.userStatus === 'COMPLETED'
                        && (
                        <p styleName="place">
                          COMPLETED
                        </p>
                        ) }
                      { challenge.userStatus === 'PASSED_REVIEW'
                        && challenge.userDetails.submissionReviewScore && (
                        <div styleName="challenge-score">
                          <p styleName="score">
                            { percentage(challenge.userDetails.submissionReviewScore / 100) }
                          </p>
                          <p styleName="last-child">
                            Review Score
                          </p>
                        </div>
                      ) }

                    </div>
                  </div>
                  )
                }
                {
                  isDesign && !challenge.isPrivate
                    && (
                    <div styleName="design-challenge-user-place">
                      <div styleName="tile-view">
                        { challenge.highestPlacement
                        && (
                        <p styleName={challenge.wonFirst ? 'first-place place' : 'place'}>
                          { challenge.highestPlacement }
                          <span>
                            { getPlacementPostfix(challenge.highestPlacement) }
                          </span>
                          {' '}
                          Place
                        </p>
                        )
                        }
                        { challenge.userStatus === 'NOT_FINISHED'
                          && (
                          <p styleName="place">
                            Didn&apos;t Finish
                          </p>
                          ) }
                        { challenge.userStatus === 'PASSED_SCREENING'
                          && (
                          <p styleName="place">
                            Passed Screening
                          </p>
                          ) }
                        { !challenge.highestPlacement && challenge.userStatus === 'PASSED_REVIEW'
                          && (
                          <p styleName="place">
                            Passed Review
                          </p>
                          ) }
                        { challenge.userStatus === 'COMPLETED'
                          && (
                          <p styleName="place">
                            COMPLETED
                          </p>
                          ) }
                        {
                          challenge.userStatus === 'PASSED_REVIEW'
                            && (
                            <div styleName="thumbnail" onClick={this.onPopModal} role="presentation">
                              {challenge.submissionViewable && challenge.imageURL
                              && (
                              <ReactImageFallback
                                initialImage={NoImage}
                                src={challenge.imageURL}
                                fallbackImage={NoImage}
                              />
                              )}
                              {challenge.submissionViewable && !challenge.imageURL
                              && (
                              <ReactImageFallback
                                src={NoImage}
                              />
                              )}
                              {!challenge.submissionViewable
                                && (
                                <div styleName="private-challenge-banner" title="Submissions for this challenge are confidential">
                                  <Private />
                                  <span>
                                    PRIVATE CHALLENGE
                                  </span>
                                </div>
                                )
                              }
                              {challenge.numImages > 0
                                && (
                                <div styleName="thumbnail-gallery">
                                  <div styleName="gallery-icon">
                                    <Gallery />
                                  </div>
                                  <div styleName="num-images">
                                    {challenge.submissionViewable
                                      && (
                                      <span>
                                        {challenge.numImages}
                                        {' '}
                                        IMAGES
                                      </span>
                                      )
                                    }
                                    {!challenge.submissionViewable
                                      && (
                                      <span>
                                        No image is visible
                                      </span>
                                      )
                                    }
                                  </div>
                                </div>
                                )
                              }
                            </div>
                            )
                        }
                        {challenge.userStatus !== 'PASSED_REVIEW' && <div styleName="thumbnail" />}
                      </div>
                    </div>
                    )
                }
                { challenge.isPrivate
                && (
                <div styleName="invite-only-banner">
                  <div styleName="title">
                    INVITE-ONLY CHALLENGE
                  </div>
                  <InviteOnly />
                  <span>
                    CHALLENGE INFORMATION IS CONFIDENTIAL
                    <br />
                    RESULTS ARE NOT INCLUDED IN STATISTICS
                  </span>
                </div>
                ) }
              </div>

              { !_.isEmpty(roles)
                && (
                <p styleName="roles">
                  { track !== COMPETITION_TRACKS.DS
                  && (
                  <span>
                    <span>
                      Role: &nbsp;
                    </span>
                    <span>
                      { listRoles(roles) }
                    </span>
                  </span>
                  ) }
                </p>
                ) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChallengeTile.defaultProps = {
  onPopModal: null,
  index: -1,
};

ChallengeTile.propTypes = {
  challenge: PT.shape().isRequired,
  onPopModal: PT.func,
  index: PT.number,
};

export default ChallengeTile;
