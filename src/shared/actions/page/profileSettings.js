/**
 * Actions for settings page UI.
 */
import _ from 'lodash';
import { createActions } from 'redux-actions';

export const PROFILETABS = {
  BASICINFO: 'basicinfo',
  LANGUAGE: 'language',
  EDUCATION: 'education',
  WORK: 'work',
  ORGANIZATION: 'organization',
  SKILL: 'skill',
  HOBBY: 'hobby',
  COMMUNITY: 'community',
};

export default createActions({
  PAGE: {
    SETTINGS: {
      SUB_TAB: _.identity,
      CLEAR_INCORRECT_PASSWORD: _.identity,
    },
  },
});
