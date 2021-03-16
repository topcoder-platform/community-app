/**
 * A block that fetches and renders a few cards with active challenges.
 */

import actions from 'actions/contentful';
import ChallengesBlock from 'components/Contentful/ChallengesBlock';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

class ChallengesBlockContiner extends React.Component {
  componentDidMount() {
    const {
      getChallenges,
      id,
      preview,
      spaceName,
      environment,
    } = this.props;

    getChallenges({
      id,
      preview,
      spaceName,
      environment,
    });
  }

  render() {
    const {
      loading, challenges, baseUrl, fields,
    } = this.props;

    if (loading) {
      return <LoadingIndicator />;
    }

    return (
      <ChallengesBlock
        challenges={challenges}
        baseUrl={baseUrl}
        fields={fields}
      />
    );
  }
}

ChallengesBlockContiner.defaultProps = {
  id: null,
  preview: false,
  spaceName: null,
  environment: null,
};

ChallengesBlockContiner.propTypes = {
  fields: PT.shape().isRequired,
  baseUrl: PT.string.isRequired,
  challenges: PT.arrayOf(PT.object).isRequired,
  getChallenges: PT.func.isRequired,
  loading: PT.bool.isRequired,
  id: PT.string,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

function mapStateToProps(state, ownProps) {
  const data = state.challengesBlock[ownProps.id];
  return {
    fields: data ? data.fields : {},
    challenges: data ? data.challenges : [],
    loading: data ? data.loading : true,
  };
}

function mapDispatchToActions(dispatch) {
  const a = actions.contentful;
  return {
    getChallenges: (ownProps) => {
      dispatch(a.getChallengesBlockInit(ownProps));
      dispatch(a.getChallengesBlockDone(ownProps));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToActions,
)(ChallengesBlockContiner);
