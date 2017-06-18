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
 * subtracks {Array} - Permits only the challenges belonging to at least one
 * of the competition subtracks presented as keys of this object.
 *
 * tags {Array} - Permits only the challenges that have at least one of the
 * tags within their platform and technology tags (keywords).
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
import moment from 'moment';
import { COMPETITION_TRACKS } from 'utils/tc';

/**
 * Returns true if the challenge matches the end date filter rule.
 * @param {Object} challenge
 * @param {Object} state
 * @return {Boolean}
 */
function filterByEndDate(challenge, state) {
  if (!state.endDate) return true;
  return moment(state.endDate).isAfter(challenge.createdAt);
}

/**
 * Returns true if the challenge matches the start date filter rule.
 * @param {Object} challenge
 * @param {Object} state
 * @return {Boolean}
 */
function filterByStartDate(challenge, state) {
  if (!state.startDate) return true;
  return moment(state.startDate).isBefore(challenge.submissionEndDate);
}

/**
 * Returns true if the challenge satisfies the subtracks filtering rule.
 * @param {Object} challenge
 * @param {Object} state
 * @return {Boolean}
 */
function filterBySubtracks(challenge, state) {
  if (!state.subtracks) return true;

  /* TODO: Although this is takend from the current code in prod,
   * it probably does not work in all cases. It should be double-checked,
   * why challenge subtracks in challenge objects are different from those
   * return from the API as the list of possible subtracks. */
  const filterSubtracks = state.subtracks.map(item =>
    item.toLowerCase().replace(/ /g, ''));
  const challengeSubtrack = challenge.subTrack.toLowerCase().replace(/_/g, '');
  return filterSubtracks.includes(challengeSubtrack);
}

/**
 * Returns true if the challenge satisfies the tags filtering rule.
 * @param {Object} challenge
 * @param {Object} state
 * @return {Boolean}
 */
function filterByTags(challenge, state) {
  if (!state.tags) return true;
  const str = `${challenge.name} ${challenge.platforms} ${
    challenge.technologies}`.toLowerCase();
  return state.tags.some(tag => str.includes(tag.toLowerCase()));
}

/**
 * Returns true if the challenge satisfies the free-text filtering condition set
 * in the provided filter state.
 * @param {Object} challenge
 * @param {Object} state
 * @return {Boolean}
 */
function filterByText(challenge, state) {
  if (!state.text) return true;
  const str =
    `${challenge.name} ${challenge.platforms} ${challenge.technologies}`
    .toLowerCase();
  return str.includes(state.text.toLowerCase());
}

/**
 * Returns true if the challenge satisfies the track filtering condition set in
 * the provided filter state.
 * @param {Object} challenge
 * @param {Object} state
 * @return {Boolean}
 */
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
  return challenge => filterByTrack(challenge, state)
  && filterByText(challenge, state)
  && filterByTags(challenge, state)
  && filterBySubtracks(challenge, state)
  && filterByEndDate(challenge, state)
  && filterByStartDate(challenge, state);
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

/**
 * Clone the state and sets the end date.
 * @param {Object} state
 * @param {String} date
 * @return {Object}
 */
export function setEndDate(state, date) {
  if (date) return { ...state, endDate: date };
  if (!state.endDate) return state;
  const res = _.clone(state);
  delete res.endDate;
  return res;
}

/**
 * Clones the state and sets the start date.
 * @param {Object} state
 * @param {String} date ISO date string.
 * @return {Object}
 */
export function setStartDate(state, date) {
  if (date) return { ...state, startDate: date };
  if (!state.startDate) return state;
  const res = _.clone(state);
  delete res.startDate;
  return res;
}

/**
 * Clones the state and sets the subtracks.
 * @param {Object} state
 * @param {Array} subtracks
 * @return {Object}
 */
export function setSubtracks(state, subtracks) {
  if (subtracks && subtracks.length) return { ...state, subtracks };
  if (!state.subtracks) return state;
  const res = _.clone(state);
  delete res.subtracks;
  return res;
}

/**
 * Clones the state and sets the tags.
 * @param {Object} state
 * @param {Array} tags String array.
 * @return {Object}
 */
export function setTags(state, tags) {
  if (tags && tags.length) return { ...state, tags };
  if (!state.tags) return state;
  const res = _.clone(state);
  delete res.tags;
  return res;
}

/**
 * Clones fitler state and sets the free-text string for the filtering by
 * challenge name and tags. To clear the string set it to anything evaluating
 * to falst (empty string, null, undefined).
 * @param {Object} state
 * @param {String} text
 * @return {Object} Resulting string.
 */
export function setText(state, text) {
  if (!text && !state.text) return state;
  const res = _.clone(state);
  if (text) res.text = text;
  else delete res.text;
  return res;
}

export default undefined;
