/**
 * Profile Page.  Displays the publicly available achievements, stats and skills
 * of a TopCoder member.
 */
/* eslint-env browser */
/* eslint-disable no-shadow */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { isomorphy } from 'topcoder-react-utils';
import { Modal } from 'topcoder-react-ui-kit';
import IconClose from 'assets/images/icon-close-green.svg';
import shortId from 'shortid';
import { actions } from 'topcoder-react-lib';
import { connect } from 'react-redux';

import ProfileStats from 'containers/ProfileStats';
import { dataMap } from './ExternalLink';
import Header from './Header';
import MemberTracks from './MemberTracks';

import styles from './styles.scss';
import Skills from './Skills';
import MemberInfo from './MemberInfo';
import Activity from './Activity';
import TcaCertificates from './TcaCertificates';
// import Awards from './Awards';

/**
 * Inspects a subtrack and determines if the member is active
 * based on submissions and/or ranks.
 *
 * @param {Object} subtrack Subtrack object
 * @return {Boolean}
 */
const isActiveSubtrack = (subtrack) => {
  if (subtrack.name === 'COPILOT_POSTING') {
    return false;
  }
  if (subtrack.rank && subtrack.rank.rating > 0) {
    return true;
  }
  if (_.isNumber(subtrack.submissions)) {
    return subtrack.submissions > 0;
  }
  return subtrack.submissions && subtrack.submissions.submissions > 0;
};

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // NOTE: When showDetails is true, track and subTrack must have been setted.
      track: '',
      subTrack: '',
      tab: '',
      isMobile: false,
      showDetails: false,
    };

    this.handleResize = this.handleResize.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
    this.isAlreadyLoadChallenge = React.createRef();
  }

  componentDidMount() {
    this.handleResize();
    if (isomorphy.isClientSide()) {
      window.addEventListener('resize', this.handleResize);
    }
  }

  componentWillUnmount() {
    if (isomorphy.isClientSide()) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  getActiveTracks() {
    const { copilot } = this.props;
    let { stats } = this.props;
    if (_.isArray(stats)) {
      // eslint-disable-next-line prefer-destructuring
      stats = stats[0];
    }
    const activeTracks = [];

    if (copilot && stats && stats.COPILOT && stats.COPILOT.fulfillment) {
      activeTracks.push({
        name: 'COPILOT',
        subTracks: [
          {
            fulfillment: stats.COPILOT.fulfillment,
            name: 'COPILOT',
          },
        ],
      });
    }

    ['DEVELOP', 'DESIGN', 'DATA_SCIENCE'].forEach((track) => {
      const active = [];
      const subTracks = stats && stats[track] ? stats[track].subTracks || [] : [];

      if (stats && stats[track] && stats[track].SRM) {
        subTracks.push({ ...stats[track].SRM, name: 'SRM' });
      }
      if (stats && stats[track] && stats[track].MARATHON_MATCH) {
        subTracks.push({
          ...stats[track].MARATHON_MATCH,
          name: 'MARATHON MATCH',
        });
      }

      subTracks.forEach((subtrack) => {
        if (isActiveSubtrack(subtrack)) {
          active.push({ ...subtrack, active: true });
        }
      });
      if (active.length > 0) {
        const sorted = _.orderBy(
          active,
          [s => s.wins, s => (s.rank ? s.rank.rating : 0)],
          ['desc', 'desc'],
        );
        activeTracks.push({ name: track, subTracks: sorted });
      }
    });

    return activeTracks;
  }

  handleResize() {
    this.setState({ isMobile: window.innerWidth < 768 });
  }

  closeDetails() {
    const { clearSubtrackChallenges, handleParam } = this.props;
    clearSubtrackChallenges(handleParam);
    this.setState({ showDetails: false, track: '', subTrack: '' });
  }

  render() {
    const {
      copilot,
      externalAccounts,
      externalLinks,
      challenges,
      skills: propSkills,
      stats,
      lookupData,
      handleParam,
      meta,
      tcAcademyCertifications,
      // rewards,
    } = this.props;

    const {
      track,
      subTrack,
      tab,
      isMobile,
      showDetails,
    } = this.state;

    let { info } = this.props;

    if (_.isNull(_.get(info, 'maxRating.rating', 0)) && !_.isEmpty(stats)) {
      info = _.assign(info, { maxRating: stats[0].maxRating });
    }

    // get country
    let country = '';
    if (_.has(lookupData, 'countries') && lookupData.countries.length > 0) {
      const countryCode = _.isEmpty(_.get(info, 'homeCountryCode'))
        ? _.get(info, 'competitionCountryCode')
        : _.get(info, 'homeCountryCode');

      const result = _.find(
        lookupData.countries,
        c => countryCode && c.countryCode === countryCode.toUpperCase(),
      );
      country = _.isEmpty(result) ? '' : result.country;
    }

    // Convert skills from object to an array for easier iteration
    const skills = propSkills
      ? _.map(propSkills, (skill, tagId) => ({ tagId, ...skill }))
      : [];

    let externals = externalAccounts
      ? _.map(
        _.pick(externalAccounts, _.map(dataMap, 'provider')),
        (data, type) => ({ type, data }),
      )
      : [];
    if (externalLinks) {
      externalLinks.map(data => externals.push({ type: 'weblink', data }));
      externals = _.filter(externals, 'data');
      externals = _.sortBy(externals, 'type');
    }

    // no rating MM
    const hasMM = !!(challenges && challenges.length);

    return (
      <div styleName="outer-container">
        <div>
          <Header info={info} />

          <div styleName="content">
            <div styleName="left-content">
              <MemberTracks copilot={copilot} info={info} hasMM={hasMM} />

              {!_.isEmpty(skills) && (
                <Skills skills={skills} isMobile={isMobile} />
              )}

              {info.description && (
                <p styleName="description">{info.description}</p>
              )}
            </div>
            <div styleName="right-content">
              <MemberInfo
                country={country}
                info={info}
                wins={_.get((stats && stats[0]) || {}, 'wins', 0)}
              />
            </div>
          </div>
        </div>
        {tcAcademyCertifications.length > 0 && (
          <TcaCertificates
            certificates={tcAcademyCertifications}
            memberHandle={handleParam}
          />
        )}
        {/* { */}
        {/*   (rewards || []).length ? ( */}
        {/*     <Awards rewards={rewards} /> */}
        {/*   ) : null */}
        {/* } */}
        <Activity
          memberStats={stats}
          hasMM={hasMM}
          onClick={({ track, subTrack }) => {
            this.isAlreadyLoadChallenge.current = false;
            this.setState({
              track, subTrack, showDetails: true, tab: '',
            });
          }}
        />
        { showDetails && (
          <Modal
            theme={{
              container: `${track === 'COPILOT' ? styles['modal-container-copilot'] : styles['modal-container']} ProfileModalContainer`,
              overlay: styles['modal-overlay'],
            }}
            onCancel={this.closeDetails}
          >
            <React.Fragment>
              <div styleName="header">
                <h2 styleName="title">
                  {
                    subTrack === 'SRM' ? 'Single round match'
                      : subTrack.replace('FIRST_2_FINISH', 'FIRST2FINISH').replace(/_/g, ' ')
                  }
                </h2>
                <div styleName="icon" role="presentation" onClick={this.closeDetails}>
                  <IconClose />
                </div>
              </div>
              <ProfileStats
                handleParam={handleParam}
                meta={meta}
                track={track}
                subTrack={subTrack}
                tab={tab}
                setTab={(tab) => {
                  this.setState({ tab });
                }}
                isAlreadyLoadChallenge={this.isAlreadyLoadChallenge}
              />
            </React.Fragment>
          </Modal>
        )}
      </div>
    );
  }
}

ProfilePage.defaultProps = {
  externalAccounts: null,
  externalLinks: null,
  challenges: null,
  skills: null,
  stats: null,
  // rewards: [],
  tcAcademyCertifications: [],
};

ProfilePage.propTypes = {
  copilot: PT.bool.isRequired,
  externalAccounts: PT.shape(),
  challenges: PT.arrayOf(PT.shape()),
  externalLinks: PT.arrayOf(PT.shape()),
  info: PT.shape().isRequired,
  skills: PT.shape(),
  stats: PT.arrayOf(PT.shape()),
  lookupData: PT.shape().isRequired,
  handleParam: PT.string.isRequired,
  meta: PT.shape().isRequired,
  // rewards: PT.arrayOf(PT.shape()),
  clearSubtrackChallenges: PT.func.isRequired,
  tcAcademyCertifications: PT.arrayOf(PT.shape()),
};

function mapDispatchToProps(dispatch) {
  const action = actions.members;

  return {
    clearSubtrackChallenges: (
      handle,
    ) => {
      const uuid = shortId();
      dispatch(action.getSubtrackChallengesInit(handle, uuid, 1));
    },
  };
}

const Container = connect(
  () => ({}),
  mapDispatchToProps,
)(ProfilePage);

export default Container;
