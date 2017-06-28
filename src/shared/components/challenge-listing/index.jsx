/**
 * Challenge listing component.
 */

import _ from 'lodash';
import ChallengeFilters from 'containers/challenge-listing/FilterPanel';
import React from 'react';
import PT from 'prop-types';
import Sticky from 'react-stickynode';
import * as Filter from 'utils/challenge-listing/filter';
import Sidebar from 'containers/challenge-listing/Sidebar';

import Listing from './Listing';
import ChallengeCardPlaceholder from './placeholders/ChallengeCard';
import SRMCard from './SRMCard';

import './style.scss';

// Number of challenge placeholder card to display
const CHALLENGE_PLACEHOLDER_COUNT = 8;

export default function ChallengeListing(props) {
  let challenges = props.challenges;

  challenges = challenges.filter(
    Filter.getFilterFunction(props.filterState));

  const expanded = false;

  let challengeCardContainer;
  if (!expanded && props.loadingChallenges) {
    const challengeCards = _.range(CHALLENGE_PLACEHOLDER_COUNT)
    .map(key => <ChallengeCardPlaceholder id={key} key={key} />);
    challengeCardContainer = (
      <div styleName="challenge-cards-container">
        <div styleName="ChallengeCardExamples">
          { challengeCards }
        </div>
      </div>
    );
  } else {
    challengeCardContainer = (
      <Listing
        activeBucket={props.activeBucket}
        auth={props.auth}
        challenges={challenges}
        loadingDraftChallenges={props.loadingDraftChallenges}
        loadingPastChallenges={props.loadingPastChallenges}
        loadMoreDraft={props.loadMoreDraft}
        loadMorePast={props.loadMorePast}
        selectBucket={props.selectBucket}
        setFilterState={props.setFilterState}
        setSort={props.setSort}
        sorts={props.sorts}
      />
    );
  }

  return (
    <div styleName="ChallengeFiltersExample">
      <ChallengeFilters
        challengeGroupId={props.challengeGroupId}
        communityName={props.communityName}
        setCardType={_.noop/* cardType => this.setCardType(cardType) */}
        isCardTypeSet={'Challenges' /* this.state.currentCardType */}
      />
      <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'SRMs' ? '' :*/'hidden'}`}>
        <div styleName="sidebar-container-mobile">
          {/* <ChallengesSidebar SidebarMock={SRMsSidebarMock} /> */}
        </div>

        <div styleName="challenges-container SRMs-container">
          {/* happening now */}
          <div>
            <SRMCard category={'now'} />
          </div>
          {/* upcoming SRMs */}
          <div>
            <div styleName="title">Upcoming SRMs</div>
            { /* UpcomingSrm */ }
          </div>
          {/* past SRMs */}
          <div>
            <div styleName="title">Past SRMs</div>
            <SRMCard category={'past'} />
          </div>
        </div>

        <div styleName="sidebar-container-desktop">
          <Sticky top={20}>
            {/* <ChallengesSidebar SidebarMock={SRMsSidebarMock} /> */}
          </Sticky>
        </div>
      </div>

      <div styleName={`tc-content-wrapper ${/* this.state.currentCardType === 'Challenges' ? '' : 'hidden' */''}`}>
        <div styleName="sidebar-container-mobile">
          <Sidebar />
        </div>

        {challengeCardContainer}

        <div styleName="sidebar-container-desktop">
          <Sticky top={20}>
            <Sidebar />
          </Sticky>
        </div>
      </div>
    </div>
  );
}

ChallengeListing.defaultProps = {
  challengeGroupId: '',
  communityName: null,
  loadMoreDraft: null,
  loadMorePast: null,
  masterFilterFunc: () => true,
  auth: null,
};

ChallengeListing.propTypes = {
  activeBucket: PT.string.isRequired,
  challenges: PT.arrayOf(PT.shape()).isRequired,
  communityName: PT.string,
  filterState: PT.shape().isRequired,
  loadingChallenges: PT.bool.isRequired,
  loadingDraftChallenges: PT.bool.isRequired,
  loadingPastChallenges: PT.bool.isRequired,
  loadMoreDraft: PT.func,
  loadMorePast: PT.func,
  selectBucket: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  setSort: PT.func.isRequired,
  sorts: PT.shape().isRequired,
  challengeGroupId: PT.string,
  auth: PT.shape(),
};
