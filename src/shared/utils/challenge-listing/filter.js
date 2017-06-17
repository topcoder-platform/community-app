/**
 * Universal challenge filter. Must be used in all places where we need filter
 * or fetch challenges. This way we keep all related logic in the same place,
 * which simplifies maintenance and modifications of the code.
 *
 * The state of challenge filter is a plain JS object, containing only plain
 * data fields. It allows to avoid any problems with its storage inside Redux
 * store; with its serialization into / deserialization from a string. Each
 * field of the state describes a single rule for filtering the challenges.
 * The filter allows only those challenges that match all defined rules.
 * Undefined, null fields are ignored.
 *
 * The following fields are supported:
 *
 * endDate {Number|String} - Permits only those challenges with submission
 * deadline before this date.
 *
 * groupIds {Object} - Permits only the challenges belonging to at least one
 * of the groups which IDs are presented as keys in this object.
 *
 * registrationEnd {Number|String} - Permits only the challenges with
 * registration deadline before this date.
 *
 * startDate {Number|String} - Permits only those challenges started after this
 * date.
 *
 * status {Object} - Permits only the challenges with status matching one of
 * the keys of this object.
 *
 * subtracks {Object} - Permits only the challenges belonging to at least one
 * of the competition subtracks presented as keys of this object.
 *
 * text {String} - Free-text string which will be matched against challenge
 * name, its platform and technology tags. If not found anywhere, the challenge
 * is filtered out. Case-insensitive.
 *
 * tracks {Object} - Permits only the challenges belonging to at least one of
 * the competition tracks presented as keys of this object.
 *
 * userIds {Object} - Permits only the challenges where the specified users are
 * participating.
 */

import _ from 'lodash';
import { COMPETITION_TRACKS } from 'utils/tc';

function filterByTrack(challenge, state) {
  if (!state.tracks) return true;
  return _.keys(state.tracks).some(track => challenge.communities.has(track));
}

/**
 * Returns clone of the state with the specified competition track added.
 * @param {Object} state
 * @param {String} track
 * @return {Object} Resulting state.
 */
export function addTrack(state, track) {
  /* When state has no tracks field all tracks are allowed, thus no need to
   * touch the object. */
  if (!state.tracks) return state;

  const res = _.clone(state);
  res.tracks = _.clone(res.tracks);
  res.tracks[track] = true;

  /* Selecting all tracks is the same as having no tracks field. To keep the
   * state more simple at any time, we remove tracks field in such case. */
  if (!_.values(COMPETITION_TRACKS).some(item => !res.tracks[item])) {
    delete res.tracks;
  }

  return res;
}

/**
 * Generates filter function for the state.
 * @param {Object} state
 * @return {Function}
 */
export function getFilterFunction(state) {
  return item => filterByTrack(item, state);
}

/**
 * Returns clone of the state with the specified competition track removed.
 * @param {Object} state
 * @param {String} track
 * @return {Object} Resulting state.
 */
export function removeTrack(state, track) {
  const res = _.clone(state);
  if (res.tracks) res.tracks = _.clone(res.tracks);
  else {
    res.tracks = {};
    _.forIn(COMPETITION_TRACKS, (item) => {
      res.tracks[item] = true;
    });
  }
  delete res.tracks[track];
  return res;
}

export default undefined;
