import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import FiltersSwitch from 'components/challenge-listing/Filters/FiltersSwitch';

const onSwitch = jest.fn();

const mockDatas = [{
  active: false,
  filtersCount: 0,
  onSwitch,
  className: 'name',
}, {
  active: true,
  filtersCount: 5,
  onSwitch,
  className: 'name',
}];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <FiltersSwitch {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <FiltersSwitch {...this.props} />;
  }
}

test('handle events', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[1]} />));
  const matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('Switch') && item.className.match('tc-outline-btn'));
  expect(matches).toHaveLength(1);

  TU.Simulate.click(matches[0]);
  expect(onSwitch).toHaveBeenCalledTimes(1);
});

