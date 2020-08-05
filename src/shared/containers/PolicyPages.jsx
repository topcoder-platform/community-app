/**
 * Connects the Redux store to the PolicyPages component.
 */
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import actions from 'actions/contentful';
import PolicyPages from 'components/PolicyPages';
import LoadingIndicator from 'components/LoadingIndicator';
import Header from 'containers/TopcoderHeader';
import Footer from 'components/TopcoderFooter';

const HEADE_MENU = [
  {
    id: 'business',
    title: 'BUSINESS',
    href: 'https://www.topcoder.com',
  },
  {
    id: 'community-123',
    title: 'COMMUNITY',
    href: '/community/learn',
  },
];

class PolicyPagesContainer extends React.Component {
  componentDidMount() {
    const { loadingPolicyPages, policyData, getPolicyPages } = this.props;
    if (!loadingPolicyPages && !policyData) {
      getPolicyPages();
    }
  }

  render() {
    const {
      loadingPolicyPages, policyData,
    } = this.props;
    if (loadingPolicyPages || !policyData) return <LoadingIndicator />;
    if (_.isEmpty(policyData)) {
      return (
        <h1 style={{ 'text-align': 'center' }}>Please, publish Policy Pages in Contentful space to see this page.</h1>
      );
    }
    return (
      <div>
        <Header headerMenu={HEADE_MENU} />
        <PolicyPages {...this.props} />
        <Footer />
      </div>
    );
  }
}

PolicyPagesContainer.defaultProps = {
  loadingPolicyPages: false,
  policyData: null,
};

PolicyPagesContainer.propTypes = {
  loadingPolicyPages: PT.bool,
  match: PT.shape().isRequired,
  policyData: PT.shape(),
  getPolicyPages: PT.func.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    p: ownProps.p,
    policyData: state.policyPages.policyData,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPolicyPages: () => {
      dispatch(actions.contentful.getPolicyPagesInit());
      dispatch(actions.contentful.getPolicyPagesDone());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PolicyPagesContainer);
