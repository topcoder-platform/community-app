/* global
  fetch, window
*/

/* eslint jsx-a11y/no-static-element-interactions:0 */

/**
 * Sidebar Filters Component (for an additional filtering of the challenge listing).
 *
 * It renders a list of filters separated in a few sections. Each filter shows
 * the number of challenges matching it, and, when clicked, it is highlighted
 * and triggers the onFilter() callback to order the parent container to filter
 * the challenge listing.
 *
 * This componet has My Filters section, where the filters can be added by
 * the parent component, using the addFilter() method. That section has a button,
 * which switches the sidebar into My Filters Edit mode, where the names of
 * My Filters, and their ordering can be changed. Also the filters can be removed
 * in that mode.
 */

import _ from 'lodash';
import uuid from 'uuid/v4';
import React from 'react';
import PT from 'prop-types';
import EditMyFilters, { SAVE_FILTERS_API } from './EditMyFilters';
import SideBarFilter, { MODE } from './SideBarFilter';
import { FilterItem } from './FilterItems';
import './SideBarFilters.scss';

/*
 * Default set of filters displayed in the component.
 * Note that groupping of these into difference sections is defined in the jsx
 * layout markup. The js logic behind this does not care about that groupping.
 */
const DEFAULT_FILTERS = [
  new SideBarFilter(MODE.ALL_CHALLENGES),
  new SideBarFilter(MODE.MY_CHALLENGES),
  new SideBarFilter(MODE.OPEN_FOR_REGISTRATION),
  new SideBarFilter(MODE.ONGOING_CHALLENGES),
  new SideBarFilter(MODE.PAST_CHALLENGES),
  new SideBarFilter(MODE.OPEN_FOR_REVIEW),
  new SideBarFilter(MODE.UPCOMING_CHALLENGES),
];

/*
 * This auxiliary object holds the indices of standard filters in the filters array.
 */
const FILTER_ID = {
  ALL_CHALLENGES: 0,
  MY_CHALLENGES: 1,
  OPEN_FOR_REGISTRATION: 2,
  ONGOING_CHALLENGES: 3,
  PAST_CHALLENGES: 4,
  OPEN_FOR_REVIEW: 5,
  UPCOMING_CHALLENGES: 6,
  FIRST_USER_DEFINED: 7,
};

/*
 * Component modes.
 */
const MODES = {
  EDIT_MY_FILTERS: 0,
  SELECT_FILTER: 1,
};

/*
 * When a new filter is added via the addFilter() method, its name is set equal
 * to `${MY_FILTER_BASE_NAME} N` where N is least integers, which is still larger
 * that all other such indices in the similar filter names.
 */
const MY_FILTER_BASE_NAME = 'My Filter';

const RSS_LINK = 'http://feeds.topcoder.com/challenges/feed?list=active&contestType=all';

class SideBarFilters extends React.Component {

  static domainFromUrl(url) {
    // if MAIN_URL is not defined or null return default domain (production)
    if (url == null) {
      return 'topcoder.com';
    }
    const firstSlashIndex = url.indexOf('/');
    const secondSlashIndex = url.indexOf('/', firstSlashIndex + 1);
    const fullDomainName = url.slice(secondSlashIndex + 1);
    const lastDotIndex = fullDomainName.lastIndexOf('.');
    const secondLastDotIndex = fullDomainName.lastIndexOf('.', lastDotIndex - 1);
    if (secondLastDotIndex === -1) {
      return fullDomainName;
    }

    return fullDomainName.slice(secondLastDotIndex + 1, fullDomainName.length);
  }

  constructor(props) {
    super(props);

    const authToken = (props.auth && props.auth.tokenV2) || null;

    this.state = {
      authToken,
      currentFilter: DEFAULT_FILTERS[3],
      filters: _.clone(DEFAULT_FILTERS),
      mode: MODES.SELECT_FILTER,
    };

    for (let i = 0; i < this.state.filters.length; i += 1) {
      const item = this.state.filters[i];
      item.count = props.challenges.filter(item.getFilterFunction()).length;
    }
    for (let i = 0; i !== this.state.filters.length; i += 1) {
      const f = this.state.filters[i];
      // Match of UUID means that one of the filters we have already matches
      // the one passed from the parent component, so we have just select it,
      // and we can exit the constructor right after.
      if (f.uuid === props.filter.uuid) {
        this.state.currentFilter = f;
        return;
      }
    }
    // A fancy staff: if the parent has passed a filter, which does not exists
    // (it is taken from a deep link), we add it to the list of filters and
    // also select it.
    // if the filter is one of the default filters then
    // select it by default. We check on name and assume that
    // a custom filter will never be named the same as a default filter.
    if (_.values(MODE).includes(props.filter.name)) {
      this.state.currentFilter = DEFAULT_FILTERS[_.values(MODE).indexOf(props.filter.name)];
    } else {
      const f = new SideBarFilter(props.filter);
      f.count = props.challenges.filter(f.getFilterFunction()).length;
      this.state.currentFilter = f;
      this.state.filters.push(f);
    }
  }

  /**
   * Retrieve the saved filters for a logged in user.
   */
  componentDidMount() {
    if (this.state.authToken) {
      fetch(SAVE_FILTERS_API, {
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then((data) => {
          const myFilters = data.map((item) => {
            const filter = item;
            filter.isSavedFilter = true;
            filter.isCustomFilter = true;
            return new SideBarFilter(filter);
          });
          this.setState({
            filters: this.state.filters.concat(myFilters),
          });
        });
    }
  }
  /**
   * When a new array of challenges is passed from the parent component via props,
   * this method updates counters of challenges matching each of the filters in
   * this sidebar.
   */
  componentWillReceiveProps(nextProps) {
    let currentFilter;
    const filters = [];
    this.state.filters.forEach((filter) => {
      const filterClone = new SideBarFilter(filter);
      if (this.state.currentFilter === filter) currentFilter = filterClone;
      filterClone.count = nextProps.challenges.filter(filter.getFilterFunction()).length;
      filters.push(filterClone);
    });
    for (let i = 0; i < filters.length; i += 1) {
      if (filters[i].mode === 'All Challenges') {
        filters[i].count = 0;
        for (let j = 0; j < filters.length; j += 1) {
          if (filters[j].mode === 'Open for registration' || filters[j].mode === 'Ongoing challenges') {
            filters[i].count += filters[j].count;
          }
        }
      }
    }
    this.setState({
      currentFilter,
      filters,
    });
  }

  /**
   * When sidebar updates, this method checks that some of the fitlers is highlighted,
   * if not, it resets the current filter to the All Challenges.
   * This allows to handle properly the following situation:
   *  - The user selects a custom filter from My Filters;
   *  - Then it clicks Edit My Filters and remove that filter;
   *  - Then he clicks Done and returns to the standard component mode.
   * Without this method, he will still see the set of challenges filtered by
   * the already removed filter, and no indication in the sidebar, by what filtered
   * they are filtered.
   */
  componentDidUpdate() {
    if (this.state.filters.indexOf(this.state.currentFilter) < 0) {
      this.selectFilter(FILTER_ID.ALL_CHALLENGES);
    }
  }

  /**
   * Generates the default name for a new filter.
   * It will be `${MY_FILTER_BASE_NAME} N`, where N is an integer, which makes
   * this filter name unique among other filters in the sidebar.
   */
  getAvailableFilterName() {
    let maxId = 0;
    for (let i = FILTER_ID.FIRST_USER_DEFINED; i < this.state.filters.length; i += 1) {
      const name = this.state.filters[i].name;
      if (name.startsWith(MY_FILTER_BASE_NAME)) {
        const id = Number(name.slice(1 + MY_FILTER_BASE_NAME.length));
        if (!isNaN(id) && (maxId < id)) maxId = id;
      }
    }
    return `${MY_FILTER_BASE_NAME} ${1 + maxId}`;
  }

  /**
   * Adds new custom filter to the sidebar.
   * @param {String} filter.name Name of the filter to show in the sidebar.
   * @param {Func} filter.filter Filter function, which should be serializable
   *  via toString() and deserializable via eval() (i.e. it should not depend on
   *  variables/functions in its outer scope).
   */
  addFilter(filter) {
    const f = (new SideBarFilter(MODE.CUSTOM)).merge(filter);
    f.uuid = uuid();
    const filters = _.clone(this.state.filters);
    f.count = this.props.challenges.filter(f.getFilterFunction()).length;
    filters.push(f);
    this.setState({ filters });
    this.saveFilters(filters.slice(FILTER_ID.FIRST_USER_DEFINED));
  }

  /**
   * Renders the component in the Edit My Filters mode.
   */
  editMyFiltersMode() {
    const domain = SideBarFilters.domainFromUrl(this.props.config.MAIN_URL);
    return (
      <div styleName="SideBarFilters">
        <div styleName="FilterBox">
          <EditMyFilters
            token={this.state.authToken}
            filters={this.state.filters.slice(FILTER_ID.FIRST_USER_DEFINED)}
            onDone={(myFilters) => {
              const filters = _.clone(this.state.filters).slice(0, FILTER_ID.FIRST_USER_DEFINED);
              this.setState({
                filters: filters.concat(myFilters),
                mode: MODES.SELECT_FILTER,
              });
              this.updateFilters(myFilters);
            }}
          />
        </div>
        <div styleName="sidebar-footer">
          <ul>
            <li><a href={`https://www.${domain}/about`}>About</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://help.${domain}/hc/en-us/articles/219069687-Contact-Support`}>Contact</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://help.${domain}`}>Help</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://www.${domain}/community/how-it-works/privacy-policy/`}>Privacy</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://www.${domain}/community/how-it-works/terms/`}>Terms</a></li>
          </ul>
          <p styleName="copyright">Topcoder © 2017.</p>
        </div>
      </div>
    );
  }

/**
 * Updates already saved filters on the backend.
 * Used to update name of the filter but can be used to update
 * other properties if needed.
 */
  updateFilters(filters) {
    // For each filter in filters, serialize it and then
    // make a fetch PUT request
    // there is no need to do anything with the response
    filters.forEach((filter) => {
      fetch(`${SAVE_FILTERS_API}/${filter.uuid}`, {
        headers: {
          Authorization: `Bearer ${this.state.authToken}`,
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({
          name: filter.name,
          filter: filter.getURLEncoded(),
          // TODO: The saved-search API requires type to be one of develop, design,
          // or data. As this is not consistent with the frontend functionality, the API
          // needs to be updated in future, till then we use hardcoded 'develop'.
          type: 'develop',
        }),
      });
    });
  }
  /**
   * Saves My Filters to the backend
   */
  saveFilters(filters) {
    // This code saves the stringified representation of
    // the filters to the remote server.
    const [filter] = _.takeRight(filters);

    fetch(SAVE_FILTERS_API, {
      headers: {
        Authorization: `Bearer ${this.state.authToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        name: this.getAvailableFilterName(),
        filter: filter.getURLEncoded(),
        // The saved-search API requires type to be one of develop, design,
        // or data. We are using the filter property to store tracks info and passing
        // in type as develop just to keep the backend happy.
        type: 'develop',
      }),
    })
    .then(res => res.json())
    .then((res) => {
      // Replace the SideBarFilter object created at the client side with a new
      // SideBarFilter object which has correct id from the server response.
      const updatedFilters = this.state.filters.filter(e => e.uuid !== filter.uuid);
      const savedFilter = res;
      savedFilter.isSavedFilter = true;
      savedFilter.isCustomFilter = true;
      updatedFilters.push(new SideBarFilter(savedFilter));
      this.setState({ filters: updatedFilters });
    });
  }

  /**
   * Renders the component in the regular mode.
   */
  selectFilterMode() {
    if (this.state.filters[FILTER_ID.ALL_CHALLENGES].count === 0) return null;

    const filters = this.state.filters.map((filter, index) => (
      <FilterItem
        count={filter.count}
        highlighted={filter === this.state.currentFilter}
        myFilter={index >= FILTER_ID.FIRST_USER_DEFINED}
        key={`${filter.name}-filter`}
        name={filter.name}
        onClick={() => this.selectFilter(index)}
      />
    ));
    const myFilters = filters.slice(FILTER_ID.FIRST_USER_DEFINED);
    const domain = SideBarFilters.domainFromUrl(this.props.config.MAIN_URL);
    return (
      <div styleName="SideBarFilters">
        <div styleName="FilterBox">
          {filters[FILTER_ID.ALL_CHALLENGES]}

          {this.props.isAuth ? <span> {filters[FILTER_ID.MY_CHALLENGES]}</span> : ''}
          {filters[FILTER_ID.OPEN_FOR_REGISTRATION]}
          {filters[FILTER_ID.ONGOING_CHALLENGES]}
          {filters[FILTER_ID.OPEN_FOR_REVIEW]}
          {filters[FILTER_ID.UPCOMING_CHALLENGES]}
          <hr />
          {filters[FILTER_ID.PAST_CHALLENGES]}
          {
            myFilters.length ?
              <div>
                <div styleName="my-filters">
                  <h1>My filters</h1>
                  <a
                    styleName="edit-link"
                    onClick={() => {
                      this.setState({ mode: MODES.EDIT_MY_FILTERS });
                      return false;
                    }}
                  >
                    edit
                  </a>
                </div>
                {myFilters}
              </div> : ''
          }
          <hr />
          <div styleName="get-rss">
            <a href={RSS_LINK}>Get the RSS feed</a>
          </div>
        </div>
        <div styleName="sidebar-footer">
          <ul>
            <li><a href={`https://www.${domain}/about`}>About</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://help.${domain}/hc/en-us/articles/219069687-Contact-Support`}>Contact</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://help.${domain}`}>Help</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://www.${domain}/community/how-it-works/privacy-policy/`}>Privacy</a>&nbsp;•&nbsp;</li>
            <li><a href={`https://www.${domain}/community/how-it-works/terms/`}>Terms</a></li>
          </ul>
          <p styleName="copyright">Topcoder © 2017</p>
        </div>
      </div>
    );
  }

  /**
   * Selects the filter with the specified index.
   */
  selectFilter(index) {
    if (this.state.filters[index].mode === 'Open for review') {
      // Jump to Development Review Opportunities page
      window.location.href = `${this.props.config.MAIN_URL}/review/development-review-opportunities/`;
    } else {
      const currentFilter = this.state.filters[index];
      this.setState({ currentFilter }, () => this.props.onFilter(currentFilter));
    }
  }

  /**
   * Selects the filter with the specified name.
   */
  selectFilterWithName(filterName) {
    // find a filter with matching name
    const currentFilter = _.find(this.state.filters, filter => filter.name === filterName);
    if (currentFilter.mode === 'Open for review') {
      // Jump to Development Review Opportunities page
      window.location.href = `${this.props.config.MAIN_URL}/review/development-review-opportunities/`;
      return;
    }
    this.setState({ currentFilter }, () => this.props.onFilter(currentFilter));
  }

  /**
   * Renders the component.
   */
  render() {
    switch (this.state.mode) {
      case MODES.SELECT_FILTER: return this.selectFilterMode();
      case MODES.EDIT_MY_FILTERS: return this.editMyFiltersMode();
      default: return <div styleName="SideBarFilters" />;
    }
  }
}

SideBarFilters.defaultProps = {
  filter: new SideBarFilter(MODE.ALL_CHALLENGES),
  isAuth: false,
  onFilter: _.noop,
  config: {
    MAIN_URL: '',
  },
  auth: null,
};

SideBarFilters.propTypes = {
  challenges: PT.arrayOf(PT.shape({
    registrationOpen: PT.string.isRequired,
  })).isRequired,
  filter: PT.instanceOf(SideBarFilter),
  onFilter: PT.func,
  isAuth: PT.bool,
  config: PT.shape({
    MAIN_URL: PT.string,
  }),
  auth: PT.shape({
    tokenV2: PT.string,
  }),
};

export default SideBarFilters;
