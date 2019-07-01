/**
 * This container component load data into its state, and pass them to children via props.
 * Its should have in its state, and properly manage the showDetails set
 * (thus allowing to show/hide detail panels for different submissions),
 * and it should define all necessary handlers to pass to the children.
 */

import _ from 'lodash';
import LoadingPagePlaceholder from 'components/LoadingPagePlaceholder';
import ScoreboardChallengeHeader from 'components/tco/scoreboard/Header';
import ScoreboardTable from 'components/tco/scoreboard/ScoreboardTable';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import actions from 'actions/tco/scoreboard';


import './styles.scss';

// The container component
class ScoreboardPageContainer extends React.Component {
  componentDidMount() {
    const { challengeId, loadScoreboard } = this.props;
    loadScoreboard(challengeId);
  }

  render() {
    const {
      scoreboard,
      loading,
    } = this.props;

    const isEmpty = _.isEmpty(scoreboard && scoreboard.details);

    if (loading) {
      return <LoadingPagePlaceholder />;
    }

    return (
      <div styleName="outer-container">
        <div styleName="challenge-detail-container">
          {
            !isEmpty
            && (
            <ScoreboardChallengeHeader
              challenge={scoreboard.details}
            />
            )
          }
          {
            !isEmpty && scoreboard.details.submissions
            && <ScoreboardTable challenge={scoreboard.details} />
          }
        </div>
      </div>
    );
  }
}

ScoreboardPageContainer.defaultProps = {
  challengeId: 0,
  scoreboard: null,
  loading: false,
  loadScoreboard: _.noop,
};

ScoreboardPageContainer.propTypes = {
  challengeId: PT.number,
  scoreboard: PT.shape({
    details: PT.shape({
      submissions: PT.array,
    }),
  }),
  loading: PT.bool,
  loadScoreboard: PT.func,
};

function mapStateToProps(state, props) {
  return {
    scoreboard: state.scoreboard,
    challengeId: Number(props.match.params.challengeId),
  };
}

const mapDispatchToProps = (dispatch) => {
  const a = actions.scoreboard;
  return {
    loadScoreboard: (challengeId) => {
      dispatch(a.fetchScoreboardInit());
      dispatch(a.fetchScoreboardDone(challengeId));
    },
  };
};

const ScoreboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScoreboardPageContainer);

export default ScoreboardContainer;
