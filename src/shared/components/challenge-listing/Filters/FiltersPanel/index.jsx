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
import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import Select from 'components/Select';
import DateRangePicker from 'components/DateRangePicker';
import moment from 'moment';
import Tooltip from 'components/Tooltip';
import { config, Link } from 'topcoder-react-utils';
import { COMPOSE, PRIORITY } from 'react-css-super-themr';
import { REVIEW_OPPORTUNITY_TYPES } from 'utils/tc';
import { isFilterEmpty, isPastBucket, BUCKETS } from 'utils/challenge-listing/buckets';
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

  const isVisitorRegisteredToCommunity = (visitorGroupIds, communityGroupIds) => Boolean(
    _.intersection(visitorGroupIds, communityGroupIds).length,
  );

  // const isAllBucket = activeBucket === BUCKETS.ALL;

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

  // const mapOps = item => ({ label: item, value: item });
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

  const isTrackOn = track => filterState.tracks && filterState.tracks[track];

  const switchTrack = (track, on) => {
    const act = on ? Filter.addTrack : Filter.removeTrack;
    const filterObj = act(filterState, track);
    setFilterState({ ...filterObj });
  };

  const staticRanges = createStaticRanges();
  const past = isPastBucket(activeBucket);
  const disableClearFilterButtons = isFilterEmpty(filterState, past ? 'past' : '', activeBucket);

  const isRecommendedChallengesVisible = (activeBucket === 'openForRegistration' && config.ENABLE_RECOMMENDER);
  const isTcoChallengesVisible = activeBucket !== BUCKETS.REVIEW_OPPORTUNITIES;
  const [recommendedToggle, setRecommendedToggle] = useState(false);
  const [tcoToggle, setTcoToggle] = useState(false);

  useEffect(() => {
    if (!isFilterEmpty(filterState, past ? 'past' : '', activeBucket)
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
        },
        search: '',
        tags: [],
        types: ['CH', 'F2F', 'TSK'],
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
      <p>Show the best challenges for you.</p>
    </div>
  );

  const tcoCheckboxTip = (
    <div styleName="tctooltiptext">
      <p>Earn TCO points by participating in these <br />
        challenges. <a href={config.URL.TCO_OPEN_URL} target="_blank" rel="noreferrer noopener">Learn more about TCO</a>
      </p>
    </div>
  );

  return (
    <div styleName="FiltersPanel">
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

      <div styleName="filters">
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
        <div styleName="filter-row">
          <div styleName="filter track">
            <span styleName="label">
              Challenge Category
            </span>
            <div styleName="switches">
              <span styleName="filter-switch-with-label" aria-label={`Design toggle button pressed ${isTrackOn('Des') ? 'On' : 'Off'}`} role="switch" aria-checked={isTrackOn('Des')}>
                <SwitchWithLabel
                  enabled={isTrackOn('Des')}
                  labelAfter="Design"
                  onSwitch={on => switchTrack('Des', on)}
                />
              </span>
              <span styleName="filter-switch-with-label" aria-label={`Development toggle button pressed ${isTrackOn('Dev') ? 'On' : 'Off'}`} role="switch" aria-checked={isTrackOn('Dev')}>
                <SwitchWithLabel
                  enabled={isTrackOn('Dev')}
                  labelAfter="Development"
                  onSwitch={on => switchTrack('Dev', on)}
                />
              </span>
              <span styleName="filter-switch-with-label" aria-label={`Data Science toggle button pressed ${isTrackOn('DS') ? 'On' : 'Off'}`} role="switch" aria-checked={isTrackOn('DS')}>
                <SwitchWithLabel
                  enabled={isTrackOn('DS')}
                  labelAfter="Data Science"
                  onSwitch={on => switchTrack('DS', on)}
                />
              </span>
              <span styleName="filter-switch-with-label" aria-label={`QA toggle button pressed ${isTrackOn('QA') ? 'On' : 'Off'}`} role="switch" aria-checked={isTrackOn('QA')}>
                <SwitchWithLabel
                  enabled={isTrackOn('QA')}
                  labelAfter="QA"
                  onSwitch={on => switchTrack('QA', on)}
                />
              </span>
            </div>
          </div>
        </div>

        { !isReviewOpportunitiesBucket
          && (
            <div styleName="filter-row">
              <div styleName="filter challenge-type">
                <span styleName="label">
                  Challenge Type
                </span>
                <div styleName="checkboxes">
                  {
                    validTypes
                      .map(mapTypes)
                      .map(option => (
                        <span styleName="checkbox" key={option.value}>
                          <SwitchWithLabel
                            enabled={filterState.types.includes(option.value)}
                            labelAfter={option.label}
                            onSwitch={(e) => {
                              let { types } = filterState;

                              if (e) {
                                types = types.concat(option.value);
                              } else {
                                types = types.filter(type => type !== option.value);
                              }

                              setFilterState({ ..._.clone(filterState), types });
                            }}
                          />
                        </span>
                      ))
                  }
                </div>
              </div>
            </div>
          )
        }

        { past
          && (
            <div styleName="filter-row">
              <div styleName="filter past-period">
                <span styleName="label">
                  Past Period
                </span>
                <div styleName="radios">
                  {
                    staticRanges.map(range => (
                      <span styleName="radio" key={range.label}>
                        <input
                          type="radio"
                          styleName="input-control"
                          name="past-period"
                          id={range.label}
                          value={range.label}
                          checked={range.isCustom
                            ? filterState.customDate
                            : !filterState.customDate && range.isSelected({
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
                        <label styleName="radio-label" htmlFor={range.label}>{range.label}</label>
                      </span>
                    ))
                  }
                </div>
              </div>
            </div>
          )
        }

        { past && filterState.customDate
          && (
            <div styleName="filter-row">
              <div styleName="filter dates">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="input-start-date-range" styleName="label">
                  Custom Date range
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
          )
        }

        {/* Only shown when the Review Opportunity bucket is selected */}
        { isReviewOpportunitiesBucket
          ? (
            <div styleName="filter-row">
              <div styleName="filter review-type">
                <label htmlFor="review-type-select" styleName="label">
                  Review Type
                  <input type="hidden" />
                </label>
                <div styleName="checkboxes">
                  {
                    Object.entries(REVIEW_OPPORTUNITY_TYPES)
                      .map(([value, label]) => ({ value, label }))
                      .map(option => (
                        <span styleName="checkbox" key={option.value}>
                          <SwitchWithLabel
                            enabled={filterState.reviewOpportunityTypes.includes(option.value)}
                            labelAfter={option.label}
                            onSwitch={(e) => {
                              let { reviewOpportunityTypes = [] } = filterState;

                              if (e) {
                                reviewOpportunityTypes = reviewOpportunityTypes
                                  .concat(option.value);
                              } else {
                                reviewOpportunityTypes = reviewOpportunityTypes.filter(
                                  reviewType => reviewType !== option.value,
                                );
                              }

                              setFilterState({ ..._.clone(filterState), reviewOpportunityTypes });
                            }}
                          />
                        </span>
                      ))
                  }
                </div>
              </div>
            </div>
          ) : null
        }

        { !isReviewOpportunitiesBucket && !(recommendedToggle && activeBucket === 'openForRegistration')
          && (
            <div styleName="filter-row">
              <div styleName="filter filter community">
                <label htmlFor="community-select" styleName="label">
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
                    <span styleName="active-community">
                      {option.name}
                    </span>
                  )}
                  arrowRenderer={ArrowIcon}
                />
              </div>
            </div>
          )
        }
        <hr styleName="hr" />

        {
          isRecommendedChallengesVisible && _.get(auth, 'user.userId')
          && (
            <React.Fragment>
              <div styleName="filter-row recommended-challenges-filter">
                <span
                  styleName="recommended-select-label"
                  aria-label={`Recommended challenge toggle button pressed ${recommendedToggle ? 'On' : 'Off'}`}
                  role="switch"
                  aria-checked={recommendedToggle}
                >
                  <SwitchWithLabel
                    enabled={recommendedToggle}
                    labelAfter="Recommended Challenges"
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
          )
        }
        {
          isTcoChallengesVisible
          && (
            <React.Fragment>
              <div styleName="filter-row tco-challenges-filter">
                <span
                  styleName="tco-select-label"
                  aria-label={`Tco eligible challenge toggle button pressed ${tcoToggle ? 'On' : 'Off'}`}
                  role="switch"
                  aria-checked={tcoToggle}
                >
                  <SwitchWithLabel
                    enabled={tcoToggle}
                    labelAfter="Only Show TCO Eligible Challenges"
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
          )
        }
      </div>

      {
        ((isRecommendedChallengesVisible && _.get(auth, 'user.userId')) || isTcoChallengesVisible)
          && (<hr styleName="hr" />)
      }

      <div styleName="buttons">
        <Button
          composeContextTheme={COMPOSE.SOFT}
          disabled={disableClearFilterButtons}
          onClick={() => {
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
              types: ['CH', 'F2F', 'TSK'],
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
            // localStorage.setItem('trackStatus', JSON.stringify({}));
          }}
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
  // validKeywords: PT.arrayOf(PT.string).isRequired,
  validTypes: PT.arrayOf(PT.shape()).isRequired,
  onClose: PT.func,
  expanded: PT.bool.isRequired,
  setExpanded: PT.func.isRequired,
  setSort: PT.func.isRequired,
  selectBucket: PT.func.isRequired,
  expanding: PT.bool,
  disabled: PT.bool,
};
