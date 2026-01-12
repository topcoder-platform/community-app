import React, { useEffect, useState } from 'react';
import PT from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import LoadingIndicator from 'components/LoadingIndicator';

import EngagementCard from './EngagementCard';

import './style.scss';

export default function EngagementListing({
  engagements,
  loading,
  loadMore,
  filter,
  setFilter,
  allEngagementsLoaded,
}) {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  const [search, setSearch] = useState(filter.search || '');
  const [location, setLocation] = useState(filter.location || '');
  const [status, setStatus] = useState(filter.status || 'open');
  const [skillsText, setSkillsText] = useState((filter.skills || []).join(', '));

  useEffect(() => {
    setSearch(filter.search || '');
    setLocation(filter.location || '');
    setStatus(filter.status || 'open');
    setSkillsText((filter.skills || []).join(', '));
  }, [filter]);

  const applyFilters = () => {
    const nextSkills = skillsText
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    setFilter({
      ...filter,
      search: search.trim(),
      location: location.trim(),
      status,
      skills: nextSkills,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setStatus('open');
    setSkillsText('');

    setFilter({
      ...filter,
      search: '',
      location: '',
      status: 'open',
      skills: [],
    });
  };

  const hasEngagements = engagements && engagements.length > 0;

  return (
    <div styleName="engagementListing">
      <form
        styleName={`filters ${isDesktop ? 'filters-desktop' : 'filters-mobile'}`}
        onSubmit={(event) => {
          event.preventDefault();
          applyFilters();
        }}
      >
        <div styleName="filter-group">
          <label htmlFor="engagement-search">
            <span styleName="filter-label">Search</span>
            <input
              id="engagement-search"
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Role, client, or keyword"
            />
          </label>
        </div>
        <div styleName="filter-group">
          <label htmlFor="engagement-status">
            <span styleName="filter-label">Status</span>
            <select
              id="engagement-status"
              value={status}
              onChange={event => setStatus(event.target.value)}
            >
              <option value="open">Open</option>
              <option value="pending_assignment">Pending Assignment</option>
              <option value="closed">Closed</option>
            </select>
          </label>
        </div>
        <div styleName="filter-group">
          <label htmlFor="engagement-skills">
            <span styleName="filter-label">Skills</span>
            <input
              id="engagement-skills"
              type="text"
              value={skillsText}
              onChange={event => setSkillsText(event.target.value)}
              placeholder="React, Python, Figma"
            />
          </label>
        </div>
        <div styleName="filter-group">
          <label htmlFor="engagement-location">
            <span styleName="filter-label">Location</span>
            <input
              id="engagement-location"
              type="text"
              value={location}
              onChange={event => setLocation(event.target.value)}
              placeholder="Remote, EST, London"
            />
          </label>
        </div>
        <div styleName="filter-actions">
          <button type="submit" styleName="apply-button">Apply</button>
          <button type="button" styleName="clear-button" onClick={clearFilters}>Clear</button>
        </div>
      </form>

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
          {engagements.map((engagement, index) => (
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
  }).isRequired,
  setFilter: PT.func.isRequired,
  allEngagementsLoaded: PT.bool,
};
