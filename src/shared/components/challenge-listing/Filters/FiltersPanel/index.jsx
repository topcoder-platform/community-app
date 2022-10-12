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
import React, { useEffect } from 'react';
import PT from 'prop-types';
import Select from 'components/Select';
import DateRangePicker from 'components/DateRangePicker';
import moment from 'moment';
import Tooltip from 'components/Tooltip';
import { config, Link } from 'topcoder-react-utils';
import { COMPOSE, PRIORITY } from 'react-css-super-themr';
import { getSectionOptions, REVIEW_OPPORTUNITY_TYPES } from 'utils/tc';
import {
  isFilterEmpty,
  isPastBucket,
  BUCKETS,
} from 'utils/challenge-listing/buckets';
import SwitchWithLabel from 'components/SwitchWithLabel';
import ChallengeSearchBar from 'containers/challenge-listing/ChallengeSearchBar';
import { challenge as challengeUtils } from 'topcoder-react-lib';
import { createStaticRanges } from 'utils/challenge-listing/date-range';
import ArrowIcon from 'assets/images/ico-arrow-down.svg';
import CircleIcon from 'assets/images/icon-circle.svg';
import Button from '../Button';
import UiSimpleRemove from '../../Icons/ui-simple-remove.svg';
import BucketSelector from '../../Sidebar/BucketSelector';
import CheckmarkIcon from './CheckmarkIcon';
import style from './style.scss';

const Filter = challengeUtils.filter;

export default function FiltersPanel({
  communityFilters,
  defaultCommunityId,
  filterState,
  // challenges,
  disabled,
  expanding,
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
  // validKeywords,
  validTypes,
  // isSavingFilter,
  expanded,
  setExpanded,
  setSort,
  selectBucket,
  recommendedToggle,
  setRecommendedToggle,
  tcoToggle,
  setTcoToggle,
}) {
  if (hidden && !expanded) {
    return (
      <Button
        styleName="filter-btn"
        onClick={() => {
          setExpanded(!expanded);
        }}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') {
            return;
          }
          setExpanded(!expanded);
        }}
        tabIndex={0}
        role="button"
      >
        More Filters
      </Button>
    );
  }

  const earnSectionAbbreviations = ['CH', 'F2F', 'TSK'];

  const competitiveProgrammingOptions = [
    { label: 'Marathon Match', value: 'MM' },
    { label: 'Rapid Development Match', value: 'RDM' },
    { label: 'Single Round Match', value: 'SRM' },
  ];

  const isVisitorRegisteredToCommunity = (visitorGroupIds, communityGroupIds) => Boolean(
    _.intersection(visitorGroupIds, communityGroupIds).length,
  );

  // const isAllBucket = activeBucket === BUCKETS.ALL;

  const getLabel = (community) => {
    const { communityName } = community;
    if (!isAuth) {
      return <div>{communityName}</div>;
    }

    // eslint-disable-next-line max-len
    const visitorGroupIds = auth.profile && auth.profile.groups
      ? auth.profile.groups.map(g => g.id)
      : [];
    const visitorRegisteredToCommunity = isVisitorRegisteredToCommunity(
      visitorGroupIds,
      community.groupIds,
    );

    const registrationStatus = visitorRegisteredToCommunity ? (
      <div>Registered</div>
    ) : (
      <div>
        You are <span styleName="bold uppercase">not</span> registered.
        <Link
          onMouseDown={(e) => {
            const url = community.mainSubdomain
              ? config.URL.BASE.replace(/www/, community.mainSubdomain)
              : `/community/${community.communityId}`;
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
            <div>{communityName}</div>
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
        <div>{/* {challengesInCommunity} */}</div>
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
            <div
              style={{ padding: '15px', fontSize: '13px', borderRadius: '5px' }}
            >
              <p>
                You are
                {!visitorRegisteredToCommunity && (
                  <span styleName="bold">NOT</span>
                )}{' '}
                registered for this sub community.
              </p>
              <p>
                There are
                {/* {challengesInCommunity} */} challenges in this sub community
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
    if (
      community.challengeFilter
      && community.challengeFilter.events
      && community.challengeFilter.events.length
    ) {
      return `event_${community.challengeFilter.events[0]}`;
    }

    return community.communityName === 'All' ? '' : community.groupIds[0];
  };

  const communityOps = communityFilters
    .filter(
      community => (!community.hidden && !community.hideFilter)
        || community.communityName === 'All',
    )
    .map(community => ({
      label: community.communityName,
      value: mapCommunityOps(community),
      name: community.communityName,
      data: getLabel(community),
    }));

  // const mapOps = item => ({ label: item, value: item });
  const mapTypes = item => ({
    label: item.name,
    value: item.abbreviation,
    description: item.description,
  });

  const getCommunityOption = () => {
    if (filterState.events && filterState.events.length) {
      return `event_${filterState.events[0]}`;
    }
    if (filterState.groups && filterState.groups.length) {
      return filterState.groups[0];
    }
    return '';
  };

  const isTrackOn = track => filterState.tracks && filterState.tracks[track];

  const switchTrack = (track, on) => {
    const act = on ? Filter.addTrack : Filter.removeTrack;
    const filterObj = act(filterState, track);
    setFilterState({ ...filterObj });
  };

  const updateFilterStateByTypes = (newTypes) => {
    setFilterState({
      ...filterState,
      types: newTypes,
    });
  };

  const toggleSection = (section, on) => {
    const filterObj = {};
    const sections = getSectionOptions(section);
    sections.forEach((item) => {
      filterObj[item] = on;
    });

    setFilterState({
      ...filterState,
      tracks: filterObj,
    });
  };

  const toggleOnlyTrack = (section, type) => {
    const filterObj = {};
    const sections = getSectionOptions(section);
    sections.forEach((item) => {
      filterObj[item] = false;
    });

    filterObj[type] = true;

    setFilterState({
      ...filterState,
      tracks: filterObj,
    });
  };

  const toggleTypes = (section, on) => {
    const options = getSectionOptions(section);
    const newTypes = on
      ? _.union(filterState.types, options)
      : filterState.types.filter(item => !options.includes(item));

    updateFilterStateByTypes(newTypes);
  };

  const toggleOnly = (section, type) => {
    const options = getSectionOptions(section);
    const reducedTypes = filterState.types.filter(
      item => !options.includes(item),
    );
    const newTypes = _.union(reducedTypes, [type]);
    updateFilterStateByTypes(newTypes);
  };

  const toggleOnlyLearn = (type) => {
    const options = getSectionOptions('Learn');
    const reducedTypes = filterState.types.filter(
      item => !options.includes(item),
    );

    const newTypes = _.union(reducedTypes, [type]);
    updateFilterStateByTypes(newTypes);
  };

  const toggleLearnSection = (section, on) => {
    const options = getSectionOptions(section);
    const newTypes = on
      ? _.union(filterState.types, options)
      : filterState.types.filter(item => !options.includes(item));

    updateFilterStateByTypes(newTypes);
  };

  const staticRanges = createStaticRanges();
  const past = isPastBucket(activeBucket);
  const disableClearFilterButtons = isFilterEmpty(
    filterState,
    past ? 'past' : '',
    activeBucket,
  );

  const isRecommendedChallengesVisible = activeBucket === 'openForRegistration' && config.ENABLE_RECOMMENDER;
  const isTcoChallengesVisible = activeBucket !== BUCKETS.REVIEW_OPPORTUNITIES;

  useEffect(() => {
    if (
      !isFilterEmpty(filterState, past ? 'past' : '', activeBucket)
      && recommendedToggle
      && filterState.types.length !== _.uniq(filterState.types).length
    ) {
      setFilterState({
        ...filterState,
        types: _.uniq(filterState.types),
      });
    }

    if (filterState.tco) {
      setTcoToggle(true);
    }
    if (filterState.recommended) {
      setRecommendedToggle(true);
    }
  }, [filterState]);

  const onSwitchTcoChallenge = (on) => {
    setFilterState({ ..._.clone(filterState), tco: on ? on.toString() : on });
    setTcoToggle(on);
  };

  const onSwitchRecommendedChallenge = (on) => {
    setFilterState({ ..._.clone(filterState), recommended: on });
    selectBucket(BUCKETS.OPEN_FOR_REGISTRATION);

    if (on) {
      setSort('openForRegistration', 'bestMatch');
      setFilterState({
        ...filterState,
        tracks: {
          Dev: true,
          Des: true,
          DS: true,
          QA: true,
          CMP: true,
        },
        search: '',
        tags: [],
        types: ['CH', 'F2F', 'TSK', 'MM', 'RDM', 'SKL', 'SRM', 'PC'],
        groups: [],
        events: [],
        endDateStart: null,
        startDateEnd: null,
        recommended: true,
      });
    } else {
      setSort('openForRegistration', 'startDate');
      setFilterState({
        ...filterState,
        recommended: false,
      });
    }
    setRecommendedToggle(on);
  };

  const recommendedCheckboxTip = (
    <div styleName="tctooltiptext">
      <p>Show the best competitions for you.</p>
    </div>
  );

  const tcoCheckboxTip = (
    <div styleName="tctooltiptext">
      <p>
        Earn TCO points by participating in these <br />
        competitions.{' '}
        <a
          href={config.URL.TCO_OPEN_URL}
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn more about TCO
        </a>
      </p>
    </div>
  );

  const resetFilters = () => {
    setRecommendedToggle(false);
    setTcoToggle(false);
    setSort('openForRegistration', 'startDate');
    setFilterState({
      tracks: {
        Dev: true,
        Des: true,
        DS: true,
        QA: true,
      },
      search: '',
      tco: false,
      tags: [],
      types: ['CH', 'F2F', 'TSK', 'MM', 'RDM', 'SKL', 'PC'],
      groups: [],
      events: [],
      endDateStart: null,
      startDateEnd: null,
      status: 'Active',
      reviewOpportunityTypes: _.keys(REVIEW_OPPORTUNITY_TYPES),
      customDate: false,
      recommended: false,
    });
    selectCommunity(defaultCommunityId);
    setSearchText('');
  };

  const renderSectionOptions = (title, options) => (
    <div styleName="filter-row">
      <div styleName="filter challenge-type">
        <div styleName="section-label">
          <span styleName="label">{title}</span>
          <div styleName={config.CHALLENGE_LISTING_HOVER
            ? 'hover-control section' : 'hover-control-hide'}
          >
            <span
              styleName="control-item"
              onClick={() => toggleTypes(title, true)}
              onKeyPress={() => toggleTypes(title, true)}
            >
              All
            </span>
            <span
              styleName="control-item"
              onClick={() => toggleTypes(title, false)}
              onKeyPress={() => toggleTypes(title, false)}
            >
              None
            </span>
          </div>
        </div>
        <div styleName="checkboxes">
          {options.map(option => (
            <div styleName="section-label">
              <span styleName="checkbox" key={option.value}>
                <SwitchWithLabel
                  enabled={(filterState.types || []).includes(option.value)}
                  labelAfter={option.label}
                  onSwitch={(e) => {
                    let { types } = filterState;

                    if (e) {
                      types = types.concat(option.value);
                    } else {
                      types = types.filter(type => type !== option.value);
                    }

                    updateFilterStateByTypes(types);
                  }}
                />
              </span>

              <div styleName={config.CHALLENGE_LISTING_HOVER
                ? 'hover-control' : 'hover-control-hide'}
              >
                <span
                  styleName="control-item"
                  onClick={() => toggleOnly(title, option.value)}
                  onKeyPress={() => toggleOnly(title, option.value)}
                >
                  Only
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const isDevSelected = filterState.tracks ? filterState.tracks.Dev : false;

  return (
    <div styleName="FiltersPanel">
      <div styleName="headerWrapper">
        <div styleName="header">
          <div styleName="mobile-buttons">
            <span styleName="title">Filters</span>
            <div styleName="mobile-button">
              <Button
                composeContextTheme={COMPOSE.SOFT}
                disabled={disableClearFilterButtons}
                onClick={resetFilters}
                theme={{ button: style.button }}
                themePriority={PRIORITY.ADHOC_DEFAULT_CONTEXT}
              >
                RESET FILTERS
              </Button>
            </div>
          </div>
          <span
            styleName="close-icon"
            onClick={() => onClose()}
            onKeyPress={() => onClose()}
          >
            <UiSimpleRemove className="cross" />
          </span>
        </div>
      </div>

      <div styleName="filters">
        <hr styleName="hr mobile" />
        {/* <div styleName="filter-row">
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
        </div> */}

        <div styleName="filter-row">
          <div styleName="search-bar">
            <ChallengeSearchBar setFilterState={setFilterState} />
          </div>
        </div>

        <div styleName="filter-row">
          <div styleName="bucket-selector-mobile">
            <BucketSelector
              activeBucket={activeBucket}
              disabled={disabled}
              expanding={expanding}
              isAuth={isAuth}
              selectBucket={selectBucket}
              past={past}
            />
          </div>
        </div>
        <hr styleName="hr mobile" />
        <div styleName="filter-row">
          <div styleName="filter track">
            <div styleName="section-label">
              <span styleName="label">Domain</span>

              <div styleName={config.CHALLENGE_LISTING_HOVER
                ? 'hover-control domain' : 'hover-control-hide'}
              >
                <span
                  styleName="control-item"
                  onClick={() => toggleSection('domain', true)}
                  onKeyPress={() => toggleSection('domain', true)}
                >
                  All
                </span>
                <span
                  styleName="control-item"
                  onClick={() => toggleSection('domain', false)}
                  onKeyPress={() => toggleSection('domain', false)}
                >
                  None
                </span>
              </div>
            </div>
            <div styleName="switches">
              <div styleName="section-label">
                <span
                  styleName="filter-switch-with-label"
                  aria-label={`Data Science toggle button pressed ${
                    isTrackOn('DS') ? 'On' : 'Off'
                  }`}
                  role="switch"
                  aria-checked={isTrackOn('DS')}
                >
                  <SwitchWithLabel
                    enabled={isTrackOn('DS')}
                    labelAfter="Data Science"
                    onSwitch={on => switchTrack('DS', on)}
                  />
                </span>
                <div styleName={config.CHALLENGE_LISTING_HOVER
                  ? 'hover-control' : 'hover-control-hide'}
                >
                  <span
                    styleName="control-item"
                    onClick={() => toggleOnlyTrack('domain', 'DS')}
                    onKeyPress={() => toggleOnlyTrack('domain', 'DS')}
                  >
                    Only
                  </span>
                </div>
              </div>
              <div styleName="section-label">
                <span
                  styleName="filter-switch-with-label"
                  aria-label={`Design toggle button pressed ${
                    isTrackOn('Des') ? 'On' : 'Off'
                  }`}
                  role="switch"
                  aria-checked={isTrackOn('Des')}
                >
                  <SwitchWithLabel
                    enabled={isTrackOn('Des')}
                    labelAfter="Design"
                    onSwitch={on => switchTrack('Des', on)}
                  />
                </span>
                <div styleName={config.CHALLENGE_LISTING_HOVER
                  ? 'hover-control' : 'hover-control-hide'}
                >
                  <span
                    styleName="control-item"
                    onClick={() => toggleOnlyTrack('domain', 'Des')}
                    onKeyPress={() => toggleOnlyTrack('domain', 'Des')}
                  >
                    Only
                  </span>
                </div>
              </div>
              <div styleName="section-label">
                <span
                  styleName="filter-switch-with-label"
                  aria-label={`Development toggle button pressed ${
                    isTrackOn('Dev') ? 'On' : 'Off'
                  }`}
                  role="switch"
                  aria-checked={isTrackOn('Dev')}
                >
                  <SwitchWithLabel
                    enabled={isTrackOn('Dev')}
                    labelAfter="Development"
                    onSwitch={on => switchTrack('Dev', on)}
                  />
                </span>
                <div styleName={config.CHALLENGE_LISTING_HOVER
                  ? 'hover-control' : 'hover-control-hide'}
                >
                  <span
                    styleName="control-item"
                    onClick={() => toggleOnlyTrack('domain', 'Dev')}
                    onKeyPress={() => toggleOnlyTrack('domain', 'Dev')}
                  >
                    Only
                  </span>
                </div>
              </div>
              <div styleName="section-label">
                <span
                  styleName="filter-switch-with-label"
                  aria-label={`QA toggle button pressed ${
                    isTrackOn('QA') ? 'On' : 'Off'
                  }`}
                  role="switch"
                  aria-checked={isTrackOn('QA')}
                >
                  <SwitchWithLabel
                    enabled={isTrackOn('QA')}
                    labelAfter="QA & Testing"
                    onSwitch={on => switchTrack('QA', on)}
                  />
                </span>
                <div styleName={config.CHALLENGE_LISTING_HOVER
                  ? 'hover-control' : 'hover-control-hide'}
                >
                  <span
                    styleName="control-item"
                    onClick={() => toggleOnlyTrack('domain', 'QA')}
                    onKeyPress={() => toggleOnlyTrack('domain', 'QA')}
                  >
                    Only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isReviewOpportunitiesBucket && <hr styleName="hr" />}
        {!isReviewOpportunitiesBucket
          ? renderSectionOptions(
            'Earn',
            validTypes
              .map(mapTypes)
              .filter(item => earnSectionAbbreviations.includes(item.value)),
          )
          : null}

        {!isReviewOpportunitiesBucket && isDevSelected && <hr styleName="hr" />}
        {!isReviewOpportunitiesBucket && isDevSelected
          ? renderSectionOptions(
            'Competitive Programming',
            competitiveProgrammingOptions,
          )
          : null}

        <hr styleName="hr" />
        <div styleName="filter-row">
          <div styleName="filter challenge-type">
            <div styleName="section-label">
              <span styleName="label">Learn</span>
              <div styleName={config.CHALLENGE_LISTING_HOVER
                ? 'hover-control section' : 'hover-control-hide'}
              >
                <span
                  styleName="control-item"
                  onClick={() => toggleLearnSection('Learn', true)}
                  onKeyPress={() => toggleLearnSection('Learn', true)}
                >
                  All
                </span>
                <span
                  styleName="control-item"
                  onClick={() => toggleLearnSection('Learn', false)}
                  onKeyPress={() => toggleLearnSection('Learn', false)}
                >
                  None
                </span>
              </div>
            </div>

            <div styleName="checkboxes">
              <div styleName="section-label">
                <span
                  styleName="checkbox"
                  role="switch"
                  aria-checked={isTrackOn('PC')}
                >
                  <SwitchWithLabel
                    enabled={(filterState.types || []).includes('PC')}
                    labelAfter="Practice"
                    onSwitch={(e) => {
                      let { types } = filterState;

                      if (e) {
                        types = types.concat('PC');
                      } else {
                        types = types.filter(type => type !== 'PC');
                      }

                      updateFilterStateByTypes(types);
                    }}
                  />
                </span>
                <div styleName={config.CHALLENGE_LISTING_HOVER
                  ? 'hover-control' : 'hover-control-hide'}
                >
                  <span
                    styleName="control-item"
                    onClick={() => toggleOnlyLearn('PC')}
                    onKeyPress={() => toggleOnlyLearn('PC')}
                  >
                    Only
                  </span>
                </div>
              </div>
              <div styleName="section-label">
                <span
                  styleName="checkbox"
                  role="switch"
                  aria-checked={isTrackOn('SKL')}
                >
                  <SwitchWithLabel
                    enabled={(filterState.types || []).includes('SKL')}
                    labelAfter="Skill Builder"
                    onSwitch={(e) => {
                      let { types } = filterState;

                      if (e) {
                        types = types.concat('SKL');
                      } else {
                        types = types.filter(type => type !== 'SKL');
                      }

                      setFilterState({ ..._.clone(filterState), types });
                    }}
                  />
                </span>
                <div styleName={config.CHALLENGE_LISTING_HOVER
                  ? 'hover-control' : 'hover-control-hide'}
                >
                  <span
                    styleName="control-item"
                    onClick={() => toggleOnlyLearn('SKL')}
                    onKeyPress={() => toggleOnlyLearn('SKL')}
                  >
                    Only
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr styleName="hr" />

        {past && (
          <div styleName="filter-row">
            <div styleName="filter past-period">
              <span styleName="label">Past Period</span>
              <div styleName="radios">
                {staticRanges.map(range => (
                  <span styleName="radio" key={range.label}>
                    <input
                      type="radio"
                      styleName="input-control"
                      name="past-period"
                      id={range.label}
                      value={range.label}
                      checked={
                        range.isCustom
                          ? filterState.customDate
                          : !filterState.customDate
                            && range.isSelected({
                              startDate: filterState.endDateStart,
                              endDate: filterState.startDateEnd,
                            })
                      }
                      onChange={() => {
                        if (range.isCustom) {
                          setFilterState({
                            ..._.clone(filterState),
                            customDate: true,
                          });
                        } else {
                          setFilterState({
                            ..._.clone(filterState),
                            endDateStart: moment(range.startDate).toISOString(),
                            startDateEnd: moment(range.endDate).toISOString(),
                            customDate: false,
                          });
                        }
                      }}
                    />
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label styleName="radio-label" htmlFor={range.label}>
                      {range.label}
                    </label>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {past && filterState.customDate && (
          <div styleName="filter-row">
            <div styleName="filter dates">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="input-start-date-range" styleName="label">
                Custom Date range
              </label>
              <DateRangePicker
                onChange={(range) => {
                  const d = range.endDate
                    ? moment(range.endDate).toISOString()
                    : null;
                  const s = range.startDate
                    ? moment(range.startDate).toISOString()
                    : null;
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
        )}

        {/* Only shown when the Review Opportunity bucket is selected */}
        {isReviewOpportunitiesBucket ? (
          <div styleName="filter-row">
            <div styleName="filter review-type">
              <label htmlFor="review-type-select" styleName="label">
                Review Type
                <input type="hidden" />
              </label>
              <div styleName="checkboxes">
                {Object.entries(REVIEW_OPPORTUNITY_TYPES)
                  .map(([value, label]) => ({ value, label }))
                  .map(option => (
                    <span styleName="checkbox" key={option.value}>
                      <SwitchWithLabel
                        enabled={filterState.reviewOpportunityTypes.includes(
                          option.value,
                        )}
                        labelAfter={option.label}
                        onSwitch={(e) => {
                          let { reviewOpportunityTypes = [] } = filterState;

                          if (e) {
                            reviewOpportunityTypes = reviewOpportunityTypes.concat(option.value);
                          } else {
                            reviewOpportunityTypes = reviewOpportunityTypes.filter(
                              reviewType => reviewType !== option.value,
                            );
                          }

                          setFilterState({
                            ..._.clone(filterState),
                            reviewOpportunityTypes,
                          });
                        }}
                      />
                    </span>
                  ))}
              </div>
            </div>
          </div>
        ) : null}

        {!isReviewOpportunitiesBucket
          && !(recommendedToggle && activeBucket === 'openForRegistration') && (
            <div styleName="filter-row">
              <div styleName="filter filter community">
                <label
                  htmlFor="community-select"
                  styleName="label community-label"
                >
                  Sub communities
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
                    <span styleName="active-community">{option.name}</span>
                  )}
                  arrowRenderer={ArrowIcon}
                />
              </div>
            </div>
        )}
        <hr styleName="hr" />

        {isRecommendedChallengesVisible && _.get(auth, 'user.userId') && (
          <React.Fragment>
            <div styleName="filter-row recommended-challenges-filter">
              <span
                styleName="recommended-select-label"
                aria-label={`Recommended competition toggle button pressed ${
                  recommendedToggle ? 'On' : 'Off'
                }`}
                role="switch"
                aria-checked={recommendedToggle}
              >
                <SwitchWithLabel
                  enabled={recommendedToggle}
                  labelAfter="Recommended Competitions"
                  onSwitch={onSwitchRecommendedChallenge}
                />
              </span>

              <div styleName="recommended-challenge-tooltip">
                <Tooltip
                  id="recommended-tip"
                  content={recommendedCheckboxTip}
                  className={style['tooltip-overlay']}
                  trigger={['hover', 'focus']}
                >
                  <CircleIcon />
                </Tooltip>
              </div>
            </div>
          </React.Fragment>
        )}
        {isTcoChallengesVisible && (
          <React.Fragment>
            <div styleName="filter-row tco-challenges-filter">
              <span
                styleName="tco-select-label"
                aria-label={`Tco eligible challenge toggle button pressed ${
                  tcoToggle ? 'On' : 'Off'
                }`}
                role="switch"
                aria-checked={tcoToggle}
              >
                <SwitchWithLabel
                  enabled={tcoToggle}
                  labelAfter="TCO Eligible Only"
                  onSwitch={onSwitchTcoChallenge}
                />
              </span>

              <div styleName="tco-challenge-tooltip">
                <Tooltip
                  id="tco-tip"
                  content={tcoCheckboxTip}
                  className={style['tooltip-overlay']}
                  trigger={['hover', 'focus']}
                >
                  <CircleIcon />
                </Tooltip>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>

      {((isRecommendedChallengesVisible && _.get(auth, 'user.userId'))
        || isTcoChallengesVisible) && <hr styleName="hr" />}

      <div styleName="buttons">
        <Button
          composeContextTheme={COMPOSE.SOFT}
          disabled={disableClearFilterButtons}
          onClick={resetFilters}
          theme={{ button: style.button }}
          themePriority={PRIORITY.ADHOC_DEFAULT_CONTEXT}
        >
          RESET FILTERS
        </Button>
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
  expanding: false,
  disabled: false,
};

FiltersPanel.propTypes = {
  communityFilters: PT.arrayOf(
    PT.shape({
      communityId: PT.string.isRequired,
      communityName: PT.string.isRequired,
    }),
  ).isRequired,
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
  // validKeywords: PT.arrayOf(PT.string).isRequired,
  validTypes: PT.arrayOf(PT.shape()).isRequired,
  onClose: PT.func,
  expanded: PT.bool.isRequired,
  setExpanded: PT.func.isRequired,
  setSort: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
  expanding: PT.bool,
  disabled: PT.bool,
  recommendedToggle: PT.bool.isRequired,
  setRecommendedToggle: PT.func.isRequired,
  tcoToggle: PT.bool.isRequired,
  setTcoToggle: PT.func.isRequired,
};
