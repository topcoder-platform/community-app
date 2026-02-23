import React from 'react';
// import ReactDOM from 'react-dom';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
// import TU from 'react-dom/test-utils';
import Bucket from 'components/challenge-listing/Listing/Bucket';
import ChallengeCard from 'components/challenge-listing/ChallengeCard';
import reduxStoreFactory from 'redux-mock-store';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
// import { Tag } from 'topcoder-react-ui-kit';

const store = reduxStoreFactory()();

const expand = jest.fn();
const loadMore = jest.fn();
const setFilterState = jest.fn();
const setSort = jest.fn();
const setSearchText = jest.fn();

const challengeTypes = [
  {
    name: 'Challenge',
    abbreviation: 'CH',
  }, {
    name: 'First2Finish',
    abbreviation: 'F2F',
  }, {
    name: 'Task',
    abbreviation: 'TSK',
  }, {
    name: 'Marathon Match',
    abbreviation: 'MM',
  },
];

const mockDatas = [{
  bucket: 'all',
  expanded: true,
  expand,
  challenges: [
    {
      id: '1',
      status: 'b',
      prizes: [1200, 600],
      totalPrize: 1800,
      users: {},
      type: 'Challenge',
      tags: [],
    },
    {
      id: '2',
      status: 'a',
      technologies: ['a', 'b', 'c'],
      tags: ['a', 'b', 'c'],
      allPhases: [{
        phaseType: 'Registration',
        phaseStatus: 'Open',
      }],
      currentPhases: ['Registration'],
      track: 'Development',
      type: 'Challenge',
      events: [{ eventName: 'Submit' }],
      prizes: [1200, 600],
      totalPrize: 1800,
      users: {},
    }],
  challengeTypes,
  loading: false,
  loadMore,
  setFilterState,
  setSort,
  sort: '',
}];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <Provider store={store}>
        <StaticRouter context={{}}>
          <Bucket {...data} />
        </StaticRouter>
      </Provider>
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

function countElementsByType(element, type) {
  if (!React.isValidElement(element)) {
    return 0;
  }

  let count = element.type === type ? 1 : 0;
  React.Children.forEach(element.props.children, (child) => {
    count += countElementsByType(child, type);
  });

  return count;
}

test('Shows assigned task when memberId and userId are matching strings', () => {
  const renderer = new Renderer();
  renderer.render((
    <Bucket
      activeBucket="openForRegistration"
      auth={{ user: { roles: [] } }}
      bucket="openForRegistration"
      challenges={[
        {
          id: 'task-1',
          name: 'Assigned task',
          status: 'ACTIVE',
          type: { name: 'Task' },
          tags: [],
          prizes: [],
          task: {
            isTask: true,
            isAssigned: true,
            memberId: 'c0ffee-123',
          },
        },
      ]}
      challengeTypes={challengeTypes}
      challengesUrl="/challenges"
      expand={_.noop}
      expanded
      expandTag={_.noop}
      expandedTags={[]}
      expanding={false}
      filterState={{}}
      isLoggedIn
      needLoad={false}
      prizeMode="money-usd"
      selectChallengeDetailsTab={_.noop}
      setFilterState={setFilterState}
      setSearchText={setSearchText}
      setSort={setSort}
      sort=""
      userId="c0ffee-123"
    />
  ));

  expect(countElementsByType(renderer.getRenderOutput(), ChallengeCard)).toBe(1);
});

test('Hides assigned task when memberId and userId do not match', () => {
  const renderer = new Renderer();
  renderer.render((
    <Bucket
      activeBucket="openForRegistration"
      auth={{ user: { roles: [] } }}
      bucket="openForRegistration"
      challenges={[
        {
          id: 'task-2',
          name: 'Assigned task',
          status: 'ACTIVE',
          type: { name: 'Task' },
          tags: [],
          prizes: [],
          task: {
            isTask: true,
            isAssigned: true,
            memberId: 'owner-user',
          },
        },
      ]}
      challengeTypes={challengeTypes}
      challengesUrl="/challenges"
      expand={_.noop}
      expanded
      expandTag={_.noop}
      expandedTags={[]}
      expanding={false}
      filterState={{}}
      isLoggedIn
      needLoad={false}
      prizeMode="money-usd"
      selectChallengeDetailsTab={_.noop}
      setFilterState={setFilterState}
      setSearchText={setSearchText}
      setSort={setSort}
      sort=""
      userId="different-user"
    />
  ));

  expect(countElementsByType(renderer.getRenderOutput(), ChallengeCard)).toBe(0);
});

// class Wrapper extends React.Component {
//   componentDidMount() {}

//   render() {
//     return (
//       <Provider store={store}>
//         <StaticRouter context={{}}>
//           <Bucket {...this.props} />
//         </StaticRouter>
//       </Provider>
//     );
//   }
// }

// const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[0]} />));

// test('setFilterState', () => {
//   const matches = TU.scryRenderedComponentsWithType(instance, Tag);
//   expect(matches).toHaveLength(3);
// TU.Simulate.click(ReactDOM.findDOMNode(matches[0]));
// expect(setFilterState).toHaveBeenCalledTimes(1);
// TU.Simulate.click(ReactDOM.findDOMNode(matches[1]));
// expect(setFilterState).toHaveBeenCalledTimes(2);
// TU.Simulate.click(ReactDOM.findDOMNode(matches[2]));
// expect(setFilterState).toHaveBeenCalledTimes(3);
// });
