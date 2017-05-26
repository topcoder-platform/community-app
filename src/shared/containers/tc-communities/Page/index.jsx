/**
 * A generic Topcoder Community page, which cotains header, footer and content.
 */

/* TODO: I believe, we don't need separate Content and Header containers,
 * they should be just merged into this page container! */

import _ from 'lodash';
import Content from 'containers/tc-communities/Content';
import Footer from 'components/TopcoderFooter';
import Header from 'containers/tc-communities/Header';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import actions from 'actions/tc-communities/meta';

import AccessDenied, {
  CAUSE as ACCESS_DENIED_CAUSE,
} from 'components/tc-communities/AccessDenied';

import './style.scss';

class Page extends React.Component {

  componentDidMount() {
    const communityId = this.props.match.params.communityId;
    if ((communityId !== this.props.meta.communityId)
    && !this.props.meta.loading) this.props.loadMetaData(communityId);
  }

  render() {
    const communityId = this.props.match.params.communityId;
    if (this.props.profile && (communityId === this.props.meta.communityId)) {
      const userGroupIds = this.props.profile.groups.map(item => item.id);
      if (_.intersection(userGroupIds, this.props.meta.authorizedGroupIds || []).length) {
        return (
          <div>
            <Header {...this.props} />
            <Content {...this.props} />
            <Footer />
          </div>
        );
      }
      return <AccessDenied cause={ACCESS_DENIED_CAUSE.NOT_AUTHORIZED} />;
    } else if (this.props.authenticating || (communityId !== this.props.meta.communityId)) {
      return (
        <div styleName="loading">
          <LoadingIndicator />
        </div>
      );
    }
    return <AccessDenied cause={ACCESS_DENIED_CAUSE.NOT_AUTHENTICATED} />;
  }
}

Page.defaultProps = {
  profile: null,
};

Page.propTypes = {
  authenticating: PT.bool.isRequired,
  match: PT.shape({
    params: PT.shape({
      communityId: PT.string,
    }),
  }).isRequired,
  profile: PT.shape({
    groups: PT.arrayOf(PT.shape({
      id: PT.string.isRequired,
    })),
  }),
  loadMetaData: PT.func.isRequired,
  meta: PT.shape({
    authorizedGroupIds: PT.arrayOf(PT.string),
    communityId: PT.string,
    loading: PT.bool,
  }).isRequired,
};

export default connect(
  state => ({
    ...state.auth,
    meta: state.tcCommunities.meta,
  }),
  dispatch => ({
    loadMetaData: (communityId) => {
      dispatch(actions.tcCommunities.header.fetchDataInit());
      dispatch(actions.tcCommunities.header.fetchDataDone(communityId));
    },
  }),
)(Page);
