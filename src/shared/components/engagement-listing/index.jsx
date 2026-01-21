import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PT from 'prop-types';
import LoadingIndicator from 'components/LoadingIndicator';
import SearchCombo from 'components/GUIKit/SearchCombo';
import Dropdown from 'components/GUIKit/Dropdown';

import EngagementCard from './EngagementCard';

import './style.scss';

const SORT_OPTIONS = [
  { label: 'Latest Added Descending', value: 'createdAt' },
  { label: 'Latest Updated Descending', value: 'updatedAt' },
];

const CREATED_DATE_FIELDS = ['createdAt', 'created_at', 'createdOn', 'created'];
const UPDATED_DATE_FIELDS = ['updatedAt', 'updated_at', 'updatedOn', 'updated'];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function getTimestamp(engagement, fields) {
  if (!engagement) return 0;
  for (let i = 0; i < fields.length; i += 1) {
    const value = engagement[fields[i]];
    if (value) {
      const timestamp = Date.parse(value);
      if (!Number.isNaN(timestamp)) return timestamp;
    }
  }
  return 0;
}

export default function EngagementListing({
  engagements,
  loading,
  loadMore,
  filter,
  setFilter,
  allEngagementsLoaded,
  auth,
}) {
  const [search, setSearch] = useState(filter.search || '');
  const [sortBy, setSortBy] = useState(filter.sortBy || 'createdAt');
  const hasEngagements = engagements && engagements.length > 0;
  const [filtersReady, setFiltersReady] = useState(
    hasEngagements || allEngagementsLoaded,
  );
  const hasStartedLoadingRef = useRef(false);

  useEffect(() => {
    setSearch(filter.search || '');
    setSortBy(filter.sortBy || 'createdAt');
  }, [filter]);

  useEffect(() => {
    if (loading) {
      hasStartedLoadingRef.current = true;
      return;
    }

    if (
      !filtersReady
      && (hasEngagements || allEngagementsLoaded || hasStartedLoadingRef.current)
    ) {
      setFiltersReady(true);
    }
  }, [allEngagementsLoaded, filtersReady, hasEngagements, loading]);

  const handleSearch = (nextSearch) => {
    const nextOption = nextSearch && typeof nextSearch === 'object'
      ? nextSearch
      : { label: nextSearch, value: nextSearch };
    const label = nextOption
      ? String(nextOption.label || nextOption.value || '').trim()
      : '';
    const value = nextOption && nextOption.value
      ? String(nextOption.value).trim()
      : '';
    const hasSkillId = Boolean(value) && UUID_PATTERN.test(value);
    const normalizedSearch = label;

    setSearch(normalizedSearch);
    setFilter({
      ...filter,
      search: normalizedSearch,
      skills: hasSkillId ? [value] : [],
    });
  };

  const handleSortChange = (nextOptions) => {
    const selected = (nextOptions || []).find(option => option.selected);
    const nextSortBy = selected && selected.label === SORT_OPTIONS[1].label
      ? SORT_OPTIONS[1].value
      : SORT_OPTIONS[0].value;

    setSortBy(nextSortBy);
    setFilter({
      ...filter,
      sortBy: nextSortBy,
    });
  };

  const sortOptions = SORT_OPTIONS.map(option => ({
    label: option.label,
    selected: option.value === sortBy,
  }));

  const sortedEngagements = useMemo(() => {
    if (!Array.isArray(engagements) || engagements.length <= 1) return engagements || [];

    const primaryFields = sortBy === 'updatedAt' ? UPDATED_DATE_FIELDS : CREATED_DATE_FIELDS;
    const fallbackFields = sortBy === 'updatedAt' ? CREATED_DATE_FIELDS : [];

    return engagements
      .map((engagement, index) => {
        const primaryTimestamp = getTimestamp(engagement, primaryFields);
        const fallbackTimestamp = primaryTimestamp ? 0 : getTimestamp(engagement, fallbackFields);
        return {
          engagement,
          index,
          timestamp: primaryTimestamp || fallbackTimestamp,
        };
      })
      .sort((a, b) => {
        if (a.timestamp === b.timestamp) return a.index - b.index;
        return b.timestamp - a.timestamp;
      })
      .map(item => item.engagement);
  }, [engagements, sortBy]);

  return (
    <div styleName="engagementListing">
      <div styleName={loading ? 'filters loading' : 'filters'}>
        {filtersReady ? (
          <React.Fragment>
            <SearchCombo
              placeholder="Search Engagements by Name or Skills"
              onSearch={handleSearch}
              term={search}
              auth={auth}
            />
            <Dropdown
              label="Sort by"
              onChange={handleSortChange}
              options={sortOptions}
              size="xs"
            />
          </React.Fragment>
        ) : null}
      </div>

      {loading && !hasEngagements ? (
        <div styleName="loading-state">
          <LoadingIndicator />
        </div>
      ) : null}

      {!loading && !hasEngagements ? (
        <div styleName="empty-state">
          No engagements match your filters yet.
        </div>
      ) : null}

      {hasEngagements ? (
        <div styleName="cards">
          {sortedEngagements.map((engagement, index) => (
            <EngagementCard
              key={engagement.nanoId || engagement.id || engagement.engagementId || index}
              engagement={engagement}
            />
          ))}
        </div>
      ) : null}

      {hasEngagements && !allEngagementsLoaded ? (
        <div styleName="load-more">
          <button
            type="button"
            styleName="load-more-button"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      ) : null}
    </div>
  );
}

EngagementListing.defaultProps = {
  engagements: [],
  loading: false,
  loadMore: () => {},
  allEngagementsLoaded: false,
  auth: {},
};

EngagementListing.propTypes = {
  engagements: PT.arrayOf(PT.shape()),
  loading: PT.bool,
  loadMore: PT.func,
  filter: PT.shape({
    status: PT.string,
    skills: PT.arrayOf(PT.string),
    location: PT.string,
    search: PT.string,
    sortBy: PT.string,
  }).isRequired,
  setFilter: PT.func.isRequired,
  allEngagementsLoaded: PT.bool,
  auth: PT.shape({
    tokenV3: PT.string,
  }),
};
