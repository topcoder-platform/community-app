import React from 'react';
import { connect } from 'react-redux';
import { Link, config } from 'topcoder-react-utils';
import _ from 'lodash';
import PropTypes from 'prop-types';

import LoadingIndicator from 'components/LoadingIndicator';

import dashboardActions from '../../../actions/dashboard';

import styles from './styles.module.scss';

class Challenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listRef: React.createRef(),
      listHeight: null,
    };
    this.updateListHeight = this.updateListHeight.bind(this);
  }

  componentDidMount() {
    const { getChallenges } = this.props;
    getChallenges();
    window.addEventListener('resize', this.updateListHeight);
  }

  componentDidUpdate() {
    const { listHeight } = this.state;
    if (!listHeight) {
      this.updateListHeight();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateListHeight);
  }

  updateListHeight() {
    const visibleNo = config.DASHBOARD.VISIBLE_CHALLENGES || 5;
    const { listRef } = this.state;
    if (!listRef.current) return;
    const element = listRef.current;
    const height = Array.from(element.children)
      .splice(0, visibleNo)
      .map(e => e.offsetHeight)
      .reduce((a, b) => a + b, 0);
    this.setState({ listHeight: height });
  }

  render() {
    const { challenges, theme } = this.props;
    const { listRef, listHeight } = this.state;

    if (!challenges) {
      return <LoadingIndicator />;
    }

    return (
      <div
        className={`${styles.challenges}
        ${theme === 'dark' && styles.dark}`}
      >
        <div className={styles.header}>
          <h3>CHALLENGES</h3>
          <Link
            to={config.DASHBOARD.CHALLENGES_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View all challenges
          </Link>
        </div>
        <ul
          ref={listRef}
          className={styles.list}
          style={{
            height: `${listHeight || 0}px`,
          }}
        >
          {challenges && challenges.map(challenge => (
            <li key={challenge.id}>
              <div>
                <Link
                  to={`/challenges/${challenge.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {challenge.name}
                </Link>
              </div>
              <div>
                {`$${_.sum(challenge.prizeSets
                  .map(item => _.sum(
                    item.prizes.map(prize => prize.value),
                  )))}`}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Challenges.defaultProps = {
  theme: 'light',
  challenges: null,
};

Challenges.propTypes = {
  challenges: PropTypes.array,
  theme: PropTypes.string,
  getChallenges: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  challenges: state.dashboard.challenges,
});

const mapDispatchToProps = dispatch => ({
  getChallenges: (tokenV5) => {
    dispatch(dashboardActions.dashboard.fetchChallengesInit());
    dispatch(dashboardActions.dashboard.fetchChallengesDone(tokenV5));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Challenges);
