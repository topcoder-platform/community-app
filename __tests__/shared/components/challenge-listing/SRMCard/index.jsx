import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import SRMCard from 'components/challenge-listing/SRMCard';

const mockDatas = [
  {
    category: 'now',
    srmChallenge: {},
  }, {
    category: 'upcoming',
    srmChallenge: {},
  }, {
    category: 'past',
    srmChallenge: {},
  },
];

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <SRMCard {...this.props} />;
  }
}

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <SRMCard {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    TU.renderIntoDocument((<Wrapper {...data} />));
  });
});

