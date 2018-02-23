/**
 * Container for HallOfFamePage Component.
 * Connects redux state for TCO Hall of Fame.
 */
// import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

// import actions from 'actions/page/tco-hall-of-fame';

import HallOfFamePage from 'components/tco/HallOfFamePage';

class HallOfFameContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: props.eventIdParam.slice(-2),
    };
  }

  render() {
    return (
      <HallOfFamePage
        eventId={this.state.eventId}
      />
    );
  }
}

HallOfFameContainer.defaultProps = {
  eventIdParam: '17',
};

HallOfFameContainer.propTypes = {
  eventIdParam: PT.string,
};

const mapStateToProps = (state, ownProps) => ({
  eventIdParam: ownProps.match.params.eventId,
});

function mapDispatchToProps() {
  // const a = termsActions.terms;
  return {
    // selectEvent: (eventId) => {
    //   dispatch(a.selectEvent(eventId));
    // },
  };
}

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HallOfFameContainer);

export default Container;
