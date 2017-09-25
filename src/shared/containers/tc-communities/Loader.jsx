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
import groupActions from 'actions/groups';
import LoadingPagePlaceholder
  from 'components/tc-communities/LoadingPagePlaceholder';
import PT from 'prop-types';
import React from 'react';

import { connect } from 'react-redux';
import { isGroupMember } from 'utils/tc';

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
    const { communityId, loadingCommunityData, meta } = nextProps;

    /* We reload community meta-data when:
     * - No metadata is loaded or being loaded for the specified community;
     * - Already loaded metadata have been loaded more than MAXAGE ago. */
    if (!loadingCommunityData && (
      !meta || meta.communityId !== communityId
      || (Date.now() - meta.lastUpdateOfMetaData) > MAXAGE
      || this.missingApiGroup()
    )) this.props.loadMetaData(communityId, nextProps.tokenV3);

    /* TODO: This is a hacky way to handle SSO authentication for TopGear
     * (Wipro) community visitors. Should be re-factored, but not it is not
     * clear, what exactly do we need to support it in general. */
    if (communityId === 'wipro' && !this.props.visitorGroups) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location = `${config.URL.AUTH}/sso-login/?retUrl=${returnUrl}`;
    }
  }

  /**
   * Assuming that community meta-data has been loaded, this method verifies
   * that detailed information about all related user groups also have been
   * loaded into.
   */
  missingApiGroup() {
    const { apiGroups, meta } = this.props;
    if (!meta) return false;
    if (meta.groupId && !apiGroups[meta.groupId]) return true;
    if (meta.authorizedGroupIds && meta.authorizedGroupIds.some(id =>
      !apiGroups[id])) return true;
    return false;
  }

  render() {
    const {
      apiGroups,
      Community,
      communityId,
      loadingCommunityData,
      meta,
      visitorGroups,
    } = this.props;

    /* Community meta-data are still being loaded. */

    if (loadingCommunityData || !meta) {
      return <LoadingPagePlaceholder />;
    }

    const member = visitorGroups && meta.groupId
      && isGroupMember(meta.groupId, visitorGroups, apiGroups);

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
    // if (_.intersection(visitorGroupIds, meta.authorizedGroupIds).length) {
    if (isGroupMember(meta.authorizedGroupIds, visitorGroups, apiGroups)) {
      return Community({ member, meta });
    }

    /* Visitor is not authorized to access this community. */
    return <AccessDenied cause={ACCESS_DENIED_REASON.NOT_AUTHORIZED} />;
  }
}

Loader.defaultProps = {
  meta: null,
  tokenV3: '',
  visitorGroups: null,
};

Loader.propTypes = {
  apiGroups: PT.shape().isRequired,
  communityId: PT.string.isRequired,
  Community: PT.func.isRequired,
  loadingCommunityData: PT.bool.isRequired,
  loadMetaData: PT.func.isRequired,
  meta: PT.shape({
    authorizedGroupIds: PT.arrayOf(PT.string),
    communityId: PT.string.isRequired,
  }),
  tokenV3: PT.string,
  visitorGroups: PT.arrayOf(PT.shape({ id: PT.string.isRequired })),
};

/**
 * Tests whether we are currently loading data for the specified community.
 * The data include:
 * - Community meta-data;
 * - Detailed information about all user groups referrenced in the meta-data.
 * @param {String} communityId Community ID to be tested.
 * @param {Object} state Redux state.
 * @return {Boolean} "true" if the data are being loaded now; "false" otherwise.
 */
function isLoading(communityId, state) {
  const meta = state.tcCommunities.meta;

  /* Yes, we are currently loading meta data for the specified community. */
  if (communityId === meta.loadingMetaDataForCommunityId) return true;

  /* Another community is loaded, thus we surely are not loading the specified
   * one. */
  if (communityId !== meta.communityId) return false;

  /* If we reached this point, it means that meta-data for the specified
   * community have been loaded; but we may still be loading detailed data
   * on the related user groups, so we should check it as well. */
  if (meta.groupId && state.groups.loading[meta.groupId]) return true;
  if (meta.authorizedGroupIds && meta.authorizedGroupIds.some(id =>
    state.groups.loading[id])) return true;

  /* Finally, if we are here, it means that all information relevant to the
   * specified community is loaded into the state now. */
  return false;
}

function mapStateToProps(state, ownProps) {
  const communityId = ownProps.communityId;

  let meta = state.tcCommunities.meta;
  if (meta.communityId !== communityId) meta = null;

  return {
    apiGroups: state.groups.groups,
    communityId,
    Community: ownProps.communityComponent,
    loadingCommunityData: isLoading(communityId, state),
    meta,
    tokenV3: _.get(state, 'auth.tokenV3'),
    visitorGroups: _.get(state, 'auth.profile.groups'),
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.tcCommunities.meta;
  const ga = groupActions.groups;
  return {
    loadMetaData: (communityId, tokenV3) => {
      dispatch(a.fetchDataInit(communityId));

      /* From this container's point of view, loading of detailed information
       * on all user groups referenced in the community meta-data, is also a
       * part of meta-data loading. */
      const action = a.fetchDataDone(communityId);
      action.payload.then((res) => {
        if (res.authorizedGroupIds) {
          res.authorizedGroupIds.forEach((id) => {
            dispatch(ga.getInit(id));
            dispatch(ga.getDone(id, tokenV3));
          });
        }
        if (res.groupId) {
          dispatch(ga.getInit(res.groupId));
          dispatch(ga.getDone(res.groupId));
        }
      });

      dispatch(action);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
