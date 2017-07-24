import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import Dropdown from 'components/tc-communities/Dropdown';

const rnd = new Rnd();

const dropdownOptions = [
  {
    label: 'iOS Community',
    value: '1',
  }, {
    label: 'Predix Topcoder',
    value: '2',
  }, {
    label: 'Cognitive Topcoder',
    value: '3',
    redirect: 'other location',
  }, {
    label: 'Android Community',
    value: '4',
  },
];

test('Snapshot match', () => {
  rnd.render((
    <Dropdown
      options={dropdownOptions}
      value={dropdownOptions[0]}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return <Dropdown {...this.props} />;
  }
}

test('onChange', () => {
  const instance = TU.renderIntoDocument((
    <Wrapper options={dropdownOptions} value={dropdownOptions[0]} />));
  const matches = TU.findAllInRenderedTree(instance, item =>
    item && item.props && item.props.onChange);
  expect(matches).toHaveLength(1);
  matches[0].props.onChange(dropdownOptions[1]);
  matches[0].props.onChange(dropdownOptions[2]);
  matches[0].props.onChange({});
});
