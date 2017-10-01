/**
 * Container for the standard Community Footer.
 */

import Footer from 'components/tc-communities/Footer';
import { connect } from 'react-redux';

function mapStateToProps(state) {
  /* NOTE: Any community-related components are rendered as descendants
   * of Community Loader, which does not render its content until proper
   * meta data are loaded into Redux store. Thus, no need to make any checks
   * of "meta" object here, we can rely it exists and is properly loaded. */
  const meta = state.tcCommunities.meta.data;
  return {
    communityId: meta.communityId,
    isAuthorized: Boolean(state.auth.profile),
    menuItems: meta.menuItems,
  };
}

export default connect(mapStateToProps)(Footer);
