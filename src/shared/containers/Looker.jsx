/**
 * Connects the Redux store to the  Looker component.
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

import { actions } from 'topcoder-react-lib';
import Looker from 'components/Looker';

class LookerContainer extends React.Component {
  componentDidMount() {
    const {
      getLookerDone,
      lookerId,
      lookerInfo,
    } = this.props;
    if (!lookerInfo || lookerInfo.error) {
      getLookerDone(lookerId);
    }
  }

  render() {
    const {
      lookerInfo,
    } = this.props;

    if (!lookerInfo) {
      return 'loading...';
    } if (lookerInfo.error) {
      return lookerInfo.msg;
    }
    return (
      <Looker
        {...this.props}
      />
    );
  }
}

LookerContainer.propTypes = {
  lookerId: PT.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  const {
    looker: {
      dataSet,
    },
  } = state;
  const { lookerId } = ownProps;
  return {
    lookerInfo: dataSet[lookerId],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getLookerDone: (lookerId) => {
      dispatch(actions.looker.getLookerDone(lookerId));
    },
  };
}

LookerContainer.propTypes = {
  lookerInfo: PT.shape().isRequired,
  lookerId: PT.string.isRequired,
  getLookerDone: PT.func.isRequired,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LookerContainer);

export default Container;
