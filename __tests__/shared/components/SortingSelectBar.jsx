import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import SortingSelectBar from 'components/SortingSelectBar';

const mockData = {
  title: 'title',
  options: [
    {
      label: 'label',
      value: 'value',
    },
  ],
};

const mockData2 = {
  title: 'title',
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <SortingSelectBar {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();

  renderer.render((
    <SortingSelectBar {...mockData2} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <SortingSelectBar {...this.props} />;
  }
}

const instance = TU.renderIntoDocument((<Wrapper {...mockData} />));

test('Render properly', () => {
  const dropdown = TU.findAllInRenderedTree(instance, item => item && item.className && item.className.match('Dropdown-control'));
  TU.Simulate.touchEnd(dropdown[0]);
  const options = TU.findAllInRenderedTree(instance, item => item && item.className && item.className.match('Dropdown-option'));
  expect(options).toHaveLength(1);
  TU.Simulate.click(options[0]);
});
