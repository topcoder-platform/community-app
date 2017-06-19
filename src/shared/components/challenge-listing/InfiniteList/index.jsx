/* global
  Math, Promise
*/

/* eslint react/no-unused-prop-types: 0 */  // this rule not working properly here

/**
 *  This component handles the display of an infinite list of items as well as
 *  their sorting, filtering and any further loading.
 *
 *  It takes an initial list of items and once the user scrolls to the bottom of
 *  the list. The component adds a batch of new item ids, loads a batch of templates
 *  with those ids, fetch more items and then load these items into the DOM in
 *  smaller batches to replace the templates with the ids.
 *
 *  The above-mentioned behaviour will continue until the number of the cached
 *  items is equal to or more than the total item count passed in as props
 *  to the component. The total item count should be the total amount of items
 *  available for retrieval from the database.
 */

import _ from 'lodash';
import React, { Component } from 'react';
import PT from 'prop-types';
// import Waypoint from 'react-waypoint';
import moment from 'moment';

import {
  fetchAdditionalItems,
  generateIds,
  stopNewItemReturnChain,
  organizeItems,
} from './generalHelpers';

const assignedIdKey = 'assignedId';
// const loadpointBottomOffset = -150;
const initialPageIndex = -1;

class InfiniteList extends Component {

  componentWillMount() {
    this.initializeProperties(this.props, true);
  }

  // from the new props determine what have changed and blow away cache
  // and reload items based on new props
  componentWillReceiveProps(nextProps) {
    const { filter: oldFilter, sort: oldSort, uniqueIdentifier } = this.props;
    const { itemCountTotal, filter, sort } = nextProps;
    const [newlyOrganizedItems, oldOrganizedItems] = [
      [filter, sort], [oldFilter, oldSort],
    ].map(organizers => organizeItems(this.state.items, organizers[0], organizers[1]));
    const [newItemOrderRepresentation, oldItemOrderRepresentation] = [
      newlyOrganizedItems, oldOrganizedItems,
    ].map(items => _.map(items, uniqueIdentifier).join(''));

    if (itemCountTotal !== this.props.itemCountTotal) {
      stopNewItemReturnChain();
      this.initializeProperties(nextProps);
      this.setLoadingStatus(false);
    } else if (newItemOrderRepresentation !== oldItemOrderRepresentation) {
      this.reCacheItemElements(
        _.uniqBy(newlyOrganizedItems, uniqueIdentifier),
        nextProps.renderItem,
      );
    }
  }

  componentWillUnmount() {
    stopNewItemReturnChain();
  }

  onScrollToLoadPoint() {
    if (this.state.newItemsCount === 0
        || this.state.loading
        || this.state.items.length >= this.props.itemCountTotal) { return; }

    this.addBatchIds();

    const { uniqueIdentifier } = this.props;
    this.setLoadingStatus(true);

    fetchAdditionalItems({
      itemUniqueIdentifier: uniqueIdentifier,
      currentItems: this.state.items,
      fetchItems: () => this.fetchNewItems(),
      finishCallback: (newItems) => {
        this.state.newItemsCount = newItems.length ? newItems.length : 0;
        this.currentPageIndex += 1;
        this.setLoadingStatus(false);
      },
      successCallback: newItems => this.addNewItems(newItems),
    });
  }

  setLoadingStatus(status) {
    if (this.state.loading !== status) this.setState({ loading: status });
  }

  addNewItems(newItems, nextProps = null) {
    if (!newItems) return;

    const { items: existingItems, cachedItemElements } = this.state;
    const { renderItem, sort, filter } = nextProps || this.props;
    const { ids, idPrefix } = this;
    const { length: existingItemCount } = existingItems;

    const stampedNewItems = newItems.map((item, index) => {
      const idIndex = existingItemCount + index;

      return _.set(item, assignedIdKey, ids[idIndex] || `${idPrefix}-${idIndex}`);
    });

    const newElements = organizeItems(stampedNewItems, filter, sort)
      .map(item => renderItem(item[assignedIdKey], item));

    this.setState({
      items: existingItems.concat(stampedNewItems),
      cachedItemElements: cachedItemElements.concat(newElements),
    });
  }

  reCacheItemElements(organizedItems, renderItem) {
    this.setState({
      cachedItemElements: organizedItems.map(item => renderItem(item[assignedIdKey], item)),
    });
  }

  // initialize properties/state of the component
  // load an initial number of items and then cache the rest from
  // the passed-in items
  initializeProperties(props, isMounting = false) {
    const { items, batchNumber, sort } = props;
    const sortedItems = organizeItems(items, () => true, sort);
    const initialLoadNumber = batchNumber + (items.length % batchNumber);

    this.currentPageIndex = initialPageIndex;

    this.setState({ items: [], cachedItemElements: [] }, () => {
      this.ids = [];
      this.addBatchIds(initialLoadNumber);
      this.addNewItems(sortedItems.slice(0, initialLoadNumber), props, isMounting);
      this.cachedPassedInItems = sortedItems.slice(initialLoadNumber);
    });
  }

  addBatchIds(numberToAdd) {
    const { batchNumber } = this.props;
    const { ids = [], idPrefix } = this;

    this.idPrefix = idPrefix || Math.random().toString(36).substring(7);
    this.ids = ids.concat(generateIds(numberToAdd || batchNumber, this.idPrefix, ids.length));
  }

  // fetch new items either from cache or API endpoint
  fetchNewItems() {
    const { fetchItems, batchNumber, tempDataFilter } = this.props;
    const { cachedPassedInItems } = this;

    if (cachedPassedInItems.length === 0) {
      // conditions need to be removed once v3 api endpoint is created for
      // Open for registration and ongoing challenges filters
      if (tempDataFilter === 'Open for registration') {
        return fetchItems(this.currentPageIndex + 1).then(data => data.filter((item) => {
          const allphases = item.allPhases.filter(phase => phase.phaseType === 'Registration' && phase.phaseStatus === 'Open');
          return moment(item.registrationEndDate) > moment() && allphases && allphases.length > 0;
        }));
      } else if (tempDataFilter === 'Ongoing challenges') {
        return fetchItems(this.currentPageIndex + 1).then(data => data.filter((item) => {
          const allphases = item.allPhases.filter(phase => phase.phaseType === 'Registration' && phase.phaseStatus === 'Closed');
          return moment(item.registrationEndDate) < moment() && allphases && allphases.length > 0;
        }));
      }
      return fetchItems(this.currentPageIndex + 1);
    }
    this.cachedPassedInItems = cachedPassedInItems.slice(batchNumber);
    return Promise.resolve(cachedPassedInItems.slice(0, batchNumber));
  }

  render() {
    const { cachedItemElements, items: { length: loadedCount } } = this.state;
    const { ids } = this;
    const { renderItemTemplate, batchNumber } = this.props;
    let templates;

    if (this.state.loading) {
      templates = _.slice(ids, loadedCount, loadedCount + batchNumber)
        .map(id => renderItemTemplate(id));
    } else {
      templates = [];
    }

    return (
      <div>
        {cachedItemElements}
        {templates}
        {/*
        <Waypoint
          onEnter={() => this.onScrollToLoadPoint()}
          scrollableAncestor={window}
          bottomOffset={loadpointBottomOffset}
          key={Math.random()}
        />
        */
        }
      </div>
    );
  }
}

InfiniteList.defaultProps = {
  itemCountTotal: 0,
  batchNumber: 50,
  fetchMoreItems: _.noop,
  renderItemTemplate: _.noop,
  filter: () => true,
  sort: () => true,
  fetchItems: null,
  uniqueIdentifier: false,
  renderItem: _.noop,
  tempDataFilter: null,
};

// tempDataFilter prop is added for temporary use. Need to be removed once V3 api
// end points are created
InfiniteList.propTypes = {
  itemCountTotal: PT.number,
  batchNumber: PT.number,
  fetchItems: PT.func,
  renderItemTemplate: PT.func,
  filter: PT.func,
  sort: PT.func,
  uniqueIdentifier: PT.oneOfType([PT.string, PT.bool]),
  renderItem: PT.func,
  tempDataFilter: PT.string,
};

export default InfiniteList;
