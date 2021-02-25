/**
 * Google sheets container to load data from sheets
 * and render it as table
 */
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import actions from 'actions/gSheet';
import LoadingIndicator from 'components/LoadingIndicator';
import GSheet from 'components/GSheet';

class GSeetContainer extends React.Component {
  componentDidMount() {
    const {
      id, index, sheet, getGSheet,
    } = this.props;
    if (isEmpty(sheet)) {
      getGSheet(id, index);
    }
  }

  render() {
    const { sheet, config } = this.props;
    return isEmpty(sheet) ? <LoadingIndicator /> : <GSheet sheet={sheet} config={config} />;
  }
}

GSeetContainer.defaultProps = {
  index: 0,
  config: {},
  sheet: null,
};

GSeetContainer.propTypes = {
  id: PT.string.isRequired,
  index: PT.number,
  sheet: PT.shape(),
  getGSheet: PT.func.isRequired,
  config: PT.shape(),
};

function mapStateToProps(state, props) {
  const { id, index } = props;
  return {
    id: props.id,
    sheet: state.gSheet ? state.gSheet[`${id}-${index === undefined ? 0 : index}`] : {},
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.gsheets;
  return {
    getGSheet: (id, index) => {
      dispatch(a.getGsheetInit(id, index));
      dispatch(a.getGsheetDone(id, index));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GSeetContainer);
