/**
 * Container for dashboard announcement.
 */

import _ from 'lodash';
import Announcement from 'components/Dashboard/Announcement';
import ContentfulLoader from 'containers/ContentfulLoader';
import cookies from 'browser-cookies';
import LoadingIndicator from 'components/LoadingIndicator';
import moment from 'moment';
import PT from 'prop-types';
import React from 'react';
import uiActions from 'actions/page/dashboard';
import { connect } from 'react-redux';
import { isomorphy } from 'topcoder-react-utils';

const COOKIE = 'lastSeenDashboardAnnouncement';

class AnnouncementContainer extends React.Component {
  constructor(props) {
    super(props);
    this.rendered = false;
    this.now = moment().format();
  }

  render() {
    const {
      hidePreviewMetaData,
      previewId,
      show,
      switchShowAnnouncement,
    } = this.props;

    return (
      <ContentfulLoader
        entryQueries={{
          content_type: 'dashboardAnnouncement',
          'fields.startDate': {
            lt: this.now,
          },
          'fields.endDate': {
            gt: this.now,
          },
          limit: 1,
          order: '-fields.startDate',
        }}
        preview={Boolean(previewId)}
        render={(data) => {
          let announcement = data.entries.matches[0].items[0];
          if (!announcement) return null;
          announcement = data.entries.items[announcement];
          const backgroundAssetId =
            _.get(announcement.fields.backgroundImage, 'sys.id');

          const lastSeen = cookies.get(COOKIE);
          const thisId = announcement.sys.id;
          if (show && !this.rendered && isomorphy.isClientSide()
            && lastSeen === thisId) {
            this.rendered = true;
            switchShowAnnouncement(false);
          }

          return (
            <ContentfulLoader
              assetIds={backgroundAssetId}
              preview={data.preview}
              render={data2 => (
                <Announcement
                  assets={data2.assets.items}
                  announcement={announcement}
                  hidePreviewMetaData={hidePreviewMetaData}
                  loading={false}
                  preview={data.preview}
                  show={show}
                  switchShow={(on) => {
                    if (on) cookies.erase(COOKIE);
                    else cookies.set(COOKIE, thisId, { expires: 365 });
                    switchShowAnnouncement(on);
                  }}
                />
              )}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }}
        renderPlaceholder={LoadingIndicator}
      />
    );
  }
}

AnnouncementContainer.defaultProps = {
  hidePreviewMetaData: false,
  previewId: '',
};

AnnouncementContainer.propTypes = {
  hidePreviewMetaData: PT.bool,
  previewId: PT.string,
  show: PT.bool.isRequired,
  switchShowAnnouncement: PT.func.isRequired,
};

function mapStateToProps(state, props) {
  return {
    hidePreviewMetaData: props.hidePreviewMetaData,
    previewId: props.previewId,
    show: state.page.dashboard.showAnnouncement,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    switchShowAnnouncement: show =>
      dispatch(uiActions.page.dashboard.showAnnouncement(show)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnnouncementContainer);
