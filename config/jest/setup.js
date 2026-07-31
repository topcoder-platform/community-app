/* global Event, jest */

import _ from 'lodash';
import {
  clearImmediate as nodeClearImmediate,
  setImmediate as nodeSetImmediate,
} from 'timers';
import { TextDecoder, TextEncoder } from 'util';

/* eslint-disable import/no-extraneous-dependencies */
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
/* eslint-enable import/no-extraneous-dependencies */

Enzyme.configure({ adapter: new Adapter() });

global.TextDecoder = global.TextDecoder || TextDecoder;
global.TextEncoder = global.TextEncoder || TextEncoder;
global.clearImmediate = global.clearImmediate || nodeClearImmediate;
global.setImmediate = global.setImmediate || nodeSetImmediate;

global.window.matchMedia = global.window.matchMedia || function matchMedia() {
  return {
    matches: false,
    addListener() {},
    removeListener() {},
  };
};

global.window.requestAnimationFrame = _.noop;

global.window.resizeTo = (width, height) => {
  global.window.innerWidth = width || global.window.innerWidth;
  global.window.innerHeight = height || global.window.innerHeight;
  global.window.dispatchEvent(new Event('resize'));
};
/* eslint-disable lines-between-class-members */
/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
};

jest.mock('services/money');
