
import actions from 'actions/quality-assurance';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';


class TrackerListingContainer extends React.Component {
  componentDidMount() {
    console.log("----------------");
    console.log("repositories");
    console.log(this.props.repositories);
    console.log("loading");
    console.log(this.props.loading);
    console.log("----------------");
    //if (!this.props.repositories && !this.props.loading) {
      console.log("---------------- loadRepositories");
      this.props.loadRepositories();
      console.log("----------------");
    //};
  }

  render() {
    if (this.props.repositories) {
      return <div>Here :: {JSON.stringify(this.props.repositories, null, 2)}</div>;
    }
    if (this.props.loading) return <div>Loading...</div>;
    return <div>Initial State: no repositories, and not loading yet.</div>;
  }
}

export default connect(
  state => state.qualityAssurance,
  dispatch => ({
    loadRepositories: () => {
      dispatch(actions.qualityAssurance.getRepositoriesInit());
      dispatch(actions.qualityAssurance.getRepositoriesDone());
    },
  }),
)(TrackerListingContainer);

TrackerListingContainer.defaultProps = {
  repositories: null,
  //data: null,
  loading: false,
  loadRepositories: _.noop,
  //loadData: _.noop,
};

TrackerListingContainer.propTypes = {
  repositories: PT.object,
  //data: PT.arrayOf(PT.shape({})),
  loading: PT.bool,
  loadRepositories: PT.func,
  //loadData: PT.func,
};

/* 
import actions from 'actions/quality-assurance';
import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';

export class TrackerListingContainer extends React.Component {
  componentDidMount() {
    console.log("componentDidMount ------------------------------------");
    this.loadRepositories();
  }

  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate ------------------------------------");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount ------------------------------------");
  }

  loadRepositories() {
    console.log("loadRepositories ------------------------------------");
    console.log(this.props.repositories());
    console.log("----------------------------------------------");
  }

  render() {
    const {
      repositories
    } = this.props;

    console.log("render ----------------------------------------------");
    console.log(repositories);
    console.log("----------------------------------------------");

    

    return (
      <div>
        <div>Data here</div>
        <div>Dta - {JSON.stringify(this.props.repositories, null, 2)}</div>
      </div>
    );
  }
}

TrackerListingContainer.defaultProps = {
  bugId: ''
};

TrackerListingContainer.propTypes = {
  prizeMode: PT.string,
  repositories: PT.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  console.log("mapStateToProps ------------------------------------");
  //console.log(repositories);
  //console.log("------------------------------------");
  return {
    bugId: ownProps.bugId
  };
};

function mapDispatchToProps(dispatch) {
  const qaActions = actions.qualityAssurance;
  console.log("mapDispatchToProps ------------------------------------");
  return {
    repositories: () => {
      dispatch(qaActions.getRepositories());
    }
  };
}

const BugTrackerListingContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackerListingContainer);

export default BugTrackerListingContainer;
 */