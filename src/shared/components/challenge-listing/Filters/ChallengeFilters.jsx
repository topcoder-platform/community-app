/**
 * Challenge search & filters panel.
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import SwitchWithLabel from 'components/SwitchWithLabel';
import * as Filter from 'utils/challenge-listing/filter';
import { COMPETITION_TRACKS as TRACKS } from 'utils/tc';

import ChallengeFilter from './ChallengeFilter';
import ChallengeSearchBar from './ChallengeSearchBar';
import EditTrackPanel from './EditTrackPanel';
import FiltersIcon from './FiltersSwitch/FiltersIcon';
import FiltersPanel from './FiltersPanel';
import FiltersSwitch from './FiltersSwitch';
import FiltersCardsType from './FiltersCardsType';

import './ChallengeFilters.scss';

class ChallengeFilters extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filter: props.filter,
      filtersCount: props.filter.count(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.setState({
        filter: nextProps.filter,
        filtersCount: nextProps.filter.count(),
      });
    }
  }

  /**
   * Clears the filters.
   */
  onClearFilters() {
    const filter = new ChallengeFilter();
    this.setState({ filter, filtersCount: 0 });
    this.props.onFilter(filter);
  }

  /**
   * Updates the count of active filters (displayed in the filter panel switch),
   * caches the set of active filters for subsequent searches, and triggers the
   * 'onFilter' callback provided by the parent component, if any.
   *
   * When the parent 'onFilter' callback is triggered, an auxiliary filter function
   * is passed in as the first argument. That filter function should be passed into
   * the .filter() method of the challenge objects array to perform the filtering.
   *
   * @param {Object} filters Filters object, received from the FiltersPanel component.
   */
  onFilter(filter) {
    const f = (new ChallengeFilter(this.state.filter)).merge(filter);
    this.setState({
      filter: f,
      filtersCount: f.count(),
    });
    this.props.onFilter(f);
  }

  /**
   * Sets the keywords filter in the FilterPanel to the specified value.
   * @param {String} keywords A comma-separated list of the keywords.
   */
  setKeywords(keywords) {
    if (this.filtersPanel) this.filtersPanel.onKeywordsChanged([keywords]);
  }

  render() {
    const {
      expanded,
      filterState,
      setExpanded,
      setFilterState,
      showTrackModal,
      trackModalShown,
    } = this.props;

    const isTrackOn = track =>
      !filterState.tracks || Boolean(filterState.tracks[track]);

    const switchTrack = (track, on) => {
      const act = on ? Filter.addTrack : Filter.removeTrack;
      setFilterState(act(filterState, track));
    };

    return (
      <div styleName="challenge-filters">
        <div styleName="filter-header">
          <FiltersCardsType
            isCardTypeSet={this.props.isCardTypeSet}
            setCardType={this.props.setCardType}
          />
          <ChallengeSearchBar
            onSearch={text => setFilterState(Filter.setText(filterState, text))}
            placeholder="Search Challenges"
            query={this.props.searchText}
            setQuery={this.props.setSearchText}
          />
          {
            this.props.isCardTypeSet === 'Challenges' ?
            (
              <span>
                <span styleName="filter-switch-with-label">
                  <SwitchWithLabel
                    enabled={isTrackOn(TRACKS.DESIGN)}
                    labelBefore="Design"
                    onSwitch={on => switchTrack(TRACKS.DESIGN, on)}
                  />
                </span>
                <span styleName="filter-switch-with-label">
                  <SwitchWithLabel
                    enabled={isTrackOn(TRACKS.DEVELOP)}
                    labelBefore="Development"
                    onSwitch={on => switchTrack(TRACKS.DEVELOP, on)}
                  />
                </span>
                <span styleName="filter-switch-with-label">
                  <SwitchWithLabel
                    enabled={isTrackOn(TRACKS.DATA_SCIENCE)}
                    labelBefore="Data Science"
                    onSwitch={on => switchTrack(TRACKS.DATA_SCIENCE, on)}
                  />
                </span>
              </span>
            ) : ''
          }
          <span styleName="pulled-right">
            {
              this.props.isCardTypeSet === 'Challenges' ?
              (
                <span
                  onClick={() => showTrackModal(true)}
                  role="button"
                  styleName="track-btn"
                  tabIndex={0}
                >
                  Tracks
                  <span styleName="down-arrow" />
                </span>
              ) : ''
            }
            {/* TODO: Two components below are filter switch buttons for
              * mobile and desktop views. Should be refactored to use the
              * same component, which automatically changes its style depending
              * on the viewport size. */}
            <span
              onClick={() => setExpanded(!expanded)}
              role="button"
              styleName="filter-btn"
              tabIndex={0}
            >
              <FiltersIcon color="#737380" styleName="FiltersIcon" />
              Filter
            </span>
            <FiltersSwitch
              active={expanded}
              filtersCount={this.state.filtersCount}
              onSwitch={setExpanded}
              styleName="FiltersSwitch"
            />
          </span>
        </div>

        <FiltersPanel
          challengeGroupId={this.props.challengeGroupId}
          communityName={this.props.communityName}
          hidden={!expanded}
          filter={this.state.filter}
          onClose={() => setExpanded(false)}
          onClearFilters={() => this.onClearFilters()}
          onFilter={filter => this.onFilter(filter)}
          onSaveFilter={() => this.props.onSaveFilter(this.state.filter)}
          ref={(node) => { this.filtersPanel = node; }}
          validKeywords={this.props.validKeywords}
          validSubtracks={this.props.validSubtracks}
        />

        <EditTrackPanel
          opened={trackModalShown}
          onClose={() => showTrackModal(false)}
          designEnabled={isTrackOn(TRACKS.DESIGN)}
          switchDesign={on => switchTrack(TRACKS.DESIGN, on)}
          devEnabled={isTrackOn(TRACKS.DEVELOP)}
          switchDev={on => switchTrack(TRACKS.DEVELOP, on)}
          dataScienceEnabled={isTrackOn(TRACKS.DATA_SCIENCE)}
          switchDataScience={on => switchTrack(TRACKS.DATA_SCIENCE, on)}
        />
      </div>
    );
  }
}

ChallengeFilters.defaultProps = {
  communityName: null,
  filter: new ChallengeFilter(),
  isCardTypeSet: '',
  onFilter: _.noop,
  onSaveFilter: _.noop,
  setCardType: _.noop,
};

ChallengeFilters.propTypes = {
  challengeGroupId: PT.string.isRequired,
  communityName: PT.string,
  expanded: PT.bool.isRequired,
  filter: PT.instanceOf(ChallengeFilter),
  filterState: PT.shape().isRequired,
  isCardTypeSet: PT.string,
  onFilter: PT.func,
  onSaveFilter: PT.func,
  setCardType: PT.func,
  setExpanded: PT.func.isRequired,
  setFilterState: PT.func.isRequired,
  searchText: PT.string.isRequired,
  setSearchText: PT.func.isRequired,
  showTrackModal: PT.func.isRequired,
  trackModalShown: PT.bool.isRequired,
  validKeywords: PT.arrayOf(PT.string).isRequired,
  validSubtracks: PT.arrayOf(PT.string).isRequired,
};

export default ChallengeFilters;
