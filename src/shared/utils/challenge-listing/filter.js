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
 * registrationOpen {Boolean} - Permits only the challenges with open or closed
 * registration.
 *
 * startDate {Number|String} - Permits only those challenges started after this
 * date.
 *
 * status {Array} - Permits only the challenges with status matching one of
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
 * upcoming {Boolean} - Permits only upcoming challenges.
 *
 * users {Array} - Permits only the challenges where the specified (by handles)
 * users are participating.
 */

import _ from 'lodash';
import moment from 'moment';
import { COMPETITION_TRACKS } from 'utils/tc';

/**
 * Here are many similiar filerBy..(challenge, state) functions. Each of them
 * checks whether the given challenge fulfills the corresponding filtering rule
 * from the filter state object, and returns true or false depending on it.
 */

function filterByEndDate(challenge, state) {
  if (!state.endDate) return true;
  return moment(state.endDate).isAfter(challenge.createdAt);
}

function filterByRegistrationOpen(challenge, state) {
  if (_.isUndefined(state.registrationOpen)) return true;
  const isRegOpen = () => {
    if (challenge.subTrack === 'MARATHON_MATCH') {
      return challenge.status !== 'PAST';
    }
    const registrationPhase = challenge.allPhases.find(item =>
      item.phaseType === 'Registration');
    if (!registrationPhase || registrationPhase.phaseStatus !== 'Open') {
      return false;
    }
    if (challenge.track === 'DESIGN') {
      const checkpointPhase = challenge.allPhases.find(item =>
        item.phaseType === 'Checkpoint Submission');
      return !checkpointPhase || checkpointPhase.phaseStatus !== 'Closed';
    }
    return true;
  };
  return isRegOpen() === state.registrationOpen;
}

function filterByStartDate(challenge, state) {
  if (!state.startDate) return true;
  return moment(state.startDate).isBefore(challenge.submissionEndDate);
}

function filterByStatus(challenge, state) {
  if (!state.status) return true;
  return state.status.includes(challenge.status);
}

function filterBySubtracks(challenge, state) {
  if (!state.subtracks) return true;

  /* TODO: Although this is taken from the current code in prod,
   * it probably does not work in all cases. It should be double-checked,
   * why challenge subtracks in challenge objects are different from those
   * return from the API as the list of possible subtracks. */
  const filterSubtracks = state.subtracks.map(item =>
    item.toLowerCase().replace(/ /g, ''));
  const challengeSubtrack = challenge.subTrack.toLowerCase().replace(/_/g, '');
  return filterSubtracks.includes(challengeSubtrack);
}

function filterByTags(challenge, state) {
  if (!state.tags) return true;
  const str = `${challenge.name} ${challenge.platforms} ${
    challenge.technologies}`.toLowerCase();
  return state.tags.some(tag => str.includes(tag.toLowerCase()));
}

function filterByText(challenge, state) {
  if (!state.text) return true;
  const str =
    `${challenge.name} ${challenge.platforms} ${challenge.technologies}`
    .toLowerCase();
  return str.includes(state.text.toLowerCase());
}

function filterByTrack(challenge, state) {
  if (!state.tracks) return true;
  return _.keys(state.tracks).some(track => challenge.communities.has(track));
}

function filterByUpcoming(challenge, state) {
  if (_.isUndefined(state.upcoming)) return true;
  return moment().isBefore(challenge.registrationStartDate);
}

function filterByUsers(challenge, state) {
  if (!state.users) return true;
  return state.users.find(user => challenge.users[user]);
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
  return challenge => filterByStatus(challenge, state)
  && filterByTrack(challenge, state)
  && filterByUpcoming(challenge, state)
  && filterByText(challenge, state)
  && filterByTags(challenge, state)
  && filterBySubtracks(challenge, state)
  && filterByUsers(challenge, state)
  && filterByEndDate(challenge, state)
  && filterByStartDate(challenge, state)
  && filterByRegistrationOpen(challenge, state);
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
