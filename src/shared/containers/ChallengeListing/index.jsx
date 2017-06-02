/**
 * This is a container component for ChallengeFiltersExample.
 * It represents community-challenge-listing page.
 *
 * ChallengeFiltersExample component was brought from another project with different approach
 * and it takes care about everything it needs by itself.
 * So this container components almost doing nothing now.
 * Though this component defines a master filter function
 * which is used to define which challenges should be listed for the certain community.
 */

import _ from 'lodash';
import actions from 'actions/challenge-listing';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import ChallengeFiltersExample from 'components/challenge-listing';
import Banner from 'components/tc-communities/Banner';
import NewsletterSignup from 'components/tc-communities/NewsletterSignup';
import shortid from 'shortid';
import style from './styles.scss';

// The container component
class ChallengeListingPageContainer extends React.Component {

  constructor(props) {
    super(props);
    this.masterFilterFunc = this.masterFilterFunc.bind(this);
  }

  componentDidMount() {
    this.loadChallenges();
  }

  componentDidUpdate(prevProps) {
    const token = this.props.auth.tokenV3;
    if (token && token !== prevProps.auth.tokenV3) {
      setImmediate(() => this.loadChallenges());
    }
  }

  loadChallenges() {
    const { tokenV3, user } = this.props.auth;
    const groupIds = this.props.challengeGroupId || undefined;

    /* Initial loading of the challenges. Later we'll add some extra
      conditions to prevent loading when data are up-to-date because
      of server-side rendering, or because we have been at this page
      recently. */

    /* Active challenges. */
    this.props.getChallenges({
      groupIds,
      status: 'ACTIVE',
    }, {}, tokenV3, 'active');
    this.props.getMarathonMatches({
      groupIds,
      status: 'ACTIVE',
    }, {}, tokenV3, 'activeMM');

    /* My active challenges. */
    if (user) {
      this.props.getChallenges({
        groupIds,
        status: 'ACTIVE',
      }, {}, tokenV3, 'myActive', user.handle);
      this.props.getMarathonMatches({
        groupIds,
        status: 'ACTIVE',
      }, {}, tokenV3, 'myActiveMM', user.handle);
    }

    /* Past challenges. */
    this.props.getChallenges({
      groupIds,
      status: 'COMPLETED',
    }, {}, tokenV3, 'past');
    this.props.getMarathonMatches({
      groupIds,
      status: 'PAST',
    }, {}, tokenV3, 'pastMM');
  }

  /**
   * It takes one challenge object and check if it passes master filter
   * which defines which challenges should be displayed for the current community
   *
   * @param  {Object}  challenge object
   * @return {boolean} whether the item pass filter or not
   */
  masterFilterFunc(item) {
    let keyword;

    // if there is tag in props, use it as keyword
    if (this.props.tag) {
      keyword = this.props.tag;

    // if there is defined keyword param in the route, use it as keyword
    } else if (this.props.match && this.props.match.params && this.props.match.params.keyword) {
      keyword = this.props.match.params.keyword;

    // if keyword is not defined at all, don't filter
    } else {
      return true;
    }

    const techs = ` ${item.technologies.toLowerCase()} `;

    return !!(techs.indexOf(` ${keyword.toLowerCase()} `) >= 0);
  }

  render() {
    const { challengeGroupId, listingOnly } = this.props;
    return (
      <div>
        {/* For demo we hardcode banner properties so we can disable max-len linting */}
        {/* eslint-disable max-len */}
        { !listingOnly ? (
          <Banner
            title="Challenges"
            text="Browse our available challenges and compete. Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut laoreet sodales nisi, quis iaculis nulla iaculis vitae. Donec sagittis faucibus lacus eget blandit. "
            theme={{
              container: style.bannerContainer,
              content: style.bannerContent,
              contentInner: style.bannerContentInner,
            }}
            imageSrc="/themes/wipro2/challenges/banner.jpg"
          />
        ) : null
        }
        {/* eslint-enable max-len */}
        <ChallengeFiltersExample
          challenges={this.props.challengeListing.challenges}
          getChallenges={this.props.getChallenges}
          getMarathonMatches={this.props.getMarathonMatches}
          loading={Boolean(_.keys(this.props.challengeListing.pendingRequests).length)}

          /* OLD PROPS BELOW */
          challengeGroupId={challengeGroupId}
          filterFromUrl={this.props.location.hash}
          masterFilterFunc={this.masterFilterFunc}
          onSaveFilterToUrl={(filter) => {
            this.props.history.replace(`#${encodeURI(filter)}`);
          }}
          isAuth={!!this.props.auth.user}
          auth={this.props.auth}
        />
        { !listingOnly ? (
          <NewsletterSignup
            title="Sign up for our newsletter"
            text="Don’t miss out on the latest Topcoder IOS challenges and information!"
            imageSrc="/themes/wipro2/subscribe-bg.jpg"
          />
        ) : null }
      </div>
    );
  }
}

ChallengeListingPageContainer.defaultProps = {
  challengeGroupId: '',
  listingOnly: false,
  match: null,
  tag: null,
};

ChallengeListingPageContainer.propTypes = {
  challengeListing: PT.shape({
    challenges: PT.arrayOf(PT.shape({})).isRequired,
    pendingRequests: PT.shape({}).isRequired,
  }).isRequired,
  getChallenges: PT.func.isRequired,
  getMarathonMatches: PT.func.isRequired,

  /* OLD PROPS BELOW */
  listingOnly: PT.bool,
  match: PT.shape({
    params: PT.shape({
      keyword: PT.string,
    }),
  }),
  challengeGroupId: PT.string,
  tag: PT.string,
  history: PT.shape({
    replace: PT.func.isRequired,
  }).isRequired,
  location: PT.shape({
    hash: PT.string,
  }).isRequired,
  auth: PT.shape({
    tokenV3: PT.string,
    user: PT.shape(),
  }).isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  challengeListing: state.challengeListing,
});

/**
 * Callback for loading challenges satisfying to the specified criteria.
 * All arguments starting from second should match corresponding arguments
 * of the getChallenges action.
 * @param {Function} dispatch
 */
function getChallenges(dispatch, ...rest) {
  const uuid = shortid();
  dispatch(actions.challengeListing.getInit(uuid));
  dispatch(actions.challengeListing.getChallenges(uuid, ...rest));
}

/**
 * Callback for loading marathon matches satisfying to the specified criteria.
 * All arguments starting from second should match corresponding arguments
 * of the getChallenges action.
 * @param {Function} dispatch
 */
function getMarathonMatches(dispatch, ...rest) {
  const uuid = shortid();
  dispatch(actions.challengeListing.getInit(uuid));
  dispatch(actions.challengeListing.getMarathonMatches(uuid, ...rest));
}

function mapDispatchToProps(dispatch) {
  return {
    getChallenges: (...rest) => getChallenges(dispatch, ...rest),
    getMarathonMatches: (...rest) => getMarathonMatches(dispatch, ...rest),
    reset: () => dispatch(actions.challengeListing.reset()),
  };
}

const ChallengeListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChallengeListingPageContainer);

export default ChallengeListingContainer;
