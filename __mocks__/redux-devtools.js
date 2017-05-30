import _ from 'lodash';

export function createDevTools(obj) {
  const res = () => obj;
  res.instrument = _.noop;
  return res;
}

export default undefined;
