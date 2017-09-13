/**
 * Community Loader:
 * - Loads meta-data for the specified community;
 * - Checks visitor's authorization to access that community;
 * - Either renders community content, or the access denied page.
 */

/* global window */

import _ from 'lodash';
import AccessDenied, {
  CAUSE as ACCESS_DENIED_REASON,
} from 'components/tc-communities/AccessDenied';
import actions from 'actions/tc-communities/meta';
import config from 'utils/config';
import LoadingPagePlaceholder
  from 'components/tc-communities/LoadingPagePlaceholder';
import PT from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';

/**
 * When community Loader is mounted, and when it receives new props, these are
 * good moments to silently update community meta-data, to ensure that visitor
 * sees up-to-date information. It does not makes sense, though, to update them
 * too often. This value specifies the threshold between the latest update of
 * community meta-data and the earliest moment when they can be updated again.
 * It is not exposed to the general config to avoid polluting it. Most probably,
 * nobody will ever touch this constant.
 */
const MAXAGE = 60 * 1000; /* ms */

class Loader extends React.Component {
  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { communityId, loadingMetaDataForCommunityId, meta } = nextProps;

    /* We reload community meta-data when:
     * - No metadata is loaded or being loaded for the specified community;
     * - Already loaded metadata have been loaded more than MAXAGE ago. */
    if ((communityId !== loadingMetaDataForCommunityId) && (
      !meta || meta.communityId !== communityId
      || (Date.now() - meta.lastUpdateOfMetaData) > MAXAGE
    )) this.props.loadMetaData(communityId);

    /* TODO: This is a hacky way to handle SSO authentication for TopGear
     * (Wipro) community visitors. Should be re-factored, but not it is not
     * clear, what exactly do we need to support it in general. */
    if (communityId === 'wipro' && !this.props.visitorGroups) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location = `${config.URL.AUTH}/sso-login/?retUrl=${returnUrl}`;
    }
  }

  render() {
    const { Community, communityId, meta, visitorGroups } = this.props;

    /* Community meta-data are still being loaded. */

    if (!meta) {
      return <LoadingPagePlaceholder />;
    }

    const visitorGroupIds = visitorGroups ? visitorGroups.map(g => g.id) : null;
    const member = visitorGroupIds && meta.groupId
      && visitorGroupIds.includes(meta.groupId);

    /* Community does not require authorization. */
    if (!meta.authorizedGroupIds) return Community({ member, meta });

    /* Visitor is not authenticated. */
    if (!visitorGroups) {
      /* TODO: In case of TopGear (Wipro) community, if user is not
       * authenticated he is automatically redirected to SSO auth URL,
       * while that redirection is handled we want to show page loading
       * placeholder rather than access denied message. In future a more
       * generic implementation of this should be put here. */
      if (communityId === 'wipro') return <LoadingPagePlaceholder />;
      return <AccessDenied cause={ACCESS_DENIED_REASON.NOT_AUTHENTICATED} />;
    }

    /* Visitor belongs to at least one of the groups authorized to access this
     * community. */
    if (_.intersection(visitorGroupIds, meta.authorizedGroupIds).length) {
      return Community({ member, meta });
    }

    /* Visitor is not authorized to access this community. */
    return <AccessDenied cause={ACCESS_DENIED_REASON.NOT_AUTHORIZED} />;
  }
}

Loader.defaultProps = {
  meta: null,
  visitorGroups: null,
};

Loader.propTypes = {
  communityId: PT.string.isRequired,
  Community: PT.func.isRequired,
  loadingMetaDataForCommunityId: PT.string.isRequired,
  loadMetaData: PT.func.isRequired,
  meta: PT.shape({
    authorizedGroupIds: PT.arrayOf(PT.string),
    communityId: PT.string.isRequired,
  }),
  visitorGroups: PT.arrayOf(PT.shape({ id: PT.string.isRequired })),
};

function mapStateToProps(state, ownProps) {
  const communityId = ownProps.communityId;

  let meta = state.tcCommunities.meta;
  const loadingMetaDataForCommunityId = meta.loadingMetaDataForCommunityId;
  if (meta.communityId !== communityId) meta = null;

  return {
    communityId,
    Community: ownProps.communityComponent,
    loadingMetaDataForCommunityId,
    meta,
    visitorGroups: _.get(state, 'auth.profile.groups'),
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.tcCommunities.meta;
  return {
    loadMetaData: (communityId) => {
      dispatch(a.fetchDataInit(communityId));
      dispatch(a.fetchDataDone(communityId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
