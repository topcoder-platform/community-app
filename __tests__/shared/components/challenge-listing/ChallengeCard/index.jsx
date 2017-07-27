import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import ChallengeCard from 'components/challenge-listing/ChallengeCard';
import MockDate from 'mockdate';

beforeAll(() => {
  MockDate.set(1500350400000);
});
afterAll(() => {
  MockDate.reset();
});

const mockData1 = {
  challenge: {
    technologies: 'Data Science',
    allPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Open',
    }],
    currentPhases: ['Registration'],
    track: 'DEVELOP',
    subTrack: 'CODE',
    events: [{ eventName: 'Submit' }],
    status: 'ACTIVE',
  },
};

const mockData2 = {
  challenge: {
    technologies: 'Go',
    allPhases: [{
      phaseType: 'Submit',
      phaseStatus: 'Open',
    }],
    currentPhases: ['Registration'],
    track: 'DATA_SCIENCE',
    subTrack: 'CODE',
    id: '1',
    totalPrize: 1000,
  },
};

const mockData3 = {
  challenge: {
    technologies: '',
    allPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Closed',
    }],
    currentPhases: ['Registration'],
    track: 'DATA_SCIENCE',
    subTrack: 'CODE',
    id: 'long id',
    totalPrize: 1000,
  },
};

const mockData4 = {
  challenge: {
    technologies: 'more, technology, to, show',
    allPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Closed',
    }],
    currentPhases: ['Registration'],
    track: 'DATA_SCIENCE',
    subTrack: 'CODE',
    id: 'long id',
    totalPrize: 1000,
  },
};

const mockData5 = {
  challenge: {
    technologies: '+tag, more, technology, to, show',
    allPhases: [{
      phaseType: 'Registration',
      phaseStatus: 'Closed',
    }],
    currentPhases: ['Registration'],
    track: 'DATA_SCIENCE',
    subTrack: 'CODE',
    id: 'long id',
    totalPrize: 1000,
  },
};

describe('Matches shallow shapshot', () => {
  test('shapshot 1', () => {
    const renderer = new Renderer();

    renderer.render((
      <ChallengeCard {...mockData1} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('shapshot 2', () => {
    const renderer = new Renderer();

    renderer.render((
      <ChallengeCard {...mockData2} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  test('shapshot 3', () => {
    const renderer = new Renderer();

    renderer.render((
      <ChallengeCard {...mockData3} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <ChallengeCard {...this.props} />;
  }
}

describe('render properly', () => {
  let instance = TU.renderIntoDocument((<Wrapper {...mockData1} />));

  test('another render', () => {
    instance = TU.renderIntoDocument((<Wrapper {...mockData3} />));
  });

  test('click', () => {
    instance = TU.renderIntoDocument((<Wrapper {...mockData4} />));
    const tags = TU.findAllInRenderedTree(instance, item =>
      item && item.className && item.className.match('technology'));
    expect(tags).toHaveLength(4);
    TU.Simulate.click(tags[0]);
  });

  test('click + tag', () => {
    instance = TU.renderIntoDocument((<Wrapper {...mockData5} />));
    const tags = TU.findAllInRenderedTree(instance, item =>
      item && item.className && item.className.match('technology'));
    TU.Simulate.click(tags[0]);
  });
});
