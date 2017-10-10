/* eslint jsx-a11y/no-static-element-interactions:0 */

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

import _ from 'lodash';
import * as Filter from 'utils/challenge-listing/filter';
import React from 'react';
import PT from 'prop-types';
import Select from 'components/Select';
import moment from 'moment';
import { Button, PrimaryButton } from 'components/buttons';
import { COMPOSE, PRIORITY } from 'react-css-super-themr';

import DateRangePicker from '../DateRangePicker';
import style from './style.scss';
import UiSimpleRemove from '../../Icons/ui-simple-remove.svg';

export default function FiltersPanel({
  communityFilters,
  filterState,
  hidden,
  onClose,
  onSaveFilter,
  selectCommunity,
  selectedCommunityId,
  setFilterState,
  setSearchText,
  validKeywords,
  validSubtracks,
  isSavingFilter,
}) {
  let className = 'FiltersPanel';
  if (hidden) className += ' hidden';

  const communityOps = communityFilters.map(item => ({
    label: item.communityName,
    value: item.communityId,
  }));

  const mapOps = item => ({ label: item, value: item });
  const mapSubtracks = item => ({ label: item.name, value: item.subTrack });
  return (
    <div styleName={className}>
      <div styleName="header">
        <span styleName="title">Filters</span>
        <span styleName="close-icon" onClick={() => onClose()}>
          <UiSimpleRemove className="cross" />
        </span>
      </div>
      <div styleName="filters inGroup">
        <div styleName="filter-row">
          <div styleName="filter keywords">
            <label htmlFor="keyword-select" styleName="left-label">Keywords</label>
            <Select
              id="keyword-select"
              multi
              onChange={(value) => {
                const tags = value ? value.split(',') : undefined;
                setFilterState(Filter.setTags(filterState, tags));
              }}
              options={validKeywords.map(mapOps)}
              simpleValue
              value={filterState.tags ? filterState.tags.join(',') : null}
            />
          </div>
          <div styleName="filter community">
            <label htmlFor="community-select">Sub community</label>
            <Select
              autoBlur
              clearable={false}
              id="community-select"
              onChange={selectCommunity}
              options={communityOps}
              simpleValue
              value={selectedCommunityId}
            />
          </div>
        </div>
        <div styleName="filter-row">
          <div styleName="filter track">
            <label htmlFor="track-select" styleName="left-label">Subtrack</label>
            <Select
              id="track-select"
              multi
              onChange={(value) => {
                const subtracks = value ? value.split(',') : undefined;
                setFilterState(Filter.setSubtracks(filterState, subtracks));
              }}
              options={validSubtracks.map(mapSubtracks)}
              simpleValue
              value={
                filterState.subtracks ? filterState.subtracks.join(',') : null
              }
            />
          </div>
          <div styleName="filter dates hidetwomonthdatepicker">
            <label htmlFor="date-range-picker">Date range</label>
            <DateRangePicker
              numberOfMonths={1}
              endDate={filterState.endDate && moment(filterState.endDate)}
              id="date-range-picker"
              onDatesChange={(dates) => {
                let d = dates.endDate ? dates.endDate.toISOString() : null;
                let state = Filter.setEndDate(filterState, d);
                d = dates.startDate ? dates.startDate.toISOString() : null;
                state = Filter.setStartDate(state, d);
                setFilterState(state);
              }}
              startDate={
                filterState.startDate && moment(filterState.startDate)
              }
            />
          </div>
          <div styleName="filter dates hideonemonthdatepicker">
            <label htmlFor="date-range-picker">Date range</label>
            <DateRangePicker
              numberOfMonths={2}
              endDate={filterState.endDate && moment(filterState.endDate)}
              id="date-range-picker"
              onDatesChange={(dates) => {
                let d = dates.endDate ? dates.endDate.toISOString() : null;
                let state = Filter.setEndDate(filterState, d);
                d = dates.startDate ? dates.startDate.toISOString() : null;
                state = Filter.setStartDate(state, d);
                setFilterState(state);
              }}
              startDate={
                filterState.startDate && moment(filterState.startDate)
              }
            />
          </div>
        </div>
      </div>
      <div styleName="buttons">
        <Button
          composeContextTheme={COMPOSE.SOFT}
          disabled={_.isEmpty(filterState)}
          onClick={() => {
            setFilterState({});
            setSearchText('');
          }}
          theme={{ button: style.button, disabled: style.buttonDisabled }}
          themePriority={PRIORITY.ADHOC_DEFAULT_CONTEXT}
        >Clear filters</Button>
        <PrimaryButton
          disabled={isSavingFilter || _.isEmpty(filterState)}
          onClick={onSaveFilter}
          theme={{ button: style.button, disabled: style.buttonDisabled }}
        >Save filter</PrimaryButton>
      </div>
    </div>
  );
}

FiltersPanel.defaultProps = {
  hidden: false,
  isSavingFilter: false,
  onSaveFilter: _.noop,
  onClose: _.noop,
};

FiltersPanel.propTypes = {
  communityFilters: PT.arrayOf(PT.shape({
    communityId: PT.string.isRequired,
    communityName: PT.string.isRequired,
  })).isRequired,
  filterState: PT.shape().isRequired,
  hidden: PT.bool,
  isSavingFilter: PT.bool,
  onSaveFilter: PT.func,
  selectCommunity: PT.func.isRequired,
  selectedCommunityId: PT.string.isRequired,
  setFilterState: PT.func.isRequired,
  setSearchText: PT.func.isRequired,
  validKeywords: PT.arrayOf(PT.string).isRequired,
  validSubtracks: PT.arrayOf(PT.shape()).isRequired,
  onClose: PT.func,
};
