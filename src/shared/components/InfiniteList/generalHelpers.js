/* global
  Promise, clearTimeout
*/

import _ from 'lodash';

const fetchPromise = Promise.resolve();
const loadBatchSize = 1;
let lastItemReturnTimeout;

// fetch items and then return them in batches
export function fetchAdditionalItems({
  currentItems,
  itemUniqueIdentifier,
  fetchItems,
  successCallback,
  finishCallback,
}) {
  fetchPromise.then(
    fetchItems().then((receivedItems) => {
      let newItems = _.concat([], currentItems, receivedItems);
      if (itemUniqueIdentifier) newItems = _.uniqBy(newItems, itemUniqueIdentifier);
      const uniqueReceivedItems = _.slice(newItems, currentItems.length);
      const receivedItemsInChunks = _.chunk(uniqueReceivedItems, loadBatchSize);
      const chunkNumber = receivedItems.length;

      function returnReceivedItems(currentChunkIndex = 0) {
        if (currentChunkIndex === chunkNumber) {
          setTimeout(() => finishCallback(receivedItems));
          return;
        }

        lastItemReturnTimeout = setTimeout(() => {
          successCallback(receivedItemsInChunks[currentChunkIndex]);

          returnReceivedItems(currentChunkIndex + 1);
        });
      }

      returnReceivedItems();
    }),
  );
}

// clear item batch return timeout and stop the chain
export function stopNewItemReturnChain() {
  clearTimeout(lastItemReturnTimeout);
}

export function generateIds(numberToAdd, prefix, currentIndex) {
  return _.times(numberToAdd, num => `${prefix}-${currentIndex + num}`);
}

export function organizeItems(items, filter, sort) {
  return _.sortBy(_.filter(items, filter), sort);
}
