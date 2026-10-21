import 'topcoder-react-utils/config/jest/setup';

/* global Event, jest */

import _ from 'lodash';
import { TextEncoder, TextDecoder } from 'util';

/* eslint-disable import/no-extraneous-dependencies */
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

// Jest's legacy jsdom realm omits these Node globals required by shared JWKS validation.
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
/* eslint-enable import/no-extraneous-dependencies */

Enzyme.configure({ adapter: new Adapter() });

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
