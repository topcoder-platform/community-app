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
    const {
      communityId, loadingMeta, meta, tokenV3,
    } = nextProps;

    if (!loadingMeta && (
      !meta || (Date.now() - meta.lastUpdateOfMetaData) > MAXAGE
    )) nextProps.loadMetaData(communityId, tokenV3);

    /* TODO: This is a hacky way to handle SSO authentication for TopGear
     * (Wipro) community visitors. Should be re-factored, but not it is not
     * clear, what exactly do we need to support it in general. */
    if (communityId === 'wipro' && !this.props.visitorGroups) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location = `${config.URL.AUTH}/sso-login/?retUrl=${returnUrl}`;
    }
  }

  render() {
    const {
      Community,
      communityId,
      meta,
      visitorGroups,
    } = this.props;

    /* In case we are missing meta data, or information about some user groups
     * we need, we show loading indicator (for better user experience, we are
     * fine to accept outdated data; such data will be silently refreshed
     * behind the scene shortly). */
    if (!meta) return <LoadingPagePlaceholder />;

    const visitorGroupIds = visitorGroups ? visitorGroups.map(g => g.id) : [];

    const member = visitorGroups && meta.groupIds
      && Boolean(_.intersection(meta.groupIds, visitorGroupIds.length));

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
    if (_.intersection(meta.authorizedGroupIds, visitorGroupIds).length) {
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
  Community: PT.func.isRequired,
  communityId: PT.string.isRequired,
  loadingMeta: PT.bool.isRequired,
  loadMetaData: PT.func.isRequired,
  meta: PT.shape({
    authorizedGroupIds: PT.arrayOf(PT.string),
    communityId: PT.string.isRequired,
  }),
  tokenV3: PT.string,
  visitorGroups: PT.arrayOf(PT.shape({ id: PT.string.isRequired })),
};

function mapStateToProps(state, ownProps) {
  const communityId = ownProps.communityId;

  let meta = state.tcCommunities.meta.data;
  const loadingMeta = communityId === meta.loadingMetaDataForCommunityId;
  if (meta.communityId !== communityId) meta = null;

  return {
    Community: ownProps.communityComponent,
    communityId,
    loadingMeta,
    meta,
    tokenV3: _.get(state, 'auth.tokenV3'),
    visitorGroups: _.get(state, 'auth.profile.groups'),
  };
}

function mapDispatchToProps(dispatch) {
  const a = actions.tcCommunities.meta;
  return {
    loadMetaData: (communityId, tokenV3) => {
      dispatch(a.fetchDataInit(communityId));
      dispatch(a.fetchDataDone(communityId, tokenV3));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
