/**
 * An abstract filter object.
 * It is the base class for hierarchy of filter objects implemented in various
 * components inside the challenge listing page. It describes their common
 * interface, thus making it easier to combine and handle them together.
 */

import _ from 'lodash';

class BaseFilter {

  /**
   * Creates a new filter object.
   * @param {Object|String|undefined} arg
   * 1) When argument is an object, we assume it is a filter of a compatible
   *    type, and we create the new filter as a copy of the given one.
   * 2) When param is a string, we assume it is a string obtained from a previous
   *    call to stringify() method of a filter of the same type, and we create
   *    the filter encoded in that string.
   * 3) When no argument is passed, we create a dummy filter, which accept any
   *    object passed in.
   * Default implementation in this base class does nothing in any of these cases.
   */
  constructor(arg) {
    _.noop(arg);
  }

  /**
   * Returns the count of active primitive filters. Just for visualization
   * purposes.
   * @return The count.
   */
  count() {
    _.noop(this);
    return 0;
  }

  /**
   * Returns a filter function, which can be passed to an array's fitler()
   * method to filter it with this filter. This is more efficient, than providing
   * a filter() method, which applies current filter to an array passed in as
   * the argument.
   * @return (Function(Object)) Filter function.
   */
  getFilterFunction() {
    _.noop(this);
    return () => true;
  }

  merge() {
    _.noop(this);
    return this;
  }

  /**
   * Serialises the filter into a string.
   * @return {String} String representation of the filter.
   */
  stringify() {
    _.noop(this);
    return '';
  }
}

export default BaseFilter;
