/* global
  atob, btoa
*/

/* eslint constructor-super: 0 */  // line 63 need that super in the catch block

/**
 * The SideBarFilter extends the ChallengeFilter from the ChallengeFilters
 * component. This way any ChallengeFilter can be easily added to the sidebar.
 * At the same time, it adds some functionality necessary for standard filters
 * in the sidebar.
 */

import _ from 'lodash';
import uuid from 'uuid/v4';
import moment from 'moment';
import ChallengeFilter from '../ChallengeFilters/ChallengeFilter';

export const MODE = {
  ALL_CHALLENGES: 'All Challenges',
  MY_CHALLENGES: 'My Challenges',
  OPEN_FOR_REGISTRATION: 'Open for registration',
  ONGOING_CHALLENGES: 'Ongoing challenges',
  PAST_CHALLENGES: 'Past challenges',
  OPEN_FOR_REVIEW: 'Open for review',
  UPCOMING_CHALLENGES: 'Upcoming challenges',
  CUSTOM: 'custom',
};

export const openForRegistrationFilter = (item) => {
  const registrationPhase = item.allPhases.filter(d => d.phaseType === 'Registration')[0];
  const registrationOpen = registrationPhase && registrationPhase.phaseStatus === 'Open';
  const reviewPhase = item.allPhases.filter(d => d.phaseType === 'Iterative Review');
  const isReviewClosed = !_.isEmpty(reviewPhase) && _.every(reviewPhase, phase => phase.phaseStatus === 'Closed');
  const checkPointPhase = item.allPhases.filter(d => d.phaseType === 'Checkpoint Submission')[0];
  const isCheckPointClosed = checkPointPhase && checkPointPhase.phaseStatus === 'Closed';
  const isFirst2Finish = item.subTrack === 'FIRST_2_FINISH';

  return (item.track === 'DEVELOP' && !isFirst2Finish && registrationOpen)
    // First 2 Finish challenges may be closed even if registration is open
    || (item.track === 'DEVELOP' && isFirst2Finish && registrationOpen && !isReviewClosed)
    || (item.track === 'DESIGN' && registrationOpen && !isCheckPointClosed)
    || (item.subTrack.startsWith('MARATHON') && !item.status.startsWith('COMPLETED'));
};

class SideBarFilter extends ChallengeFilter {

  // In addition to the standard arguments accepted by all parent filter classes,
  // argument of this class may also be one of the filter modes, defined above.
  constructor(arg) {
    if (!arg) {
      super();
      this.mode = MODE.ALL_CHALLENGES;
      this.name = MODE.ALL_CHALLENGES;
      this.uuid = MODE.ALL_CHALLENGES;
    } else if (arg.isSavedFilter) {
      super(arg);
      this.isCustomFilter = arg.isCustomFilter;
      const mode = arg.filter.split('&').filter(ele => ele.startsWith('mode='))[0];
      const name = arg.filter.split('&').filter(ele => ele.startsWith('name='))[0];
      const modes = Object.keys(MODE).map(key => MODE[key]);
      this.mode = mode ? modes[+mode.split('=')[1]] : MODE.CUSTOM;
      this.name = arg.name || (name ? decodeURIComponent(name.split('=')[1]) : name) || 'Custom';
      this.uuid = arg.id || uuid();
    } else if (_.isObject(arg)) {
      if (!arg.isSideBarFilter) throw new Error('Invalid argument!');
      super(arg);
      this.isCustomFilter = arg.isCustomFilter;
      this.mode = _.clone(arg.mode);
      this.name = _.clone(arg.name);
      this.uuid = _.clone(arg.uuid);
    } else if (_.isString(arg)) {
      try {
        const f = JSON.parse(atob(arg));
        super(f[0]);
        this.mode = f[1];
        this.name = f[2];
        this.uuid = f[3];
      } catch (e) {
        super();
        this.mode = arg;
        this.name = arg;
        this.uuid = arg === MODE.CUSTOM ? uuid() : this.mode;
      }
    } else throw new Error('Invalid argument!');
    this.isSideBarFilter = true;
  }

  count() {
    if (this.mode === MODE.CUSTOM) return super.count();
    return this.mode === MODE.ALL_CHALLENGES ? 0 : 1;
  }

  getFilterFunction() {
    switch (this.mode) {
      case MODE.ALL_CHALLENGES: return () => true;
      case MODE.MY_CHALLENGES: return item => item.myChallenge;
      case MODE.OPEN_FOR_REVIEW: return item => item.allPhases.filter(d => d.phaseType === 'Registration')[0].phaseStatus === 'REVIEW';
      // The API has some incosistencies in the challenge items
      // thus we have to check all fields that define a challenges as 'Open for registration'
      case MODE.OPEN_FOR_REGISTRATION:
        return openForRegistrationFilter;
      case MODE.ONGOING_CHALLENGES:
        return item => !openForRegistrationFilter(item) && item.status === 'ACTIVE';
      case MODE.PAST_CHALLENGES: return item => item.status === 'COMPLETED';
      case MODE.UPCOMING_CHALLENGES: return item => moment(item.registrationStartDate) > moment();
      default: return super.getFilterFunction();
    }
  }

  merge(filter) {
    super.merge(filter);
    if (!filter.isSideBarFilter) return this;
    this.mode = _.clone(filter.mode);
    this.name = _.clone(filter.name);
    this.uuid = _.clone(filter.uuid);
    return this;
  }

  copySidebarFilterProps(filter) {
    if (!filter.isSideBarFilter) return this;
    this.name = _.clone(filter.name);
    this.uuid = _.clone(filter.uuid);
    return this;
  }

  stringify() {
    return btoa(JSON.stringify([
      super.stringify(),
      this.mode,
      this.name,
      this.uuid,
    ]));
  }

 /**
 * Get an URL Encoded string representation of the filter.
 * Used for saving to the backend and displaying on the URL for deep linking.
 */
  getURLEncoded() {
    const modes = Object.keys(MODE).map(key => MODE[key]);
    const mode = `&mode=${modes.indexOf(this.mode)}`;
    const name = `&name=${this.name}`;
    return `${super.getURLEncoded()}${mode}${name}`;
  }
}

export default SideBarFilter;
