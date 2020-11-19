/* eslint jsx-a11y/no-static-element-interactions:0 */
/* global window */

/**
 * Challenge filters panel.
 *
 * It contains:
 *  - Challenge keywords filter;
 *  - Challenge tracks filter;
 *  - Challenge dates range filter;
 *  - Clear and save filter buttons.
 *
 * Challenge keywords and tracks filters allow to choose multiple keywords from
 * the predefined sets, which should be passed into the component as string arrays
 * via the 'validKeywords' and 'validTracks' properties. The whole filters panel
 * can be hidden/displayed by setting the boolean 'hidden' property.
 *
 * Each time the user modifies any filter, this component triggers the callback
 * provided via the 'onFilter' property, if any, passing in the current filter
 * object.
 */
/* eslint-disable jsx-a11y/label-has-for */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import Select from 'components/Select';
import DateRangePicker from 'components/DateRangePicker';
import moment from 'moment';
import { Button } from 'topcoder-react-ui-kit';
import Tooltip from 'components/Tooltip';
import { config, Link } from 'topcoder-react-utils';
import { COMPOSE, PRIORITY } from 'react-css-super-themr';
import { REVIEW_OPPORTUNITY_TYPES } from 'utils/tc';
import { BUCKETS, isFilterEmpty } from 'utils/challenge-listing/buckets';
import CheckmarkIcon from './CheckmarkIcon';
import style from './style.scss';
import UiSimpleRemove from '../../Icons/ui-simple-remove.svg';


export default function FiltersPanel({
  communityFilters,
  defaultCommunityId,
  filterState,
  // challenges,
  hidden,
  isAuth,
  auth,
  isReviewOpportunitiesBucket,
  activeBucket,
  onClose,
  // onSaveFilter,
  selectCommunity,
  // selectedCommunityId,
  setFilterState,
  setSearchText,
  validKeywords,
  validTypes,
  // isSavingFilter,
}) {
  let className = 'FiltersPanel';
  if (hidden) className += ' hidden';

  const isVisitorRegisteredToCommunity = (visitorGroupIds, communityGroupIds) => Boolean(
    _.intersection(visitorGroupIds, communityGroupIds).length,
  );

  const isAllBucket = activeBucket === BUCKETS.ALL;

  const getLabel = (community) => {
    const { communityName } = community;
    if (!isAuth) {
      return (
        <div>
          {communityName}
        </div>
      );
    }

    // eslint-disable-next-line max-len
    const visitorGroupIds = (auth.profile && auth.profile.groups) ? auth.profile.groups.map(g => g.id) : [];
    const visitorRegisteredToCommunity = isVisitorRegisteredToCommunity(
      visitorGroupIds,
      community.groupIds,
    );

    const registrationStatus = visitorRegisteredToCommunity
      ? (
        <div>
          Registered
        </div>
      )
      : (
        <div>
          You are
          {' '}
          <span styleName="bold uppercase">
            not
          </span>
          {' '}
          registered.
          <Link
            onMouseDown={(e) => {
              const url = community.mainSubdomain ? (
                config.URL.BASE.replace(/www/, community.mainSubdomain)
              ) : `/community/${community.communityId}`;
              window.open(url);
              e.stopPropagation();
              e.preventDefault();
            }}
            styleName="learn-more-link"
            to=""
            openInNewTab
          >
            Learn more
          </Link>
        </div>
      );

    // const filterFunction = Filter.getFilterFunction(community.challengeFilter);
    // const challengesInCommunity = challenges.filter(filterFunction).length;

    const selectItem = (
      <div styleName="community-select-item">
        <div>
          <div styleName="community-name">
            <div>
              {communityName}
            </div>
            {visitorRegisteredToCommunity && (
              <div styleName="checkmark-icon-container">
                <CheckmarkIcon color="#fff" />
              </div>
            )}
          </div>
          <div styleName="registration-status">
            {communityName === 'All'
              ? 'Select to see all challenges'
              : registrationStatus}
          </div>
        </div>
        <div>
          {/* {challengesInCommunity} */}
        </div>
      </div>
    );

    if (communityName === 'All') {
      return selectItem;
    }

    return (
      <div>
        <Tooltip
          position="bottom"
          trigger={['hover']}
          content={(
            <div style={{ padding: '15px', fontSize: '13px', borderRadius: '5px' }}>
              <p>
                You are
                { !visitorRegisteredToCommunity && (
                <span styleName="bold">
                  NOT
                </span>
                )}
                {' '}
                registered for this sub community.
              </p>
              <p>
                There are
                {/* {challengesInCommunity} */}
                {' '}
                challenges in this sub community
              </p>
            </div>
)}
        >
          {selectItem}
        </Tooltip>
      </div>
    );
  };

  const mapCommunityOps = (community) => {
    if (community.challengeFilter
      && community.challengeFilter.events && community.challengeFilter.events.length) {
      return `event_${community.challengeFilter.events[0]}`;
    }

    return community.communityName === 'All' ? '' : community.groupIds[0];
  };

  const communityOps = communityFilters.filter(community => (
    (!community.hidden && !community.hideFilter) || community.communityName === 'All'
  ))
    .map(community => ({
      label: community.communityName,
      value: mapCommunityOps(community),
      name: community.communityName,
      data: getLabel(community),
    }));

  // const disableClearSaveFilterButtons = false;
  // const disableClearSaveFilterButtons = isSavingFilter || (
  //   selectedCommunityId === defaultCommunityId
  //   && _.isEmpty(filterState)
  // );
  const disableClearSaveFilterButtons = isFilterEmpty(filterState);

  const mapOps = item => ({ label: item, value: item });
  const mapTypes = item => ({ label: item.name, value: item.abbreviation });
  const getCommunityOption = () => {
    if (filterState.events && filterState.events.length) {
      return `event_${filterState.events[0]}`;
    }
    if (filterState.groups && filterState.groups.length) {
      return filterState.groups[0];
    }
    return '';
  };

  return (
    <div styleName={className}>
      <div styleName="header">
        <span styleName="title">
          Filters
        </span>
        <span
          styleName="close-icon"
          onClick={() => onClose()}
          onKeyPress={() => onClose()}
        >
          <UiSimpleRemove className="cross" />
        </span>
      </div>
      <div styleName="filters inGroup">
        <div styleName="filter-row">
          <div styleName="filter keywords">
            <label htmlFor="keyword-select" styleName="left-label">
              Keywords
              <input type="hidden" />
            </label>
            <Select
              placeholder="Select Keywords"
              id="keyword-select"
              multi
              onChange={(value) => {
                const tags = value ? value.split(',') : undefined;
                setFilterState({ ..._.clone(filterState), tags });
              }}
              options={validKeywords.map(mapOps)}
              simpleValue
              value={filterState.tags ? filterState.tags.join(',') : null}
            />
          </div>
          <div styleName="filter community">
            <label htmlFor="community-select">
              Sub community
              <input type="hidden" />
            </label>
            <Select
              autoBlur
              clearable={false}
              id="community-select"
              // onChange={selectCommunity}
              onChange={(value) => {
                if (value && value.startsWith('event_')) {
                  const event = value.split('_')[1];
                  setFilterState({
                    ..._.clone(filterState),
                    events: event === '' ? [] : [event],
                    groups: [],
                  });
                } else {
                  const group = value;
                  setFilterState({
                    ..._.clone(filterState),
                    groups: group === '' ? [] : [group],
                    events: [],
                  });
                }
                // setFilterState({ ..._.clone(filterState), groups: [value] });
              }}
              options={communityOps}
              simpleValue
              value={getCommunityOption()}
              valueRenderer={option => (
                <span styleName="active-community">
                  {option.name}
                </span>
              )}
            />
          </div>
        </div>
        <div styleName="filter-row">
          <div styleName="filter track">
            <label htmlFor="type-select" styleName="left-label">
              Type
              <input type="hidden" />
            </label>
            <Select
              placeholder="Select Type"
              id="type-select"
              multi
              onChange={(value) => {
                const types = value ? value.split(',') : undefined;
                setFilterState({ ..._.clone(filterState), types });
              }}
              options={validTypes.map(mapTypes)}
              simpleValue
              value={
                (filterState.types && !isReviewOpportunitiesBucket) ? filterState.types.join(',') : null
              }
              disabled={isReviewOpportunitiesBucket}
            />
          </div>
          {/* Only shown when the Review Opportunity bucket is selected */}
          { isReviewOpportunitiesBucket
            ? (
              <div styleName="filter review-type">
                <label htmlFor="review-type-select">
                  Review Type
                  <input type="hidden" />
                </label>
                <Select
                  autoBlur
                  clearable={false}
                  id="review-type-select"
                  onChange={(value) => {
                    const reviewOpportunityType = value === 0 ? undefined : value;
                    setFilterState({ ..._.clone(filterState), reviewOpportunityType });
                  }}
                  options={[
                    { label: 'All', value: 0 }, // 0 value deactivates above filter
                    ...Object.entries(REVIEW_OPPORTUNITY_TYPES)
                      .map(([value, label]) => ({ value, label })),
                  ]}
                  simpleValue
                  value={filterState.reviewOpportunityType || 0}
                />
              </div>
            ) : null
          }
          {/* Only shown when the All Challenges bucket is selected */}
          { isAllBucket
            ? (
              <div styleName="filter status">
                <label htmlFor="status-select" styleName="left-label">
                  Status
                  <input type="hidden" />
                </label>
                <Select
                  placeholder="Select Status"
                  id="status-select"
                  onChange={(value) => {
                    const status = value;
                    setFilterState({ ..._.clone(filterState), status });
                  }}
                  options={['Active', 'Completed', 'All'].map(mapOps)}
                  simpleValue
                  value={filterState.status || 'All'}
                />
              </div>
            ) : null
          }
          <div styleName="filter dates">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="input-start-date-range">
              Date range
            </label>
            <DateRangePicker
              onChange={(range) => {
                const d = range.endDate ? moment(range.endDate).toISOString() : null;
                const s = range.startDate ? moment(range.startDate).toISOString() : null;
                setFilterState({
                  ..._.clone(filterState),
                  endDateStart: s,
                  startDateEnd: d,
                });
              }}
              range={{
                startDate: filterState.endDateStart
                  ? moment(filterState.endDateStart).toDate()
                  : null,
                endDate: filterState.startDateEnd
                  ? moment(filterState.startDateEnd).toDate()
                  : null,
              }}
            />
          </div>
        </div>
      </div>
      <div styleName="buttons">
        <Button
          composeContextTheme={COMPOSE.SOFT}
          disabled={disableClearSaveFilterButtons}
          onClick={() => {
            setFilterState({
              tracks: {
                Dev: true,
                Des: true,
                DS: true,
                QA: true,
              },
              name: '',
              tags: [],
              types: [],
              groups: [],
              events: [],
              endDateStart: null,
              startDateEnd: null,
              status: 'All',
              reviewOpportunityType: undefined,
            });
            selectCommunity(defaultCommunityId);
            setSearchText('');
            // localStorage.setItem('trackStatus', JSON.stringify({}));
          }}
          size="sm"
          theme={{ button: style.button }}
          themePriority={PRIORITY.ADHOC_DEFAULT_CONTEXT}
        >
          Clear filters
        </Button>
        {/* <PrimaryButton
          disabled={disableClearSaveFilterButtons || !isAuth}
          onClick={onSaveFilter}
          size="sm"
          theme={{ button: style.button }}
        >
          Save filter
        </PrimaryButton> */}
      </div>
    </div>
  );
}

FiltersPanel.defaultProps = {
  // challenges: [],
  hidden: false,
  isAuth: false,
  // isSavingFilter: false,
  isReviewOpportunitiesBucket: false,
  // onSaveFilter: _.noop,
  onClose: _.noop,
};

FiltersPanel.propTypes = {
  communityFilters: PT.arrayOf(PT.shape({
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
  })).isRequired,
  defaultCommunityId: PT.string.isRequired,
  activeBucket: PT.string.isRequired,
  filterState: PT.shape().isRequired,
  // challenges: PT.arrayOf(PT.shape()),
  hidden: PT.bool,
  isAuth: PT.bool,
  auth: PT.shape().isRequired,
  // isSavingFilter: PT.bool,
  isReviewOpportunitiesBucket: PT.bool,
  // onSaveFilter: PT.func,
  selectCommunity: PT.func.isRequired,
  // selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSearchText: PT.func.isRequired,
  validKeywords: PT.arrayOf(PT.string).isRequired,
  validTypes: PT.arrayOf(PT.shape()).isRequired,
  onClose: PT.func,
};
